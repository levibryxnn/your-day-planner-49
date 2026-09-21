import React, { createContext, useContext, useState, useMemo } from "react";
import {
  TripStop,
  UserTripConfig,
  AddedPlaceDraft,
  StepState,
  PriorityLevel,
} from "./types";
import { INITIAL_CONFIG, INITIAL_STOPS, AVAILABLE_MOCK_PLACES } from "./mockData";

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

  // Config
  config: UserTripConfig;
  updateConfig: (patch: Partial<UserTripConfig>) => void;

  // User places selection before generation
  userDraftPlaces: AddedPlaceDraft[];
  addUserDraftPlace: (place: AddedPlaceDraft) => void;
  removeUserDraftPlace: (placeId: string) => void;
  toggleDraftPriority: (placeId: string) => void;

  // Stops and itinerary
  stops: TripStop[];
  totalBudget: number;
  totalPlanned: number;
  remainingBudget: number;

  // Detail sheet
  selectedStop: TripStop | null;
  openStopDetail: (stop: TripStop) => void;
  closeStopDetail: () => void;
  toggleStopPriority: (stopId: string) => void;
  swapStopAlternative: (stopId: string) => void;

  // Adding stop post-generation
  isAddStopOpen: boolean;
  openAddStop: () => void;
  closeAddStop: () => void;
  handleAddStopToItinerary: (place: AddedPlaceDraft, priority: PriorityLevel) => void;

  // Conflict management
  conflict: ConflictInfo | null;
  resolveKeepAndAdjust: () => void;
  resolveChangePlace: () => void;
  resolveIncreaseBudget: () => void;
  dismissConflict: () => void;

  // Tour Mode
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

export function TripProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState<StepState>("home");
  const [stepHistory, setStepHistory] = useState<StepState[]>(["home"]);

  const [config, setConfig] = useState<UserTripConfig>(INITIAL_CONFIG);
  const [userDraftPlaces, setUserDraftPlaces] = useState<AddedPlaceDraft[]>([
    AVAILABLE_MOCK_PLACES[0], // Pre-selected Mocotó
  ]);

  const [stops, setStops] = useState<TripStop[]>(INITIAL_STOPS);
  const [selectedStop, setSelectedStop] = useState<TripStop | null>(null);

  const [isAddStopOpen, setIsAddStopOpen] = useState(false);
  const [conflict, setConflict] = useState<ConflictInfo | null>(null);

  const [tourStopIndex, setTourStopIndex] = useState(0);
  const [isIntentModalOpen, setIsIntentModalOpen] = useState(false);
  const [lastFeedbackMessage, setLastFeedbackMessage] = useState<string | null>(null);

  // Navigation
  const goToStep = (nextStep: StepState) => {
    setStepHistory((prev) => [...prev, nextStep]);
    setStep(nextStep);
  };

  const goBack = () => {
    if (stepHistory.length > 1) {
      const newHistory = [...stepHistory];
      newHistory.pop();
      const prevStep = newHistory[newHistory.length - 1];
      setStepHistory(newHistory);
      setStep(prevStep);
    } else {
      setStep("home");
    }
  };

  const resetTrip = () => {
    setConfig(INITIAL_CONFIG);
    setUserDraftPlaces([AVAILABLE_MOCK_PLACES[0]]);
    setStops(INITIAL_STOPS);
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

  // Draft places handlers
  const addUserDraftPlace = (place: AddedPlaceDraft) => {
    if (!userDraftPlaces.some((p) => p.id === place.id)) {
      setUserDraftPlaces((prev) => [...prev, place]);
    }
  };

  const removeUserDraftPlace = (placeId: string) => {
    setUserDraftPlaces((prev) => prev.filter((p) => p.id !== placeId));
  };

  const toggleDraftPriority = (placeId: string) => {
    setUserDraftPlaces((prev) =>
      prev.map((p) =>
        p.id === placeId
          ? { ...p, priority: p.priority === "required" ? "preferred" : "required" }
          : p
      )
    );
  };

  // Calculations
  const totalBudget = config.budget;
  const totalPlanned = useMemo(() => {
    return stops.reduce((acc, stop) => acc + (stop.cost || 0), 0);
  }, [stops]);

  const remainingBudget = totalBudget - totalPlanned;

  // Detail Sheet
  const openStopDetail = (stop: TripStop) => setSelectedStop(stop);
  const closeStopDetail = () => setSelectedStop(null);

  const toggleStopPriority = (stopId: string) => {
    setStops((prev) =>
      prev.map((s) => {
        if (s.id === stopId) {
          const nextPriority = s.priority === "required" ? "suggested" : "required";
          return {
            ...s,
            priority: nextPriority,
            selectedByUser: true,
            whyInRoute:
              nextPriority === "required"
                ? "Você marcou este local como alta prioridade. O roteiro foi travado para garantir sua visita sem estourar o orçamento."
                : "Sugestão ajustada de acordo com as preferências do seu grupo.",
          };
        }
        return s;
      })
    );
    if (selectedStop && selectedStop.id === stopId) {
      setSelectedStop((prev) =>
        prev
          ? {
              ...prev,
              priority: prev.priority === "required" ? "suggested" : "required",
              selectedByUser: true,
            }
          : null
      );
    }
    setLastFeedbackMessage("Prioridade atualizada com sucesso.");
  };

  const swapStopAlternative = (stopId: string) => {
    setStops((prev) =>
      prev.map((s) => {
        if (s.id === stopId) {
          return {
            ...s,
            name: s.name.includes("MAM")
              ? "Pavilhão Japonês & Jardim"
              : s.name.includes("Mirante")
              ? "Café da Praça Buenos Aires"
              : s.name,
            cost: Math.max(0, s.cost - 20),
            whyInRoute: "Substituição realizada para proporcionar uma alternativa tranquila e mais econômica.",
          };
        }
        return s;
      })
    );
    setSelectedStop(null);
    setLastFeedbackMessage("Parada substituída por uma alternativa viável.");
  };

  // Adding stop to itinerary
  const openAddStop = () => setIsAddStopOpen(true);
  const closeAddStop = () => setIsAddStopOpen(false);

  const handleAddStopToItinerary = (place: AddedPlaceDraft, priority: PriorityLevel) => {
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

    const newStop: TripStop = {
      id: `stop-${Date.now()}`,
      name: place.name,
      category: place.category,
      scheduledTime: "16:45",
      duration: place.duration,
      cost: place.cost,
      costType: place.costType,
      image: place.image,
      selectedByUser: true,
      priority,
      whyInRoute:
        priority === "required"
          ? "Você escolheu este lugar como parada obrigatória. Reorganizamos a tarde para garantir sua visita."
          : "Você adicionou este lugar. Encaixamos no percurso da tarde aproveitando o tempo disponível.",
      description: place.description,
      rating: 4.8,
      reviewCount: 340,
      neighborhood: place.neighborhood,
      departureOffsetMinutes: 300,
      arrivalTime: "16:50",
    };

    // Insert before the last café pause
    setStops((prev) => {
      const copy = [...prev];
      copy.splice(Math.max(1, copy.length - 2), 0, newStop);
      return copy;
    });

    setLastFeedbackMessage(
      `"${place.name}" foi adicionado ao seu dia e o percurso foi reorganizado!`
    );
  };

  // Conflict resolutions
  const resolveKeepAndAdjust = () => {
    if (!conflict) return;
    const { place } = conflict;

    // Recalibrate stops: convert paid museum/cafe to free or cheaper alternatives
    setStops((prev) => {
      const adjusted = prev.map((s) => {
        if (s.id === "stop-2") {
          // MAM (R$50) -> Jardim das Esculturas (Grátis)
          return {
            ...s,
            name: "Jardim das Esculturas (Ibirapuera)",
            cost: 0,
            costType: "free" as const,
            whyInRoute: "Ajustado automaticamente para acomodar sua escolha sem estourar o orçamento.",
          };
        }
        if (s.id === "stop-6") {
          // Deslocamento reduzido
          return { ...s, cost: 45 };
        }
        return s;
      });

      const newStop: TripStop = {
        id: `stop-${Date.now()}`,
        name: place.name,
        category: place.category,
        scheduledTime: "16:30",
        duration: place.duration,
        cost: place.cost,
        costType: place.costType,
        image: place.image,
        selectedByUser: true,
        priority: "required",
        whyInRoute: "Você escolheu este lugar. Mantivemos sua prioridade e ajustamos as paradas sugeridas pelo sistema.",
        description: place.description,
        rating: 4.8,
        reviewCount: 500,
        neighborhood: place.neighborhood,
      };

      adjusted.splice(3, 0, newStop);
      return adjusted;
    });

    setConflict(null);
    setLastFeedbackMessage(
      `Mantivemos "${place.name}" e ajustamos paradas secundárias. Seu orçamento continua dentro dos R$${totalBudget}!`
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

    const newStop: TripStop = {
      id: `stop-${Date.now()}`,
      name: place.name,
      category: place.category,
      scheduledTime: "16:30",
      duration: place.duration,
      cost: place.cost,
      costType: place.costType,
      image: place.image,
      selectedByUser: true,
      priority: "required",
      whyInRoute: "Você escolheu este lugar. O orçamento foi atualizado conforme sua aprovação.",
      description: place.description,
      rating: 4.8,
      reviewCount: 500,
      neighborhood: place.neighborhood,
    };

    setStops((prev) => {
      const copy = [...prev];
      copy.splice(3, 0, newStop);
      return copy;
    });

    setConflict(null);
    setLastFeedbackMessage(
      `Orçamento atualizado para R$${newTotal} e "${place.name}" mantido com segurança.`
    );
  };

  const dismissConflict = () => setConflict(null);

  // Tour mode controls
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
        setLastFeedbackMessage("Buscamos uma opção gastronômica autêntica próxima da sua localização.");
        break;
      case "rest":
        setLastFeedbackMessage("Adicionamos uma pausa sombreada de 20 min sem afetar o horário final.");
        break;
      case "free":
        setStops((prev) =>
          prev.map((s, idx) =>
            idx === tourStopIndex && s.cost > 0
              ? { ...s, name: `${s.name} (Área Pública Aberta)`, cost: 0, costType: "free" }
              : s
          )
        );
        setLastFeedbackMessage("Próxima parada convertida para atividade gratuita.");
        break;
      case "save":
        setLastFeedbackMessage("Reorganizamos as paradas seguintes para priorizar opções com menor consumo de saldo.");
        break;
      case "indoor":
        setLastFeedbackMessage("Identificamos opções cobertas e climatizadas para a tarde.");
        break;
      case "add":
        setIsAddStopOpen(true);
        break;
      case "change":
        setLastFeedbackMessage("Alternamos a rota para um percurso mais calmo em áreas verdes.");
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
  const ctx = useContext(TripContext);
  if (!ctx) {
    throw new Error("useTripStore must be used within a TripProvider");
  }
  return ctx;
}
