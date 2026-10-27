import { formatTripDate } from "../../lib/dateUtils";
import React from "react";
import { useTripStore } from "../../lib/tripStore";
import { BudgetBanner } from "./BudgetBanner";
import { TimelineStop } from "./TimelineStop";
import { WeatherRiskBanner } from "./WeatherRiskBanner";
import { Plus, Play, Calendar, CheckCircle2 } from "lucide-react";

function minutesBetween(start: string, end: string) {
  const [startHour = 0, startMinute = 0] = start.split(":").map(Number);
  const [endHour = 0, endMinute = 0] = end.split(":").map(Number);
  return Math.max(0, endHour * 60 + endMinute - (startHour * 60 + startMinute));
}

function formatHours(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes ? hours + "h" + String(minutes).padStart(2, "0") : hours + "h";
}

export function ItineraryView() {
  const {
    stops,
    config,
    totalPlanned,
    remainingBudget,
    openStopDetail,
    openAddStop,
    goToStep,
    lastFeedbackMessage,
  } = useTripStore();

  const userChosenCount = stops.filter((stop) => stop.selectedByUser).length;
  const availableTime = formatHours(minutesBetween(config.startTime, config.endTime));

  return (
    <div className="flex min-h-full flex-col pb-24 animate-in fade-in duration-300">
      <div className="px-5 pb-3 pt-4">
        <div className="flex items-baseline justify-between gap-3">
          <div className="min-w-0">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-emerald-800">
              Seu dia organizado
            </span>
            <h1 className="truncate font-serif text-2xl font-bold tracking-tight text-stone-950">
              {config.destination.name}
            </h1>
          </div>
          <div className="flex flex-shrink-0 items-center gap-1.5 text-xs font-medium text-stone-500">
            <Calendar className="h-3.5 w-3.5 text-emerald-800" />
            <span>
              {formatTripDate(config.tripDate)} • {config.startTime}–{config.endTime}
            </span>
          </div>
        </div>
      </div>

      {lastFeedbackMessage && (
        <div className="mx-5 mb-3 flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-xs text-emerald-950 animate-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-800" />
          <span className="leading-snug">{lastFeedbackMessage}</span>
        </div>
      )}

      <div className="space-y-3 px-5 pb-5">
        <BudgetBanner />
        <WeatherRiskBanner />
      </div>

      <div className="flex-1 px-5">
        <div className="mb-3 flex items-center justify-between pt-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500">Cronograma</h2>
          <button
            onClick={openAddStop}
            className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-white px-2.5 py-1 text-xs font-semibold text-stone-700 transition-all hover:border-emerald-800/30 hover:text-emerald-950 active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Adicionar parada</span>
          </button>
        </div>

        <div className="pt-1">
          {stops.map((stop, index) => (
            <TimelineStop
              key={stop.id}
              stop={stop}
              isFirst={index === 0}
              isLast={index === stops.length - 1}
              onSelect={openStopDetail}
            />
          ))}
        </div>

        <div className="mt-4 space-y-2 rounded-2xl border border-stone-200/80 bg-white p-4 shadow-[0_1px_4px_rgba(41,37,36,0.025)]">
          <h3 className="text-xs font-bold uppercase tracking-wide text-stone-500">
            Resumo do dia
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs text-stone-600">
            <div>• {stops.length} paradas planejadas</div>
            <div>• {availableTime} disponíveis</div>
            <div>• {"R$" + totalPlanned} previstos</div>
            <div>• {"R$" + remainingBudget} de margem</div>
            <div className="col-span-2 font-medium text-stone-800">
              • {userChosenCount} {userChosenCount === 1 ? "lugar escolhido" : "lugares escolhidos"}{" "}
              por você
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-stone-200/80 bg-[#FFFEFB]/95 p-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <button
            onClick={() => goToStep("tour_mode")}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-stone-900 px-6 py-4 text-sm font-bold tracking-tight text-white shadow-lg shadow-stone-950/10 transition-all hover:bg-stone-800 active:scale-[0.98]"
          >
            <Play className="h-4 w-4 fill-white text-white" />
            <span>Iniciar modo passeio</span>
          </button>
        </div>
      </div>
    </div>
  );
}
