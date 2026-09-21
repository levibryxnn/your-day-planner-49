import React, { useState } from "react";
import { useTripStore } from "../../lib/tripStore";
import { INTENT_OPTIONS } from "../../lib/mockData";
import {
  Navigation,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  X,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  CloudRain,
  Umbrella,
} from "lucide-react";

export function TourModeView() {
  const {
    config,
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
    optimizeForWeather,
  } = useTripStore();

  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const currentStop = stops[tourStopIndex];
  const upcomingStops = stops.slice(tourStopIndex + 1);

  const handleStartNavigation = () => setIsNavigating(true);

  const handleArrived = () => {
    setIsNavigating(false);
    nextTourStop();
  };

  if (!currentStop) {
    return (
      <div className="flex min-h-[calc(100vh-60px)] flex-col items-center justify-center px-6 text-center">
        <div className="max-w-xs space-y-3">
          <h1 className="font-serif text-2xl font-bold text-stone-950">
            Não há paradas para acompanhar
          </h1>
          <p className="text-sm leading-relaxed text-stone-600">
            Volte ao roteiro e ajuste seus horários ou adicione um lugar para continuar.
          </p>
          <button
            type="button"
            onClick={() => goToStep("itinerary")}
            className="mt-2 rounded-2xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white"
          >
            Voltar ao roteiro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col pb-20 animate-in fade-in duration-300">
      <div className="border-b border-stone-200/60 bg-[#FFFEFB]/75 px-5 pb-3 pt-4 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-emerald-800">
              Modo passeio
            </span>
            <h1 className="truncate font-serif text-lg font-bold tracking-tight text-stone-900">
              Seu dia em {config.destination.name}
            </h1>
          </div>

          <div className="flex-shrink-0 text-right">
            <span className="block text-[10.5px] text-stone-500">Saldo planejado</span>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/70 bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-800">
              <ShieldCheck className="h-3 w-3" />
              {"R$" + remainingBudget + " livres"}
            </span>
          </div>
        </div>
      </div>

      {lastFeedbackMessage && (
        <div className="mx-5 mt-3 flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-xs text-emerald-950 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 flex-shrink-0 text-emerald-800" />
            <span className="leading-snug">{lastFeedbackMessage}</span>
          </div>
          <button
            onClick={clearFeedbackMessage}
            className="rounded-full p-1 text-emerald-800/70 hover:bg-emerald-100"
            aria-label="Fechar mensagem"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="flex-1 space-y-4 px-5 pt-5">
        <div className="mb-1">
          <span className="text-xs font-semibold uppercase tracking-widest text-stone-500">
            O que faço agora?
          </span>
        </div>

        <div className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-[0_4px_20px_rgba(41,37,36,0.05)]">
          <div className="relative h-48 w-full bg-stone-100">
            <img
              src={currentStop.image}
              alt={currentStop.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

            <div className="absolute left-3 top-3 rounded-full bg-stone-950/75 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
              Parada {tourStopIndex + 1} de {stops.length}
            </div>

            <div className="absolute bottom-3 left-4 right-4 text-white">
              <span className="mb-0.5 block text-xs font-medium text-stone-200">
                {currentStop.category} • {currentStop.neighborhood || config.destination.name}
              </span>
              <h2 className="font-serif text-xl font-bold leading-tight text-white drop-shadow-sm">
                {currentStop.name}
              </h2>
            </div>
          </div>

          <div className="space-y-4 p-5">
            <div className="grid grid-cols-3 gap-2 rounded-2xl border border-stone-100 bg-stone-50 p-3 text-center">
              <div>
                <span className="block text-[10.5px] text-stone-500">Horário</span>
                <span className="font-mono text-sm font-bold text-stone-900">
                  {currentStop.scheduledTime}
                </span>
              </div>
              <div className="border-x border-stone-200/60">
                <span className="block text-[10.5px] text-stone-500">Duração</span>
                <span className="font-mono text-sm font-bold text-stone-900">
                  {currentStop.duration}
                </span>
              </div>
              <div>
                <span className="block text-[10.5px] text-stone-500">Custo</span>
                <span className="text-sm font-bold text-emerald-800">
                  {currentStop.costType === "free"
                    ? "Grátis"
                    : currentStop.costType === "estimated"
                      ? "~R$" + currentStop.cost + " grupo"
                      : "R$" + currentStop.cost + " grupo"}
                </span>
              </div>
            </div>

            {currentStop.weatherRisk &&
              currentStop.weatherRisk !== "none" && (
                <div
                  className={
                    currentStop.weatherRisk === "conflict"
                      ? "rounded-2xl border border-sky-200 bg-sky-50 p-3.5"
                      : "rounded-2xl border border-amber-200 bg-amber-50 p-3.5"
                  }
                >
                  <div className="flex items-start gap-2.5">
                    {currentStop.weatherRisk === "conflict" ? (
                      <CloudRain className="mt-0.5 h-4 w-4 flex-shrink-0 text-sky-800" />
                    ) : (
                      <Umbrella className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-800" />
                    )}
                    <div className="flex-1">
                      <span className="block text-xs font-bold text-stone-900">
                        Atenção ao clima
                      </span>
                      <p className="mt-0.5 text-xs leading-relaxed text-stone-600">
                        {currentStop.weatherNote}
                      </p>
                    </div>
                  </div>

                  {currentStop.weatherRisk === "conflict" && (
                    <button
                      type="button"
                      onClick={optimizeForWeather}
                      className="mt-3 w-full rounded-xl bg-sky-900 px-3 py-2.5 text-xs font-bold text-white transition-all hover:bg-sky-800"
                    >
                      Ajustar restante do dia
                    </button>
                  )}
                </div>
              )}

            {isNavigating ? (
              <div className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-center gap-2.5 text-xs font-semibold text-emerald-900">
                  <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-700" />
                  <span>Trajeto simulado para {currentStop.name}</span>
                </div>
                <p className="text-xs leading-relaxed text-emerald-800">
                  Esta versão ainda não usa trânsito ou navegação real.
                </p>
                <button
                  onClick={handleArrived}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 px-4 py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-emerald-900"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Cheguei no local</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleStartNavigation}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-stone-900 px-5 py-4 text-sm font-bold tracking-tight text-white shadow-md transition-all hover:bg-stone-800 active:scale-[0.98]"
              >
                <Navigation className="h-4 w-4 text-emerald-300 transition-transform group-hover:rotate-12" />
                <span>Começar trajeto</span>
              </button>
            )}

            <button
              onClick={openIntentModal}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-xs font-semibold text-stone-700 transition-all hover:border-emerald-800/30"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-emerald-800" />
              <span>Alterar meu plano</span>
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200/80 bg-white p-4 transition-all">
          <button
            onClick={() => setIsTimelineExpanded(!isTimelineExpanded)}
            className="flex w-full items-center justify-between text-left"
          >
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wide text-stone-900">
                Restante do dia ({upcomingStops.length} paradas)
              </h3>
              <p className="text-[11px] text-stone-500">
                Encerramento previsto até {config.endTime}
              </p>
            </div>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-100 text-stone-600">
              {isTimelineExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
          </button>

          {isTimelineExpanded && (
            <div className="mt-4 space-y-2.5 border-t border-stone-100 pt-3 animate-in fade-in duration-200">
              {upcomingStops.map((stop) => (
                <div
                  key={stop.id}
                  className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50/70 p-2.5 text-xs"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="font-mono text-[11px] text-stone-500">
                      {stop.scheduledTime}
                    </span>
                    <span className="truncate font-medium text-stone-900">{stop.name}</span>
                    {stop.selectedByUser && (
                      <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9.5px] text-emerald-900">
                        Você
                      </span>
                    )}
                  </div>
                  <span className="ml-2 flex-shrink-0 font-medium text-stone-600">
                    {stop.costType === "free" ? "Grátis" : "~R$" + stop.cost + " grupo"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={() => goToStep("itinerary")}
            className="text-xs font-semibold text-stone-500 underline underline-offset-2 transition-colors hover:text-stone-900"
          >
            Ver timeline completa
          </button>
        </div>
      </div>

      {isIntentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/40 p-0 backdrop-blur-sm animate-in fade-in duration-200 sm:items-center sm:p-4">
          <div
            className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-stone-200 bg-[#FFFEFB] p-5 shadow-2xl slide-in-from-bottom duration-300 sm:rounded-3xl"
            role="dialog"
            aria-modal="true"
            aria-label="Alterar meu plano"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-serif text-base font-bold text-stone-900">
                  Como quer ajustar o roteiro?
                </h3>
                <p className="text-xs text-stone-500">
                  Mantemos suas prioridades sempre que possível.
                </p>
              </div>
              <button
                onClick={closeIntentModal}
                className="flex h-8 w-8 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100"
                aria-label="Fechar opções"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2 overflow-y-auto py-3">
              {INTENT_OPTIONS.map((intent) => (
                <button
                  key={intent.id}
                  onClick={() => handleSelectIntent(intent.id)}
                  className="group flex w-full items-center justify-between rounded-2xl border border-stone-200/80 p-3.5 text-left transition-all hover:border-emerald-800/30 hover:bg-emerald-50/30 active:scale-[0.99]"
                >
                  <div>
                    <span className="block text-xs font-bold text-stone-900">{intent.label}</span>
                    <span className="text-[11px] leading-tight text-stone-500">{intent.desc}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 flex-shrink-0 text-stone-400 transition-all group-hover:translate-x-1 group-hover:text-emerald-900" />
                </button>
              ))}
            </div>

            <div className="border-t border-stone-100 pt-2">
              <button
                onClick={closeIntentModal}
                className="w-full py-2.5 text-xs font-semibold text-stone-500 transition-colors hover:text-stone-950"
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
