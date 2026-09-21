import { BASE_SUGGESTED_STOPS } from "./mockData";
import {
  AddedPlaceDraft,
  PriorityLevel,
  TripExpense,
  TripStop,
  UserTripConfig,
} from "./types";

const BASELINE_GROUP_WEIGHT = 2.5;
const TRAVEL_BUFFER_MINUTES = 25;

function timeToMinutes(time: string) {
  const [hours = 0, minutes = 0] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(total: number) {
  const normalized = Math.max(0, Math.min(total, 23 * 60 + 59));
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return String(hours).padStart(2, "0") + ":" + String(minutes).padStart(2, "0");
}

function durationToMinutes(duration: string) {
  const hourMatch = duration.match(/(\d+)h/);
  const minuteMatch = duration.match(/(\d+)min/);
  const compactMinutes = duration.match(/h(\d{1,2})/);

  const hours = hourMatch ? Number(hourMatch[1]) : 0;
  const minutes = minuteMatch
    ? Number(minuteMatch[1])
    : compactMinutes
    ? Number(compactMinutes[1])
    : 0;

  return Math.max(30, hours * 60 + minutes);
}

function scaleCost(baseCost: number, config: UserTripConfig) {
  if (baseCost <= 0) return 0;
  const groupWeight = config.adults + config.children * 0.5;
  return Math.round((baseCost * groupWeight) / BASELINE_GROUP_WEIGHT);
}

function scoreStop(stop: TripStop, interests: string[]) {
  if (!interests.length) return 1;

  const haystack = (stop.name + " " + stop.category).toLowerCase();
  const interestKeywords: Record<string, string[]> = {
    Natureza: ["natureza", "parque", "jardim", "ar livre"],
    "Comer bem": ["gastronomia", "almoço", "café", "mercado", "restaurante"],
    Cultura: ["cultura", "museu", "arte", "pinacoteca"],
    Crianças: ["natureza", "parque", "passeio"],
    Compras: ["mercado", "paulista"],
    História: ["história", "museu", "centro"],
    "Experiências locais": ["mercado", "paulista", "beco"],
    Fotografia: ["foto", "arte urbana", "paulista", "parque"],
  };

  return interests.reduce((score, interest) => {
    const keywords = interestKeywords[interest] || [interest.toLowerCase()];
    return score + (keywords.some((keyword) => haystack.includes(keyword)) ? 3 : 0);
  }, 1);
}

function placeToStop(
  place: AddedPlaceDraft,
  config: UserTripConfig,
  priority: PriorityLevel
): TripStop {
  return {
    id: "user-" + place.id,
    name: place.name,
    category: place.category,
    scheduledTime: config.startTime,
    duration: place.duration,
    cost: scaleCost(place.cost, config),
    costType: place.costType,
    image: place.image,
    selectedByUser: true,
    priority,
    whyInRoute:
      priority === "required"
        ? "Você marcou este lugar como prioridade. O restante do dia foi organizado ao redor dele."
        : "Você escolheu este lugar e ele foi encaixado quando havia tempo e orçamento.",
    description: place.description,
    rating: 4.8,
    reviewCount: 340,
    neighborhood: place.neighborhood,
  };
}

function buildTransportExpenses(
  config: UserTripConfig,
  stopCount: number
): TripExpense[] {
  if (config.transportMode === "walking") {
    return [];
  }

  if (config.transportMode === "public_transit") {
    const estimate = Math.round(config.adults * 12 + config.children * 6);
    return [
      {
        id: "transport-public",
        type: "transport",
        description: "Transporte público ao longo do dia",
        estimatedCost: estimate,
        costType: "estimated",
      },
    ];
  }

  return [
    {
      id: "transport-car",
      type: "transport",
      description: "Combustível e estacionamentos",
      estimatedCost: 35 + Math.max(0, stopCount - 1) * 9,
      costType: "estimated",
    },
  ];
}

function scheduleStops(
  candidates: TripStop[],
  config: UserTripConfig
): TripStop[] {
  const start = timeToMinutes(config.startTime);
  const end = timeToMinutes(config.endTime);
  let cursor = start;
  const scheduled: TripStop[] = [];

  for (const stop of candidates) {
    const duration = durationToMinutes(stop.duration);
    const finish = cursor + duration;
    const isRequired = stop.priority === "required";

    if (finish > end && !isRequired) continue;

    scheduled.push({
      ...stop,
      scheduledTime: minutesToTime(cursor),
      arrivalTime: minutesToTime(cursor),
      departureOffsetMinutes: Math.max(0, cursor - start),
    });

    cursor = finish + TRAVEL_BUFFER_MINUTES;
  }

  return scheduled;
}

export function generateMockItinerary(
  config: UserTripConfig,
  userPlaces: AddedPlaceDraft[]
) {
  const userStops = userPlaces.map((place) =>
    placeToStop(place, config, place.priority)
  );

  const userNames = new Set(userStops.map((stop) => stop.name.toLowerCase()));

  const suggestions = BASE_SUGGESTED_STOPS
    .filter((stop) => !userNames.has(stop.name.toLowerCase()))
    .map((stop) => ({
      ...stop,
      cost: scaleCost(stop.cost, config),
      selectedByUser: false,
      priority: "suggested" as const,
    }))
    .sort(
      (a, b) =>
        scoreStop(b, config.interests) - scoreStop(a, config.interests)
    );

  const required = userStops.filter((stop) => stop.priority === "required");
  const preferred = userStops.filter((stop) => stop.priority === "preferred");

  const combined = [
    ...required,
    ...suggestions.slice(0, 3),
    ...preferred,
    ...suggestions.slice(3),
  ];

  let stops = scheduleStops(combined, config);
  let expenses = buildTransportExpenses(config, stops.length);

  const expenseTotal = expenses.reduce(
    (sum, expense) => sum + expense.estimatedCost,
    0
  );

  let planned = stops.reduce((sum, stop) => sum + stop.cost, 0) + expenseTotal;

  if (planned > config.budget) {
    const removable = [...stops]
      .filter((stop) => stop.priority === "suggested" && stop.cost > 0)
      .sort((a, b) => b.cost - a.cost);

    for (const stop of removable) {
      if (planned <= config.budget) break;
      stops = stops.filter((item) => item.id !== stop.id);
      planned -= stop.cost;
    }

    stops = scheduleStops(stops, config);
    expenses = buildTransportExpenses(config, stops.length);
  }

  return { stops, expenses };
}
