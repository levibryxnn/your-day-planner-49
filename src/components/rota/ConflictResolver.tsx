import React from "react";
import { useTripStore } from "../../lib/tripStore";
import { AlertCircle, Sliders, ArrowRightLeft, DollarSign } from "lucide-react";

export function ConflictResolver() {
  const {
    conflict,
    resolveKeepAndAdjust,
    resolveChangePlace,
    resolveIncreaseBudget,
    dismissConflict,
    totalBudget,
  } = useTripStore();

  if (!conflict) return null;

  const { place, overflowAmount, newTotal } = conflict;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-stone-950/50 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl border border-stone-200 p-6 flex flex-col gap-4 slide-in-from-bottom duration-300"
        role="dialog"
      >
        {/* Warning Icon & Title */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
              Ajuste de Orçamento
            </span>
            <h3 className="text-base font-serif font-bold text-stone-900 mt-0.5 leading-snug">
              Esse local deixa o passeio R${overflowAmount} acima do seu orçamento.
            </h3>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              Você definiu um teto de R${totalBudget}, e com "{place.name}" a previsão iria para R${newTotal}. Como você prefere resolver?
            </p>
          </div>
        </div>

        {/* 3 Clear One-Touch Decisions */}
        <div className="space-y-2.5 pt-2">
          {/* Option 1: Keep and adjust rest */}
          <button
            onClick={resolveKeepAndAdjust}
            className="w-full text-left p-3.5 rounded-2xl border border-stone-200 hover:border-stone-900 hover:bg-stone-50 transition-all flex items-start gap-3 group active:scale-[0.99]"
          >
            <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center flex-shrink-0 group-hover:bg-stone-900 group-hover:text-white transition-colors">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-stone-900 block group-hover:text-black">
                Manter e ajustar o restante
              </span>
              <span className="text-[11px] text-stone-500 leading-tight">
                Garantimos "{place.name}" e reorganizamos as outras paradas com opções gratuitas para continuar nos R${totalBudget}.
              </span>
            </div>
          </button>

          {/* Option 2: Change place */}
          <button
            onClick={resolveChangePlace}
            className="w-full text-left p-3.5 rounded-2xl border border-stone-200 hover:border-stone-900 hover:bg-stone-50 transition-all flex items-start gap-3 group active:scale-[0.99]"
          >
            <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center flex-shrink-0 group-hover:bg-stone-900 group-hover:text-white transition-colors">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-stone-900 block group-hover:text-black">
                Escolher outro lugar
              </span>
              <span className="text-[11px] text-stone-500 leading-tight">
                Buscar uma alternativa de valor mais acessível para esta mesma parada.
              </span>
            </div>
          </button>

          {/* Option 3: Increase budget */}
          <button
            onClick={resolveIncreaseBudget}
            className="w-full text-left p-3.5 rounded-2xl border border-stone-200 hover:border-stone-900 hover:bg-stone-50 transition-all flex items-start gap-3 group active:scale-[0.99]"
          >
            <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center flex-shrink-0 group-hover:bg-stone-900 group-hover:text-white transition-colors">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-stone-900 block group-hover:text-black">
                Aumentar orçamento para R${newTotal}
              </span>
              <span className="text-[11px] text-stone-500 leading-tight">
                Atualizar sua meta financeira do dia para absorver todos os lugares sem alterações.
              </span>
            </div>
          </button>
        </div>

        {/* Dismiss / Cancel */}
        <button
          onClick={dismissConflict}
          className="w-full py-2.5 text-xs font-medium text-stone-400 hover:text-stone-700 transition-colors"
        >
          Cancelar inclusão
        </button>
      </div>
    </div>
  );
}
