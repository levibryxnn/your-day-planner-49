import React, { useState } from "react";
import { useTripStore } from "../../lib/tripStore";
import { INTENT_OPTIONS } from "../../lib/mockData";
import {
  Navigation,
  Clock,
  MapPin,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  X,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export function TourModeView() {
  const {
    stops,
    tourStopIndex,
    nextTourStop,
    remainingBudget,
    goToStep,
    isIntentModalOpen,
    openIntentModal,
    closeIntentModal,
    handleSelectIntent,
    lastFeedbackMessage,
    clearFeedbackMessage,
  } = useTripStore();

  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const currentStop = stops[tourStopIndex] || stops[0];
  const upcomingStops = stops.slice(tourStopIndex + 1);

  const handleStartNavigation = () => {
    setIsNavigating(true);
  };

  const handleArrived = () => {
    setIsNavigating(false);
    nextTourStop();
  };

  return (
    <div className="flex flex-col min-h-full pb-20 animate-in fade-in duration-300">
      {/* Top Bar: Tour Status */}
      <div className="px-5 pt-4 pb-3 border-b border-stone-200/60 bg-white/70 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider block">
              Modo Passeio em Tempo Real
            </span>
            <h1 className="text-lg font-serif font-bold text-stone-900 tracking-tight">
              Seu dia em São Paulo
            </h1>
          </div>

          <div className="text-right">
            <span className="text-[10.5px] text-stone-600 block">Saldo planejado</span>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/70 inline-flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              R${remainingBudget} livres
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic System Feedback Toast */}
      {lastFeedbackMessage && (
        <div className="mx-5 mt-3 p-3 rounded-2xl bg-stone-900 text-white text-xs flex items-center justify-between shadow-lg animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300 flex-shrink-0" />
            <span className="leading-snug">{lastFeedbackMessage}</span>
          </div>
          <button
            onClick={clearFeedbackMessage}
            className="p-1 hover:bg-white/20 rounded-full text-stone-300"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Focus: "O QUE FAÇO AGORA?" */}
      <div className="px-5 pt-5 flex-1 space-y-4">
        <div className="text-center sm:text-left mb-1">
          <span className="text-xs font-semibold uppercase tracking-widest text-stone-600">
            O que faço agora?
          </span>
        </div>

        {/* Hero Card: Próxima Parada */}
        <div className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all">
          {/* Visual Header */}
          <div className="relative h-48 w-full bg-stone-100">
            <img
              src={currentStop.image}
              alt={currentStop.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

            <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase">
              Parada {tourStopIndex + 1} de {stops.length}
            </div>

            <div className="absolute bottom-3 left-4 right-4 text-white">
              <span className="text-xs font-medium text-stone-200 block mb-0.5">
                {currentStop.category} • {currentStop.neighborhood || "São Paulo"}
              </span>
              <h2 className="text-xl font-serif font-bold text-white leading-tight drop-shadow-sm">
                {currentStop.name}
              </h2>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-3 gap-2 p-3 bg-stone-50 rounded-2xl border border-stone-100 text-center">
              <div>
                <span className="text-[10.5px] text-stone-600 block">Você deve sair em</span>
                <span className="text-sm font-bold text-stone-900 font-mono">
                  {currentStop.departureOffsetMinutes || 18} min
                </span>
              </div>
              <div className="border-x border-stone-200/60">
                <span className="text-[10.5px] text-stone-600 block">Chegada prevista</span>
                <span className="text-sm font-bold text-stone-900 font-mono">
                  {currentStop.arrivalTime || currentStop.scheduledTime}
                </span>
              </div>
              <div>
                <span className="text-[10.5px] text-stone-600 block">Custo previsto</span>
                <span className="text-sm font-bold text-emerald-800">
                  {currentStop.costType === "free"
                    ? "Grátis"
                    : currentStop.costType === "estimated"
                    ? `~R$${currentStop.cost}`
                    : `R$${currentStop.cost}`}
                </span>
              </div>
            </div>

            {/* Simulated Navigation State */}
            {isNavigating ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2.5 text-emerald-900 font-semibold text-xs">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
                  <span>Navegação ativa em direção a {currentStop.name}</span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Tempo de deslocamento estimado: 14 minutos em trânsito moderado de sábado.
                </p>
                <button
                  onClick={handleArrived}
                  className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Cheguei no local</span>
                </button>
              </div>
            ) : (
              /* Dominant CTA */
              <button
                onClick={handleStartNavigation}
                className="w-full py-4 px-5 rounded-2xl bg-stone-950 hover:bg-black text-white text-sm font-bold tracking-tight shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
              >
                <Navigation className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
                <span>Começar trajeto</span>
              </button>
            )}

            {/* Secondary Action: Alterar Meu Plano */}
            <button
              onClick={openIntentModal}
              className="w-full py-2.5 px-4 rounded-xl border border-stone-200 hover:border-stone-300 bg-white text-stone-700 text-xs font-semibold transition-all flex items-center justify-center gap-2"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500" />
              <span>Alterar meu plano</span>
            </button>
          </div>
        </div>

        {/* Collapsible Preview of the rest of the day */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-4 transition-all">
          <button
            onClick={() => setIsTimelineExpanded(!isTimelineExpanded)}
            className="w-full flex items-center justify-between text-left"
          >
            <div>
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                Restante do dia ({upcomingStops.length} paradas seguintes)
              </h3>
              <p className="text-[11px] text-stone-500">
                Término previsto às 21:00 sem ultrapassar seu orçamento
              </p>
            </div>
            <div className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-600">
              {isTimelineExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
          </button>

          {isTimelineExpanded && (
            <div className="mt-4 pt-3 border-t border-stone-100 space-y-2.5 animate-in fade-in duration-200">
              {upcomingStops.map((stop, idx) => (
                <div
                  key={stop.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50/70 border border-stone-100 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="font-mono text-stone-500 text-[11px]">
                      {stop.scheduledTime}
                    </span>
                    <span className="font-medium text-stone-900 truncate">
                      {stop.name}
                    </span>
                    {stop.selectedByUser && (
                      <span className="text-[9.5px] bg-stone-200/80 px-1.5 py-0.5 rounded text-stone-700">
                        Você
                      </span>
                    )}
                  </div>
                  <span className="text-stone-600 flex-shrink-0 font-medium ml-2">
                    {stop.costType === "free" ? "Grátis" : `~R$${stop.cost}`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Return to Timeline Mode button */}
        <div className="text-center pt-2">
          <button
            onClick={() => goToStep("itinerary")}
            className="text-xs font-semibold text-stone-600 hover:text-stone-900 underline transition-colors"
          >
            Ver timeline completa do roteiro
          </button>
        </div>
      </div>

      {/* Quick Intent Sheet: "Alterar meu plano" */}
      {isIntentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-stone-950/40 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl border border-stone-200 p-5 flex flex-col slide-in-from-bottom duration-300 max-h-[85vh]"
            role="dialog"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="text-base font-serif font-bold text-stone-900">
                  Como quer ajustar o roteiro?
                </h3>
                <p className="text-xs text-stone-500">
                  Adaptamos as próximas paradas mantendo o que você escolheu.
                </p>
              </div>
              <button
                onClick={closeIntentModal}
                className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-3 overflow-y-auto space-y-2">
              {INTENT_OPTIONS.map((intent) => (
                <button
                  key={intent.id}
                  onClick={() => handleSelectIntent(intent.id)}
                  className="w-full text-left p-3.5 rounded-2xl border border-stone-200/80 hover:border-stone-900 hover:bg-stone-50 transition-all flex items-center justify-between group active:scale-[0.99]"
                >
                  <div>
                    <span className="text-xs font-bold text-stone-900 block group-hover:text-black">
                      {intent.label}
                    </span>
                    <span className="text-[11px] text-stone-500 leading-tight">
                      {intent.desc}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-stone-100">
              <button
                onClick={closeIntentModal}
                className="w-full py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-950 transition-colors"
              >
                Voltar ao passeio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
