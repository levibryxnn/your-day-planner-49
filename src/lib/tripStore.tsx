import React, { createContext, useContext, useMemo, useState } from "react";
import {
  AddedPlaceDraft,
  PriorityLevel,
  StepState,
  TripExpense,
  TripStop,
  UserTripConfig,
  WeatherSlot,
  WeatherSummary,
} from "./types";
import type { RotaWeatherForecast } from "./domain";
import { INITIAL_CONFIG, MOCK_HOURLY_WEATHER } from "./mockData";
import {
  annotateStopsWithWeather,
  optimizeStopsForWeather,
  summarizeWeatherImpact,
} from "./weatherEngine";
import { generateMockItinerary } from "./itineraryEngine";
import { calculateRemainingBudget, calculateTotalPlanned } from "./budgetEngine";
import { IS_STATIC_DEMO } from "./runtime";

interface ConflictInfo {
  place: AddedPlaceDraft;
  overflowAmount: number;
  newTotal: number;
}

interface TripContextType {
  step: StepState;
  goToStep: (nextStep: StepState) => void;
  goBack: () => void;
  resetTrip: () => void;

  config: UserTripConfig;
  updateConfig: (patch: Partial<UserTripConfig>) => void;

  userDraftPlaces: AddedPlaceDraft[];
  addUserDraftPlace: (place: AddedPlaceDraft) => void;
  removeUserDraftPlace: (placeId: string) => void;
  toggleDraftPriority: (placeId: string) => void;

  stops: TripStop[];
  expenses: TripExpense[];
  generateItinerary: (placesOverride?: AddedPlaceDraft[]) => void;
  totalBudget: number;
  totalPlanned: number;
  remainingBudget: number;

  weatherForecast: WeatherSlot[];
  weatherSummary: WeatherSummary;
  optimizeForWeather: () => void;

  selectedStop: TripStop | null;
  openStopDetail: (stop: TripStop) => void;
  closeStopDetail: () => void;
  toggleStopPriority: (stopId: string) => void;
  swapStopAlternative: (stopId: string) => void;

  isAddStopOpen: boolean;
  openAddStop: () => void;
  closeAddStop: () => void;
  handleAddStopToItinerary: (place: AddedPlaceDraft, priority: PriorityLevel) => void;

  conflict: ConflictInfo | null;
  resolveKeepAndAdjust: () => void;
  resolveChangePlace: () => void;
  resolveIncreaseBudget: () => void;
  dismissConflict: () => void;

  tourStopIndex: number;
  nextTourStop: () => void;
  prevTourStop: () => void;
  isIntentModalOpen: boolean;
  openIntentModal: () => void;
  closeIntentModal: () => void;
  handleSelectIntent: (intentId: string) => void;
  lastFeedbackMessage: string | null;
  clearFeedbackMessage: () => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);
const INITIAL_PLAN = generateMockItinerary(INITIAL_CONFIG, []);

function liveForecastToWeatherSlots(forecast: RotaWeatherForecast): WeatherSlot[] {
  return forecast.hours.flatMap((hour) => {
    const temperatureC = hour.temperatureC.value;
    const precipitationProbability = hour.precipitationProbability.value;
    if (temperatureC === undefined || precipitationProbability === undefined) {
      return [];
    }

    const description = hour.condition.value ?? "Condição não informada";
    const normalized = description.toLowerCase();
    const condition = normalized.includes("trovo")
      ? "storm"
      : normalized.includes("chuva")
        ? "rain"
        : normalized.includes("nubl")
          ? "cloudy"
          : "clear";

    return [
      {
        time: hour.timeIso.slice(11, 16),
        temperatureC,
        precipitationProbability,
        condition,
        description,
      } satisfies WeatherSlot,
    ];
  });
}

export function TripProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState<StepState>("home");
  const [stepHistory, setStepHistory] = useState<StepState[]>(["home"]);

  const [config, setConfig] = useState<UserTripConfig>(INITIAL_CONFIG);
  const [userDraftPlaces, setUserDraftPlaces] = useState<AddedPlaceDraft[]>([]);
  const [stops, setStops] = useState<TripStop[]>(INITIAL_PLAN.stops);
  const [expenses, setExpenses] = useState<TripExpense[]>(INITIAL_PLAN.expenses);
  const [selectedStop, setSelectedStop] = useState<TripStop | null>(null);

  const [isAddStopOpen, setIsAddStopOpen] = useState(false);
  const [conflict, setConflict] = useState<ConflictInfo | null>(null);

  const [tourStopIndex, setTourStopIndex] = useState(0);
  const [isIntentModalOpen, setIsIntentModalOpen] = useState(false);
  const [lastFeedbackMessage, setLastFeedbackMessage] = useState<string | null>(null);
  const [weatherForecast, setWeatherForecast] = useState<WeatherSlot[]>(MOCK_HOURLY_WEATHER);

  const goToStep = (nextStep: StepState) => {
    setStepHistory((prev) => [...prev, nextStep]);
    setStep(nextStep);
  };

  const goBack = () => {
    if (stepHistory.length > 1) {
      const newHistory = [...stepHistory];
      newHistory.pop();
      const previousStep = newHistory[newHistory.length - 1] ?? "home";
      setStepHistory(newHistory);
      setStep(previousStep);
      return;
    }

    setStep("home");
  };

  const resetTrip = () => {
    const nextPlan = generateMockItinerary(INITIAL_CONFIG, []);
    setConfig(INITIAL_CONFIG);
    setUserDraftPlaces([]);
    setStops(nextPlan.stops);
    setExpenses(nextPlan.expenses);
    setSelectedStop(null);
    setConflict(null);
    setTourStopIndex(0);
    setLastFeedbackMessage(null);
    setWeatherForecast(MOCK_HOURLY_WEATHER);
    setStepHistory(["home"]);
    setStep("home");
  };

  const updateConfig = (patch: Partial<UserTripConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  };

  const refreshLiveWeather = async (nextConfig: UserTripConfig) => {
    if (IS_STATIC_DEMO) return;

    try {
      const params = new URLSearchParams({
        lat: String(nextConfig.destination.latitude),
        lon: String(nextConfig.destination.longitude),
        date: nextConfig.tripDate,
        timezone: nextConfig.destination.timeZone,
        hours: "24",
      });
      const response = await fetch("/api/weather?" + params);
      if (!response.ok) return;

      const result = (await response.json()) as {
        ok?: boolean;
        data?: RotaWeatherForecast;
      };
      if (!result.ok || !result.data) return;

      const nextForecast = liveForecastToWeatherSlots(result.data);
      if (nextForecast.length === 0) return;

      setWeatherForecast(nextForecast);
      setStops((previousStops) => annotateStopsWithWeather(previousStops, nextForecast));
    } catch {
      // Keep the last safe forecast when the provider is unavailable.
    }
  };

  const addUserDraftPlace = (place: AddedPlaceDraft) => {
    setUserDraftPlaces((prev) =>
      prev.some((item) => item.id === place.id) ? prev : [...prev, place],
    );
  };

  const removeUserDraftPlace = (placeId: string) => {
    setUserDraftPlaces((prev) => prev.filter((place) => place.id !== placeId));
  };

  const toggleDraftPriority = (placeId: string) => {
    setUserDraftPlaces((prev) =>
      prev.map((place) =>
        place.id === placeId
          ? {
              ...place,
              priority: place.priority === "required" ? "preferred" : "required",
            }
          : place,
      ),
    );
  };

  const generateItinerary = (placesOverride?: AddedPlaceDraft[]) => {
    const chosenPlaces = placesOverride ?? userDraftPlaces;
    const nextPlan = generateMockItinerary(config, chosenPlaces);

    if (placesOverride) setUserDraftPlaces(placesOverride);
    setStops(nextPlan.stops);
    setExpenses(nextPlan.expenses);
    setTourStopIndex(0);
    setSelectedStop(null);
    setConflict(null);
    setLastFeedbackMessage(null);
    void refreshLiveWeather(config);
  };

  const totalBudget = config.budget;
  const totalPlanned = useMemo(() => calculateTotalPlanned(stops, expenses), [stops, expenses]);
  const remainingBudget = useMemo(
    () => calculateRemainingBudget(totalBudget, stops, expenses),
    [totalBudget, stops, expenses],
  );

  const weatherSummary = useMemo(
    () => summarizeWeatherImpact(stops, weatherForecast),
    [stops, weatherForecast],
  );

  const optimizeForWeather = () => {
    const result = optimizeStopsForWeather(stops, weatherForecast);
    setStops(result.stops);
    setSelectedStop(null);

    setLastFeedbackMessage(
      result.swaps > 0
        ? "Reorganizamos " +
            result.swaps +
            (result.swaps === 1 ? " parada" : " paradas") +
            " para reduzir a exposição à chuva, sem remover suas prioridades."
        : "Não encontramos uma troca de horário melhor. Mantivemos o roteiro e sinalizamos o risco climático.",
    );
  };

  const openStopDetail = (stop: TripStop) => setSelectedStop(stop);
  const closeStopDetail = () => setSelectedStop(null);

  const toggleStopPriority = (stopId: string) => {
    const target = stops.find((stop) => stop.id === stopId);
    if (!target) return;

    const nextPriority: PriorityLevel = target.priority === "required" ? "preferred" : "required";

    const draftFromStop: AddedPlaceDraft = {
      id: target.id.startsWith("user-") ? target.id.replace(/^user-/, "") : "saved-" + target.id,
      name: target.name,
      category: target.category,
      cost: target.baseCost ?? target.cost,
      costType: target.costType,
      ...(target.pricing ? { pricing: target.pricing } : {}),
      ...(target.weatherSensitivity ? { weatherSensitivity: target.weatherSensitivity } : {}),
      ...(target.dataConfidence ? { dataConfidence: target.dataConfidence } : {}),
      ...(target.source ? { source: target.source } : {}),
      duration: target.duration,
      image: target.image,
      priority: nextPriority === "required" ? "required" : "preferred",
      neighborhood: target.neighborhood ?? config.destination.name,
      description: target.description,
    };

    setUserDraftPlaces((prev) => {
      const matchingIndex = prev.findIndex(
        (place) =>
          place.id === draftFromStop.id || place.name.toLowerCase() === target.name.toLowerCase(),
      );

      if (matchingIndex === -1) {
        return [...prev, draftFromStop];
      }

      return prev.map((place, index) =>
        index === matchingIndex ? { ...place, priority: draftFromStop.priority } : place,
      );
    });

    setStops((prev) =>
      prev.map((stop) =>
        stop.id === stopId
          ? {
              ...stop,
              priority: nextPriority,
              selectedByUser: true,
              whyInRoute:
                nextPriority === "required"
                  ? "Você marcou este local como prioridade. O roteiro deve preservar essa escolha."
                  : "Você quer este lugar no roteiro, mas permite ajustes se tempo ou orçamento exigirem.",
            }
          : stop,
      ),
    );

    setSelectedStop((prev) =>
      prev?.id === stopId
        ? {
            ...prev,
            priority: nextPriority,
            selectedByUser: true,
            whyInRoute:
              nextPriority === "required"
                ? "Você marcou este local como prioridade. O roteiro deve preservar essa escolha."
                : "Você quer este lugar no roteiro, mas permite ajustes se tempo ou orçamento exigirem.",
          }
        : prev,
    );

    setLastFeedbackMessage(
      nextPriority === "required"
        ? "Esta parada agora é prioridade."
        : "Esta parada ficou flexível, mas continua sendo uma escolha sua.",
    );
  };

  const swapStopAlternative = (stopId: string) => {
    setStops((prev) =>
      prev.map((stop) => {
        if (stop.id !== stopId) return stop;

        return {
          ...stop,
          name: stop.name.includes("MAM")
            ? "Jardim das Esculturas"
            : stop.name.includes("Café")
              ? "Pausa em praça arborizada"
              : stop.name,
          cost: Math.max(0, stop.cost - 20),
          costType: stop.cost <= 20 ? "free" : stop.costType,
          whyInRoute:
            "Substituição simulada por uma alternativa mais econômica e compatível com o dia.",
        };
      }),
    );

    setSelectedStop(null);
    setLastFeedbackMessage("Parada substituída por uma alternativa mais econômica.");
  };

  const openAddStop = () => setIsAddStopOpen(true);
  const closeAddStop = () => setIsAddStopOpen(false);

  const handleAddStopToItinerary = (place: AddedPlaceDraft, priority: PriorityLevel) => {
    setIsAddStopOpen(false);

    const placeWithPriority: AddedPlaceDraft = {
      ...place,
      priority: priority === "required" ? "required" : "preferred",
    };
    const nextUserPlaces = [
      ...userDraftPlaces.filter((item) => item.id !== place.id),
      placeWithPriority,
    ];

    const nextPlan = generateMockItinerary(config, nextUserPlaces);
    const nextTotal = calculateTotalPlanned(nextPlan.stops, nextPlan.expenses);

    if (nextTotal > totalBudget && priority === "required") {
      setConflict({
        place: placeWithPriority,
        overflowAmount: nextTotal - totalBudget,
        newTotal: nextTotal,
      });
      return;
    }

    setUserDraftPlaces(nextUserPlaces);
    setStops(nextPlan.stops);
    setExpenses(nextPlan.expenses);
    setTourStopIndex(0);
    setSelectedStop(null);
    setLastFeedbackMessage(
      '"' + place.name + '" foi incluído e o restante do dia foi reorganizado.',
    );
    void refreshLiveWeather(config);
  };

  const resolveKeepAndAdjust = () => {
    if (!conflict) return;

    const nextUserPlaces = [
      ...userDraftPlaces.filter((item) => item.id !== conflict.place.id),
      { ...conflict.place, priority: "required" as const },
    ];
    const nextPlan = generateMockItinerary(config, nextUserPlaces);

    setUserDraftPlaces(nextUserPlaces);
    setStops(nextPlan.stops);
    setExpenses(nextPlan.expenses);
    setTourStopIndex(0);
    setSelectedStop(null);
    setConflict(null);
    setLastFeedbackMessage(
      'Mantivemos "' + conflict.place.name + '" e reorganizamos primeiro as paradas flexíveis.',
    );
  };

  const resolveChangePlace = () => {
    setConflict(null);
    setIsAddStopOpen(true);
  };

  const resolveIncreaseBudget = () => {
    if (!conflict) return;

    const nextConfig: UserTripConfig = {
      ...config,
      budget: conflict.newTotal,
    };
    const nextUserPlaces = [
      ...userDraftPlaces.filter((item) => item.id !== conflict.place.id),
      { ...conflict.place, priority: "required" as const },
    ];
    const nextPlan = generateMockItinerary(nextConfig, nextUserPlaces);

    setConfig(nextConfig);
    setUserDraftPlaces(nextUserPlaces);
    setStops(nextPlan.stops);
    setExpenses(nextPlan.expenses);
    setTourStopIndex(0);
    setSelectedStop(null);
    setConflict(null);
    setLastFeedbackMessage(
      "Orçamento atualizado para R$" +
        conflict.newTotal +
        ' e "' +
        conflict.place.name +
        '" foi mantido.',
    );
  };

  const dismissConflict = () => setConflict(null);

  const nextTourStop = () => {
    if (tourStopIndex < stops.length - 1) {
      setTourStopIndex((prev) => prev + 1);
    }
  };

  const prevTourStop = () => {
    if (tourStopIndex > 0) {
      setTourStopIndex((prev) => prev - 1);
    }
  };

  const openIntentModal = () => setIsIntentModalOpen(true);
  const closeIntentModal = () => setIsIntentModalOpen(false);

  const handleSelectIntent = (intentId: string) => {
    setIsIntentModalOpen(false);

    switch (intentId) {
      case "eat":
        setLastFeedbackMessage(
          "Simulamos uma opção gastronômica próxima sem alterar suas prioridades.",
        );
        break;
      case "rest":
        setLastFeedbackMessage("Incluímos uma pausa curta sem comprometer o horário final.");
        break;
      case "free":
        setStops((prev) =>
          prev.map((stop, index) =>
            index === tourStopIndex && stop.cost > 0 && stop.priority !== "required"
              ? {
                  ...stop,
                  name: stop.name + " — alternativa gratuita",
                  cost: 0,
                  costType: "free",
                }
              : stop,
          ),
        );
        setLastFeedbackMessage(
          "A próxima parada flexível foi trocada por uma alternativa gratuita.",
        );
        break;
      case "save":
        setLastFeedbackMessage("Priorizamos opções de menor custo nas próximas paradas flexíveis.");
        break;
      case "indoor":
        setLastFeedbackMessage("Simulamos opções cobertas para as próximas paradas.");
        break;
      case "add":
        setIsAddStopOpen(true);
        break;
      case "change":
        setLastFeedbackMessage(
          "O foco das próximas paradas foi ajustado sem remover suas prioridades.",
        );
        break;
      default:
        break;
    }
  };

  const clearFeedbackMessage = () => setLastFeedbackMessage(null);

  return (
    <TripContext.Provider
      value={{
        step,
        goToStep,
        goBack,
        resetTrip,
        config,
        updateConfig,
        userDraftPlaces,
        addUserDraftPlace,
        removeUserDraftPlace,
        toggleDraftPriority,
        stops,
        expenses,
        generateItinerary,
        totalBudget,
        totalPlanned,
        remainingBudget,
        weatherForecast,
        weatherSummary,
        optimizeForWeather,
        selectedStop,
        openStopDetail,
        closeStopDetail,
        toggleStopPriority,
        swapStopAlternative,
        isAddStopOpen,
        openAddStop,
        closeAddStop,
        handleAddStopToItinerary,
        conflict,
        resolveKeepAndAdjust,
        resolveChangePlace,
        resolveIncreaseBudget,
        dismissConflict,
        tourStopIndex,
        nextTourStop,
        prevTourStop,
        isIntentModalOpen,
        openIntentModal,
        closeIntentModal,
        handleSelectIntent,
        lastFeedbackMessage,
        clearFeedbackMessage,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTripStore() {
  const context = useContext(TripContext);

  if (!context) {
    throw new Error("useTripStore must be used within a TripProvider");
  }

  return context;
}
