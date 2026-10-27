import React, { useState } from "react";
import { useTripStore } from "../../lib/tripStore";
import { ShieldCheck, Minus, Plus, X } from "lucide-react";

interface BudgetBannerProps {
  compact?: boolean;
}

export function BudgetBanner({ compact = false }: BudgetBannerProps) {
  const { totalBudget, totalPlanned, remainingBudget, updateConfig, stops, expenses } =
    useTripStore();
  const [isEditing, setIsEditing] = useState(false);
  const [tempBudget, setTempBudget] = useState(totalBudget);

  const percentUsed =
    totalBudget > 0 ? Math.min(100, Math.round((totalPlanned / totalBudget) * 100)) : 0;
  const isOverBudget = remainingBudget < 0;
  const expensesTotal = expenses.reduce((sum, expense) => sum + expense.estimatedCost, 0);

  const handleOpenEdit = () => {
    setTempBudget(totalBudget);
    setIsEditing(true);
  };

  const handleSave = () => {
    updateConfig({ budget: tempBudget });
    setIsEditing(false);
  };

  if (compact) {
    return (
      <div className="flex items-center justify-between rounded-2xl border border-stone-200/80 bg-stone-50 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-stone-500">Orçamento</span>
          <span className="text-sm font-semibold text-stone-900">{"R$" + totalBudget}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-stone-500">Margem</span>
          <span
            className={
              isOverBudget
                ? "text-sm font-bold text-amber-700"
                : "text-sm font-bold text-emerald-800"
            }
          >
            {isOverBudget ? "-R$" + Math.abs(remainingBudget) : "R$" + remainingBudget + " livres"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-3xl border border-stone-200/80 bg-white p-5 shadow-[0_2px_12px_rgba(41,37,36,0.035)] transition-all">
      <div className="mb-3.5 flex items-baseline justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Seu orçamento
            </span>
            <button
              onClick={handleOpenEdit}
              className="text-[10px] font-medium text-emerald-800 underline decoration-emerald-800/30 underline-offset-2 hover:text-emerald-950"
              title="Ajustar teto"
            >
              Ajustar
            </button>
          </div>
          <button
            type="button"
            onClick={handleOpenEdit}
            className="mt-0.5 font-serif text-3xl font-bold tracking-tight text-stone-950 transition-opacity hover:opacity-80"
          >
            {"R$" + totalBudget}
          </button>
        </div>

        <div className="text-right">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500">
            Saldo restante
          </span>
          <div
            className={
              isOverBudget
                ? "mt-0.5 flex items-center justify-end gap-1.5 text-xl font-semibold tracking-tight text-amber-700"
                : "mt-0.5 flex items-center justify-end gap-1.5 text-xl font-semibold tracking-tight text-emerald-800"
            }
          >
            {!isOverBudget && <ShieldCheck className="inline h-4 w-4 text-emerald-700" />}
            <span>
              {isOverBudget
                ? "-R$" + Math.abs(remainingBudget) + " excedido"
                : "R$" + remainingBudget + " livres"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex h-2 w-full overflow-hidden rounded-full bg-stone-100">
        <div
          className={
            isOverBudget
              ? "h-full rounded-full bg-amber-600 transition-all duration-500"
              : "h-full rounded-full bg-emerald-800 transition-all duration-500"
          }
          style={{ width: percentUsed + "%" }}
        />
      </div>

      <div className="mt-3 flex items-start justify-between gap-3 pt-1 text-xs font-medium text-stone-600">
        <div className="flex items-start gap-1.5">
          <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-800" />
          <span>
            {"R$" + totalPlanned + " previstos • " + stops.length + " paradas"}
            {expensesTotal > 0 ? " + R$" + expensesTotal + " de deslocamento" : ""}
          </span>
        </div>
        <span className="flex-shrink-0 text-[11px] font-normal text-stone-500">
          {percentUsed}% do total
        </span>
      </div>

      {isEditing && (
        <div
          className="absolute inset-0 z-20 flex flex-col justify-between rounded-3xl border border-stone-200 bg-[#FFFEFB]/98 p-5 shadow-lg backdrop-blur-md animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-label="Ajustar orçamento"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wide text-stone-900">
              Ajustar orçamento
            </span>
            <button
              onClick={() => setIsEditing(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100"
              aria-label="Fechar ajuste de orçamento"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="my-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setTempBudget((prev) => Math.max(100, prev - 50))}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-stone-50 font-bold text-stone-800 hover:bg-stone-100 active:scale-95"
              aria-label="Diminuir orçamento em R$50"
            >
              <Minus className="h-4 w-4 stroke-[2.5]" />
            </button>

            <div className="text-center">
              <span className="font-serif text-3xl font-bold text-stone-950">
                {"R$" + tempBudget}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setTempBudget((prev) => Math.min(2000, prev + 50))}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-stone-50 font-bold text-stone-800 hover:bg-stone-100 active:scale-95"
              aria-label="Aumentar orçamento em R$50"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
            </button>
          </div>

          <input
            type="range"
            min={100}
            max={2000}
            step={25}
            value={tempBudget}
            onChange={(e) => setTempBudget(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-stone-100 accent-emerald-900"
            aria-label="Novo orçamento"
          />

          <div className="mt-2 flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 rounded-xl border border-stone-200 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex-1 rounded-xl bg-stone-900 py-2 text-xs font-semibold text-white hover:bg-stone-800"
            >
              Salvar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
