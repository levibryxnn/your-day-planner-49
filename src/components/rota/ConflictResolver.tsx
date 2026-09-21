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
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/45 p-0 backdrop-blur-sm animate-in fade-in duration-200 sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) dismissConflict();
      }}
    >
      <div
        className="flex w-full max-w-lg flex-col gap-4 overflow-hidden rounded-t-3xl border border-stone-200 bg-[#FFFEFB] p-6 shadow-2xl slide-in-from-bottom duration-300 sm:rounded-3xl"
        role="dialog"
        aria-modal="true"
        aria-label="Ajuste de orçamento"
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-amber-800">
              Ajuste de orçamento
            </span>
            <h3 className="mt-0.5 font-serif text-base font-bold leading-snug text-stone-900">
              Essa escolha ultrapassa seu limite em {"R$" + overflowAmount}.
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-stone-500">
              Seu teto é {"R$" + totalBudget}. Mantendo “{place.name}”, a previsão fica em {"R$" + newTotal}.
            </p>
          </div>
        </div>

        <div className="space-y-2.5 pt-2">
          <button
            onClick={resolveKeepAndAdjust}
            className="group flex w-full items-start gap-3 rounded-2xl border border-stone-200 p-3.5 text-left transition-all hover:border-emerald-800/30 hover:bg-emerald-50/30 active:scale-[0.99]"
          >
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-900 transition-colors group-hover:bg-emerald-900 group-hover:text-white">
              <Sliders className="h-4 w-4" />
            </div>
            <div>
              <span className="block text-xs font-bold text-stone-900">
                Manter e reduzir o restante
              </span>
              <span className="text-[11px] leading-tight text-stone-500">
                Preservamos sua prioridade e reduzimos primeiro as paradas flexíveis. Se ainda não couber, a margem continuará visível.
              </span>
            </div>
          </button>

          <button
            onClick={resolveChangePlace}
            className="group flex w-full items-start gap-3 rounded-2xl border border-stone-200 p-3.5 text-left transition-all hover:border-stone-300 hover:bg-stone-50 active:scale-[0.99]"
          >
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-700">
              <ArrowRightLeft className="h-4 w-4" />
            </div>
            <div>
              <span className="block text-xs font-bold text-stone-900">Escolher outro lugar</span>
              <span className="text-[11px] leading-tight text-stone-500">
                Voltar à busca para selecionar uma alternativa mais acessível.
              </span>
            </div>
          </button>

          <button
            onClick={resolveIncreaseBudget}
            className="group flex w-full items-start gap-3 rounded-2xl border border-stone-200 p-3.5 text-left transition-all hover:border-stone-300 hover:bg-stone-50 active:scale-[0.99]"
          >
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-700">
              <DollarSign className="h-4 w-4" />
            </div>
            <div>
              <span className="block text-xs font-bold text-stone-900">
                Aumentar orçamento para {"R$" + newTotal}
              </span>
              <span className="text-[11px] leading-tight text-stone-500">
                Atualizar o teto do dia para acomodar esta escolha.
              </span>
            </div>
          </button>
        </div>

        <button
          onClick={dismissConflict}
          className="w-full py-2.5 text-xs font-medium text-stone-500 transition-colors hover:text-stone-800"
        >
          Cancelar inclusão
        </button>
      </div>
    </div>
  );
}
