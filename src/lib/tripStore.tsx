import React, { createContext, useContext, useMemo, useState } from "react";
import {
  AddedPlaceDraft,
  PriorityLevel,
  StepState,
  TripExpense,
  TripStop,
  UserTripConfig,
} from "./types";
import { INITIAL_CONFIG } from "./mockData";
import { generateMockItinerary } from "./itineraryEngine";
import {
  calculateRemainingBudget,
  calculateTotalPlanned,
} from "./budgetEngine";

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

  selectedStop: TripStop | null;
  openStopDetail: (stop: TripStop) => void;
  closeStopDetail: () => void;
  toggleStopPriority: (stopId: string) => void;
  swapStopAlternative: (stopId: string) => void;

  isAddStopOpen: boolean;
  openAddStop: () => void;
  closeAddStop: () => void;
  handleAddStopToItinerary: (
    place: AddedPlaceDraft,
    priority: PriorityLevel
  ) => void;

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

  const goToStep = (nextStep: StepState) => {
    setStepHistory((prev) => [...prev, nextStep]);
    setStep(nextStep);
  };

  const goBack = () => {
    if (stepHistory.length > 1) {
      const newHistory = [...stepHistory];
      newHistory.pop();
      const previousStep = newHistory[newHistory.length - 1];
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
    setStepHistory(["home"]);
    setStep("home");
  };

  const updateConfig = (patch: Partial<UserTripConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  };

  const addUserDraftPlace = (place: AddedPlaceDraft) => {
    setUserDraftPlaces((prev) =>
      prev.some((item) => item.id === place.id) ? prev : [...prev, place]
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
              priority:
                place.priority === "required" ? "preferred" : "required",
            }
          : place
      )
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
  };

  const totalBudget = config.budget;
  const totalPlanned = useMemo(
    () => calculateTotalPlanned(stops, expenses),
    [stops, expenses]
  );
  const remainingBudget = useMemo(
    () => calculateRemainingBudget(totalBudget, stops, expenses),
    [totalBudget, stops, expenses]
  );

  const openStopDetail = (stop: TripStop) => setSelectedStop(stop);
  const closeStopDetail = () => setSelectedStop(null);

  const toggleStopPriority = (stopId: string) => {
    setStops((prev) =>
      prev.map((stop) => {
        if (stop.id !== stopId) return stop;

        const nextPriority =
          stop.priority === "required" ? "suggested" : "required";

        return {
          ...stop,
          priority: nextPriority,
          selectedByUser: true,
          whyInRoute:
            nextPriority === "required"
              ? "Você marcou este local como prioridade. O roteiro deve preservar essa escolha."
              : "Sugestão ajustada de acordo com as preferências do seu grupo.",
        };
      })
    );

    if (selectedStop?.id === stopId) {
      setSelectedStop((prev) =>
        prev
          ? {
              ...prev,
              priority:
                prev.priority === "required" ? "suggested" : "required",
              selectedByUser: true,
            }
          : null
      );
    }

    setLastFeedbackMessage("Prioridade atualizada.");
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
      })
    );

    setSelectedStop(null);
    setLastFeedbackMessage("Parada substituída por uma alternativa mais econômica.");
  };

  const openAddStop = () => setIsAddStopOpen(true);
  const closeAddStop = () => setIsAddStopOpen(false);

  const createStopFromPlace = (
    place: AddedPlaceDraft,
    priority: PriorityLevel
  ): TripStop => ({
    id: "stop-" + Date.now(),
    name: place.name,
    category: place.category,
    scheduledTime: config.startTime,
    duration: place.duration,
    cost: place.cost,
    costType: place.costType,
    image: place.image,
    selectedByUser: true,
    priority,
    whyInRoute:
      priority === "required"
        ? "Você escolheu este lugar como parada obrigatória. O restante do roteiro será ajustado ao redor dele."
        : "Você adicionou este lugar e ele foi encaixado onde havia espaço no dia.",
    description: place.description,
    rating: 4.8,
    reviewCount: 340,
    neighborhood: place.neighborhood,
  });

  const handleAddStopToItinerary = (
    place: AddedPlaceDraft,
    priority: PriorityLevel
  ) => {
    setIsAddStopOpen(false);
    const potentialNewTotal = totalPlanned + place.cost;

    if (potentialNewTotal > totalBudget && priority === "required") {
      setConflict({
        place,
        overflowAmount: potentialNewTotal - totalBudget,
        newTotal: potentialNewTotal,
      });
      return;
    }

    const newStop = createStopFromPlace(place, priority);

    setStops((prev) => {
      const copy = [...prev];
      const insertionIndex = Math.max(1, copy.length - 1);
      copy.splice(insertionIndex, 0, newStop);
      return copy;
    });

    setLastFeedbackMessage(
      '"' + place.name + '" foi adicionado. O restante do dia foi preservado.'
    );
  };

  const resolveKeepAndAdjust = () => {
    if (!conflict) return;
    const { place } = conflict;

    setStops((prev) => {
      const candidates = prev
        .filter((stop) => stop.priority === "suggested" && stop.cost > 0)
        .sort((a, b) => b.cost - a.cost);

      const stopToAdjust = candidates[0];
      const adjusted = stopToAdjust
        ? prev.map((stop) =>
            stop.id === stopToAdjust.id
              ? {
                  ...stop,
                  name: stop.name + " — opção gratuita",
                  cost: 0,
                  costType: "free" as const,
                  whyInRoute:
                    "Ajustado para uma alternativa gratuita a fim de preservar sua escolha prioritária.",
                }
              : stop
          )
        : prev;

      const newStop = createStopFromPlace(place, "required");
      const copy = [...adjusted];
      copy.splice(Math.max(1, copy.length - 1), 0, newStop);
      return copy;
    });

    setConflict(null);
    setLastFeedbackMessage(
      'Mantivemos "' +
        place.name +
        '" e ajustamos uma parada secundária para proteger seu orçamento.'
    );
  };

  const resolveChangePlace = () => {
    setConflict(null);
    setIsAddStopOpen(true);
  };

  const resolveIncreaseBudget = () => {
    if (!conflict) return;
    const { place, newTotal } = conflict;

    setConfig((prev) => ({ ...prev, budget: newTotal }));
    const newStop = createStopFromPlace(place, "required");

    setStops((prev) => {
      const copy = [...prev];
      copy.splice(Math.max(1, copy.length - 1), 0, newStop);
      return copy;
    });

    setConflict(null);
    setLastFeedbackMessage(
      'Orçamento atualizado para R$' +
        newTotal +
        ' e "' +
        place.name +
        '" foi mantido.'
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
          "Simulamos uma opção gastronômica próxima sem alterar suas prioridades."
        );
        break;
      case "rest":
        setLastFeedbackMessage(
          "Incluímos uma pausa curta sem comprometer o horário final."
        );
        break;
      case "free":
        setStops((prev) =>
          prev.map((stop, index) =>
            index === tourStopIndex &&
            stop.cost > 0 &&
            stop.priority !== "required"
              ? {
                  ...stop,
                  name: stop.name + " — alternativa gratuita",
                  cost: 0,
                  costType: "free",
                }
              : stop
          )
        );
        setLastFeedbackMessage(
          "A próxima parada flexível foi trocada por uma alternativa gratuita."
        );
        break;
      case "save":
        setLastFeedbackMessage(
          "Priorizamos opções de menor custo nas próximas paradas flexíveis."
        );
        break;
      case "indoor":
        setLastFeedbackMessage(
          "Simulamos opções cobertas para as próximas paradas."
        );
        break;
      case "add":
        setIsAddStopOpen(true);
        break;
      case "change":
        setLastFeedbackMessage(
          "O foco das próximas paradas foi ajustado sem remover suas prioridades."
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
