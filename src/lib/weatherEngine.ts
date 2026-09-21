import {
  TripStop,
  WeatherRisk,
  WeatherSlot,
  WeatherSummary,
} from "./types";

function hourFromTime(time: string) {
  const [hours = 0] = time.split(":").map(Number);
  return hours;
}

export function getWeatherSlotForTime(
  time: string,
  forecast: WeatherSlot[],
): WeatherSlot | undefined {
  const targetHour = hourFromTime(time);

  return forecast.reduce<WeatherSlot | undefined>((closest, slot) => {
    if (!closest) return slot;

    const currentDistance = Math.abs(hourFromTime(slot.time) - targetHour);
    const closestDistance = Math.abs(
      hourFromTime(closest.time) - targetHour,
    );

    return currentDistance < closestDistance ? slot : closest;
  }, undefined);
}

function riskForStop(stop: TripStop, slot?: WeatherSlot): WeatherRisk {
  if (!slot || stop.weatherSensitivity === "indoor") return "none";

  const probability = slot.precipitationProbability;

  if (stop.weatherSensitivity === "outdoor") {
    if (probability >= 60) return "conflict";
    if (probability >= 40) return "watch";
  }

  if (stop.weatherSensitivity === "mixed") {
    if (probability >= 75) return "conflict";
    if (probability >= 50) return "watch";
  }

  return "none";
}

export function annotateStopsWithWeather(
  stops: TripStop[],
  forecast: WeatherSlot[],
): TripStop[] {
  return stops.map((stop) => {
    const slot = getWeatherSlotForTime(stop.scheduledTime, forecast);
    const weatherRisk = riskForStop(stop, slot);

    if (!slot || weatherRisk === "none") {
      return {
        ...stop,
        weatherRisk: "none",
        weatherProbability: slot?.precipitationProbability,
        weatherNote: undefined,
      };
    }

    const label =
      weatherRisk === "conflict"
        ? "Chuva provável neste horário"
        : "Vale acompanhar a previsão";

    return {
      ...stop,
      weatherRisk,
      weatherProbability: slot.precipitationProbability,
      weatherNote:
        label +
        " • " +
        slot.precipitationProbability +
        "% de precipitação",
    };
  });
}

export function summarizeWeatherImpact(
  stops: TripStop[],
  forecast: WeatherSlot[],
): WeatherSummary {
  const annotated = annotateStopsWithWeather(stops, forecast);
  const conflicts = annotated.filter(
    (stop) => stop.weatherRisk === "conflict",
  );
  const watches = annotated.filter((stop) => stop.weatherRisk === "watch");

  const peak = forecast.reduce<WeatherSlot | undefined>((highest, slot) => {
    if (!highest) return slot;
    return slot.precipitationProbability > highest.precipitationProbability
      ? slot
      : highest;
  }, undefined);

  if (conflicts.length > 0) {
    return {
      level: "conflict",
      headline:
        "Chuva pode atrapalhar " +
        conflicts.length +
        (conflicts.length === 1 ? " parada externa" : " paradas externas"),
      detail:
        "Há atividade ao ar livre próxima do período de maior chance de chuva. Podemos reorganizar os horários sem remover suas prioridades.",
      affectedStopIds: conflicts.map((stop) => stop.id),
      peakPrecipitationProbability:
        peak?.precipitationProbability ?? 0,
      peakTime: peak?.time,
    };
  }

  if (watches.length > 0) {
    return {
      level: "watch",
      headline: "Há chance de chuva durante o passeio",
      detail:
        "Algumas atividades externas merecem atenção. O roteiro ainda é viável, mas a previsão pode mudar.",
      affectedStopIds: watches.map((stop) => stop.id),
      peakPrecipitationProbability:
        peak?.precipitationProbability ?? 0,
      peakTime: peak?.time,
    };
  }

  return {
    level: "none",
    headline:
      peak && peak.precipitationProbability >= 60
        ? "Há chuva prevista, mas o roteiro está protegido"
        : "Clima sem conflito importante no roteiro",
    detail:
      peak && peak.precipitationProbability >= 60
        ? "As atividades mais sensíveis ao clima não estão no período mais chuvoso."
        : "Nenhuma parada atual precisa ser alterada por causa da previsão simulada.",
    affectedStopIds: [],
    peakPrecipitationProbability:
      peak?.precipitationProbability ?? 0,
    peakTime: peak?.time,
  };
}

export function optimizeStopsForWeather(
  stops: TripStop[],
  forecast: WeatherSlot[],
) {
  let reordered = [...stops];
  let swaps = 0;

  for (let index = 0; index < reordered.length; index += 1) {
    const currentAnnotated = annotateStopsWithWeather(reordered, forecast);
    const current = currentAnnotated[index];

    if (!current || current.weatherRisk !== "conflict") continue;

    const currentSlotTime = reordered[index]?.scheduledTime;
    if (!currentSlotTime) continue;

    let bestIndex = -1;
    let bestProbability = Number.POSITIVE_INFINITY;

    for (let candidateIndex = 0; candidateIndex < reordered.length; candidateIndex += 1) {
      if (candidateIndex === index) continue;

      const candidate = reordered[candidateIndex];
      const candidateTime = candidate?.scheduledTime;

      if (!candidate || !candidateTime) continue;
      if (candidate.weatherSensitivity !== "indoor") continue;

      const alternativeSlot = getWeatherSlotForTime(candidateTime, forecast);
      const outdoorRiskAtAlternative = riskForStop(
        { ...current, scheduledTime: candidateTime },
        alternativeSlot,
      );

      if (outdoorRiskAtAlternative === "conflict") continue;

      const probability = alternativeSlot?.precipitationProbability ?? 100;
      if (probability < bestProbability) {
        bestProbability = probability;
        bestIndex = candidateIndex;
      }
    }

    if (bestIndex === -1) continue;

    const first = reordered[index];
    const second = reordered[bestIndex];

    if (!first || !second) continue;

    const firstTime = first.scheduledTime;
    const secondTime = second.scheduledTime;
    const firstArrival = first.arrivalTime;
    const secondArrival = second.arrivalTime;

    reordered[index] = {
      ...second,
      scheduledTime: firstTime,
      arrivalTime: firstArrival ?? firstTime,
    };
    reordered[bestIndex] = {
      ...first,
      scheduledTime: secondTime,
      arrivalTime: secondArrival ?? secondTime,
    };

    swaps += 1;
  }

  return {
    stops: annotateStopsWithWeather(reordered, forecast),
    swaps,
  };
}
