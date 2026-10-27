import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { TripProvider, useTripStore } from "../lib/tripStore";
import { HeaderNav } from "../components/rota/HeaderNav";
import { HomeView } from "../components/rota/HomeView";
import { ConfigWizard } from "../components/rota/ConfigWizard";
import { UserPlacesView } from "../components/rota/UserPlacesView";
import { GenerationView } from "../components/rota/GenerationView";
import { ItineraryView } from "../components/rota/ItineraryView";
import { TourModeView } from "../components/rota/TourModeView";
import { PlaceDetailSheet } from "../components/rota/PlaceDetailSheet";
import { AddStopModal } from "../components/rota/AddStopModal";
import { ConflictResolver } from "../components/rota/ConflictResolver";

export const Route = createFileRoute("/")({
  component: RotaAppContainer,
});

function RotaContent() {
  const {
    step,
    selectedStop,
    closeStopDetail,
    toggleStopPriority,
    swapStopAlternative,
    isAddStopOpen,
    closeAddStop,
    handleAddStopToItinerary,
  } = useTripStore();

  const getHeaderProps = () => {
    switch (step) {
      case "home":
        return { showBack: false };
      case "config_group":
      case "config_time":
      case "config_transport":
      case "config_interests":
        return {
          title: "Personalizar dia",
          subtitle: "Configuração rápida",
          showBack: true,
        };
      case "user_places":
        return {
          title: "Seus lugares favoritos",
          subtitle: "Cocriação opcional",
          showBack: true,
        };
      case "generating":
        return { showBack: false, showReset: false };
      case "itinerary":
        return {
          title: "Seu dia planejado",
          subtitle: "Orçamento & Rota",
          showBack: true,
        };
      case "tour_mode":
        return {
          title: "Modo Passeio",
          subtitle: "Acompanhamento em tempo real",
          showBack: true,
        };
      default:
        return {};
    }
  };

  return (
    <div className="min-h-screen bg-[#ECE9E1] flex items-center justify-center p-0 sm:p-4 selection:bg-emerald-900 selection:text-white">
      {/* Mobile-first frame (centered on desktop, native on mobile) */}
      <div className="w-full max-w-md min-h-screen sm:min-h-[850px] sm:max-h-[95vh] bg-[#F9F7F2] flex flex-col relative sm:rounded-3xl shadow-xl sm:border border-stone-200/80 overflow-y-auto overflow-x-hidden">
        {/* Navigation Bar */}
        <HeaderNav {...getHeaderProps()} />

        {/* View Switcher */}
        <main className="flex-1 flex flex-col">
          {step === "home" && <HomeView />}
          {(step === "config_group" ||
            step === "config_time" ||
            step === "config_transport" ||
            step === "config_interests") && <ConfigWizard />}
          {step === "user_places" && <UserPlacesView />}
          {step === "generating" && <GenerationView />}
          {step === "itinerary" && <ItineraryView />}
          {step === "tour_mode" && <TourModeView />}
        </main>

        {/* Global Modals / Sheets */}
        <PlaceDetailSheet
          stop={selectedStop}
          onClose={closeStopDetail}
          onTogglePriority={toggleStopPriority}
          onSwapAlternative={swapStopAlternative}
        />

        <AddStopModal
          isOpen={isAddStopOpen}
          onClose={closeAddStop}
          onAddStop={handleAddStopToItinerary}
        />

        <ConflictResolver />
      </div>
    </div>
  );
}

export function RotaAppContainer() {
  return (
    <TripProvider>
      <RotaContent />
    </TripProvider>
  );
}
