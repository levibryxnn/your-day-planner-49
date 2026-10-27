import React, { useEffect, useState } from "react";
import { Minus, Plus, ShieldCheck } from "lucide-react";

interface BudgetInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function BudgetInput({
  value,
  onChange,
  min = 100,
  max = 2000,
  step = 25,
}: BudgetInputProps) {
  const [draftValue, setDraftValue] = useState(value.toLocaleString("pt-BR"));
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!isTyping) {
      setDraftValue(value.toLocaleString("pt-BR"));
    }
  }, [value, isTyping]);

  const clampValue = (nextValue: number) => Math.min(max, Math.max(min, nextValue));

  const commitValue = (nextValue: number) => {
    const safeValue = clampValue(nextValue);
    onChange(safeValue);
    setDraftValue(safeValue.toLocaleString("pt-BR"));
  };

  const handleDecrease = () => commitValue(value - 50);
  const handleIncrease = () => commitValue(value + 50);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    commitValue(Number(e.target.value));
  };

  const handleManualInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    setDraftValue(raw ? Number(raw).toLocaleString("pt-BR") : "");

    if (!raw) return;

    const parsed = Number(raw);
    if (parsed >= min && parsed <= max) {
      onChange(parsed);
    }
  };

  const handleManualBlur = () => {
    setIsTyping(false);
    const raw = draftValue.replace(/\D/g, "");
    const parsed = raw ? Number(raw) : min;
    commitValue(parsed);
  };

  const presets = [250, 500, 750, 1000];

  return (
    <div className="space-y-4 rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_4px_18px_rgba(41,37,36,0.05)] transition-all focus-within:border-emerald-800/50">
      <div className="flex items-center justify-between gap-3">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700">
          Quanto você quer gastar hoje?
        </label>
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-900">
          <ShieldCheck className="h-3 w-3" />
          Teto do dia
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 pt-1">
        <button
          type="button"
          onClick={handleDecrease}
          disabled={value <= min}
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-stone-200 bg-stone-50 text-stone-700 transition-all hover:bg-stone-100 active:scale-95 disabled:pointer-events-none disabled:opacity-35"
          aria-label="Diminuir orçamento em R$50"
        >
          <Minus className="h-5 w-5 stroke-[2.2]" />
        </button>

        <div className="min-w-0 flex-1 text-center">
          <div className="inline-flex items-baseline justify-center gap-1.5">
            <span className="text-2xl font-serif font-semibold text-stone-500">R$</span>
            <input
              type="text"
              inputMode="numeric"
              value={draftValue}
              onFocus={() => setIsTyping(true)}
              onChange={handleManualInput}
              onBlur={handleManualBlur}
              className="w-36 bg-transparent text-center font-serif text-4xl font-bold leading-none tracking-tight text-stone-950 outline-none sm:text-5xl"
              aria-label="Orçamento máximo do dia"
            />
          </div>
          <span className="mt-1 block text-[11px] text-stone-500">Seu limite para o dia</span>
        </div>

        <button
          type="button"
          onClick={handleIncrease}
          disabled={value >= max}
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-stone-200 bg-stone-50 text-stone-700 transition-all hover:bg-stone-100 active:scale-95 disabled:pointer-events-none disabled:opacity-35"
          aria-label="Aumentar orçamento em R$50"
        >
          <Plus className="h-5 w-5 stroke-[2.2]" />
        </button>
      </div>

      <div className="space-y-1 pt-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-stone-100 accent-emerald-900 outline-none"
          aria-label="Selecionar orçamento"
        />
        <div className="flex justify-between text-[10px] font-medium text-stone-400">
          <span>{"R$" + min}</span>
          <span>R$1.000</span>
          <span>{"R$" + max}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-stone-100 pt-3">
        <span className="flex-shrink-0 text-[11px] font-medium text-stone-500">Atalhos</span>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => commitValue(preset)}
              className={
                value === preset
                  ? "rounded-xl bg-emerald-950 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-all"
                  : "rounded-xl bg-stone-100 px-2.5 py-1.5 text-xs font-semibold text-stone-700 transition-all hover:bg-stone-200"
              }
            >
              {"R$" + preset.toLocaleString("pt-BR")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
