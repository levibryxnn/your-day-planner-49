import React from "react";
import { useTripStore } from "../../lib/tripStore";
import { BudgetBanner } from "./BudgetBanner";
import { TimelineStop } from "./TimelineStop";
import {
  Compass,
  Plus,
  Play,
  Share2,
  Calendar,
  CheckCircle2,
  Sparkles,
  Car,
} from "lucide-react";

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

  const userChosenCount = stops.filter((s) => s.selectedByUser).length;

  return (
    <div className="flex flex-col min-h-full pb-24 animate-in fade-in duration-300">
      {/* City & Day Title */}
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider block">
              Roteiro Recomendado
            </span>
            <h1 className="text-2xl font-serif font-bold text-stone-950 tracking-tight">
              São Paulo
            </h1>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-stone-600 font-medium">
            <Calendar className="w-3.5 h-3.5 text-stone-600" />
            <span>Sábado • 09h às 21h</span>
          </div>
        </div>
      </div>

      {/* Dynamic System Feedback Toast */}
      {lastFeedbackMessage && (
        <div className="mx-5 mb-3 p-3 rounded-2xl bg-stone-900 text-white text-xs flex items-center gap-2 shadow-md animate-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-amber-300 flex-shrink-0" />
          <span className="leading-snug">{lastFeedbackMessage}</span>
        </div>
      )}

      {/* Master 1-Second Budget Visualization */}
      <div className="px-5 mb-5">
        <BudgetBanner />
      </div>

      {/* Timeline Section */}
      <div className="px-5 flex-1">
        <div className="flex items-center justify-between mb-3 pt-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-600">
            Cronograma do seu dia
          </h2>
          <button
            onClick={openAddStop}
            className="inline-flex items-center gap-1 text-xs font-semibold text-stone-800 hover:text-stone-950 bg-stone-100 hover:bg-stone-200/80 px-2.5 py-1 rounded-full border border-stone-200/70 transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar parada</span>
          </button>
        </div>

        {/* Vertical Timeline stops */}
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

        {/* Discreet Day Summary */}
        <div className="mt-4 p-4 rounded-2xl bg-white border border-stone-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.02)] space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wide text-stone-600">
            Resumo do dia
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs text-stone-600">
            <div>• 5 paradas culturais e gastronômicas</div>
            <div>• ~8h de atividades planejadas</div>
            <div>• R${totalPlanned} previstos (com deslocamento)</div>
            <div>• R${remainingBudget} de margem livre</div>
            <div className="col-span-2 text-stone-800 font-medium">
              • {userChosenCount} lugar escolhido por você (prioridade respeitada)
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-stone-200/80 z-40">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button
            onClick={() => goToStep("tour_mode")}
            className="flex-1 py-4 px-6 rounded-2xl bg-stone-950 hover:bg-black active:scale-[0.98] text-white text-sm font-bold tracking-tight shadow-lg shadow-stone-950/10 flex items-center justify-center gap-2 group transition-all"
          >
            <Play className="w-4 h-4 fill-white text-white" />
            <span>Iniciar modo passeio</span>
          </button>
        </div>
      </div>
    </div>
  );
}
