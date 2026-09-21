import React, { useState } from "react";
import { useTripStore } from "../../lib/tripStore";
import { ShieldCheck, Sliders, Check, Minus, Plus, X } from "lucide-react";

interface BudgetBannerProps {
  compact?: boolean;
}

export function BudgetBanner({ compact = false }: BudgetBannerProps) {
  const { totalBudget, totalPlanned, remainingBudget, updateConfig } = useTripStore();
  const [isEditing, setIsEditing] = useState(false);
  const [tempBudget, setTempBudget] = useState(totalBudget);

  const percentUsed = Math.min(100, Math.round((totalPlanned / totalBudget) * 100));
  const isOverBudget = remainingBudget < 0;

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
      <div className="flex items-center justify-between px-4 py-2.5 bg-stone-100/90 rounded-2xl border border-stone-200/80">
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 font-medium">Orçamento:</span>
          <span className="text-sm font-semibold text-stone-900">R${totalBudget}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 font-medium">Margem:</span>
          <span
            className={`text-sm font-bold ${
              isOverBudget ? "text-amber-700" : "text-emerald-800"
            }`}
          >
            {isOverBudget ? `-R$${Math.abs(remainingBudget)}` : `R$${remainingBudget} livres`}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all relative">
      {/* Top row: Master Budget */}
      <div className="flex items-baseline justify-between mb-3.5">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-600 block">
              Seu Orçamento
            </span>
            <button
              onClick={handleOpenEdit}
              className="text-[10px] text-stone-600 hover:text-stone-900 font-medium underline"
              title="Ajustar teto"
            >
              Ajustar
            </button>
          </div>
          <div
            onClick={handleOpenEdit}
            className="text-3xl font-serif font-bold text-stone-950 tracking-tight mt-0.5 cursor-pointer hover:opacity-80 transition-opacity"
          >
            R${totalBudget}
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-600 block">
            Saldo Restante
          </span>
          <div
            className={`text-xl font-semibold tracking-tight mt-0.5 flex items-center justify-end gap-1.5 ${
              isOverBudget ? "text-amber-700" : "text-emerald-800"
            }`}
          >
            {!isOverBudget && <ShieldCheck className="w-4 h-4 text-emerald-700 inline" />}
            <span>
              {isOverBudget ? `-R$${Math.abs(remainingBudget)} excedido` : `R$${remainingBudget} livres`}
            </span>
          </div>
        </div>
      </div>

      {/* Subtle Proportion Bar */}
      <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden flex">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            isOverBudget ? "bg-amber-600" : "bg-stone-800"
          }`}
          style={{ width: `${percentUsed}%` }}
        />
      </div>

      {/* Bottom Breakdown: 1-second clarity */}
      <div className="flex items-center justify-between mt-3 text-xs text-stone-600 font-medium pt-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-stone-800 inline-block"></span>
          <span>R${totalPlanned} previstos para 5 atividades e transporte</span>
        </div>
        <span className="text-[11px] text-stone-600 font-normal">
          {percentUsed}% do total
        </span>
      </div>

      {/* Inline Quick Edit Sheet */}
      {isEditing && (
        <div className="absolute inset-0 bg-white/98 backdrop-blur-md rounded-3xl p-5 z-20 flex flex-col justify-between shadow-lg border border-stone-300 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-900 uppercase tracking-wide">
              Ajustar valor do orçamento
            </span>
            <button
              onClick={() => setIsEditing(false)}
              className="w-7 h-7 rounded-full hover:bg-stone-100 text-stone-500 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 my-2">
            <button
              type="button"
              onClick={() => setTempBudget((prev) => Math.max(100, prev - 50))}
              className="w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-800 flex items-center justify-center font-bold"
            >
              <Minus className="w-4 h-4 stroke-[2.5]" />
            </button>

            <div className="text-center">
              <span className="text-3xl font-serif font-bold text-stone-950 font-mono">
                R${tempBudget}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setTempBudget((prev) => Math.min(2000, prev + 50))}
              className="w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-800 flex items-center justify-center font-bold"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          <input
            type="range"
            min={100}
            max={2000}
            step={25}
            value={tempBudget}
            onChange={(e) => setTempBudget(Number(e.target.value))}
            className="w-full h-2 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-stone-950"
          />

          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2 rounded-xl bg-stone-950 hover:bg-black text-white text-xs font-semibold"
            >
              Salvar novo valor
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
