import React from "react";
import { Minus, Plus, Sparkles, ShieldCheck } from "lucide-react";

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
  const handleDecrease = () => {
    const nextVal = Math.max(min, value - 50);
    onChange(nextVal);
  };

  const handleIncrease = () => {
    const nextVal = Math.min(max, value + 50);
    onChange(nextVal);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  const handleManualInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    const num = raw ? parseInt(raw, 10) : 0;
    onChange(num);
  };

  // Contextual experience hint based on budget tier in São Paulo
  const getBudgetTierContext = (amount: number) => {
    if (amount < 250) {
      return {
        label: "Dia Econômico",
        desc: "Parques abertos, áreas verdes e lanches leves em família.",
        accent: "text-stone-700 bg-stone-100",
      };
    }
    if (amount <= 600) {
      return {
        label: "Dia Equilibrado (Recomendado)",
        desc: "Museu, almoço completo em restaurante tradicional e café artesanal.",
        accent: "text-emerald-900 bg-emerald-50 border-emerald-200/80",
      };
    }
    if (amount <= 1000) {
      return {
        label: "Dia Conforto",
        desc: "Gastronomia autoral renomada, estacionamentos e múltiplas atrações.",
        accent: "text-stone-900 bg-stone-100/90 border-stone-300",
      };
    }
    return {
      label: "Dia Exclusivo",
      desc: "Experiências completas sem qualquer restrição de paradas ou pratos.",
      accent: "text-stone-900 bg-amber-50 border-amber-200",
    };
  };

  const tier = getBudgetTierContext(value);

  const presets = [250, 500, 750, 1000];

  return (
    <div className="p-5 rounded-3xl bg-white border-2 border-stone-900/10 shadow-[0_4px_20px_rgba(0,0,0,0.04)] focus-within:border-stone-900 transition-all space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block">
          Quanto você quer gastar hoje?
        </label>
        <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/70 inline-flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          Teto garantido
        </span>
      </div>

      {/* Hero Display + Tactile Steppers */}
      <div className="flex items-center justify-between gap-3 pt-1">
        {/* Decrement Button */}
        <button
          type="button"
          onClick={handleDecrease}
          disabled={value <= min}
          className="w-12 h-12 rounded-2xl bg-stone-100 hover:bg-stone-200 active:scale-95 disabled:opacity-40 disabled:pointer-events-none text-stone-800 flex items-center justify-center transition-all flex-shrink-0"
          aria-label="Diminuir R$50"
        >
          <Minus className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Currency Number */}
        <div className="flex-1 text-center select-none">
          <div className="inline-flex items-baseline justify-center gap-1.5 cursor-text">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-stone-600">
              R$
            </span>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={value ? value.toLocaleString("pt-BR") : ""}
              onChange={handleManualInput}
              className="w-36 text-center text-4xl sm:text-5xl font-serif font-bold text-stone-950 bg-transparent focus:outline-none tracking-tight leading-none"
              placeholder="0"
            />
          </div>
          <span className="text-[11px] text-stone-600 block mt-1">
            Toque no número ou use os botões
          </span>
        </div>

        {/* Increment Button */}
        <button
          type="button"
          onClick={handleIncrease}
          disabled={value >= max}
          className="w-12 h-12 rounded-2xl bg-stone-100 hover:bg-stone-200 active:scale-95 disabled:opacity-40 disabled:pointer-events-none text-stone-800 flex items-center justify-center transition-all flex-shrink-0"
          aria-label="Aumentar R$50"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* Smooth Fluid Slider */}
      <div className="space-y-1 pt-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          className="w-full h-2 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-stone-950 transition-all focus:outline-none"
          aria-label="Seletor de orçamento em barra deslizante"
        />
        <div className="flex justify-between text-[10px] text-stone-600 font-mono">
          <span>R${min}</span>
          <span>R$1.000</span>
          <span>R${max}</span>
        </div>
      </div>

      {/* Dynamic Contextual Tier Box */}
      <div
        className={`p-3 rounded-2xl border transition-all ${tier.accent} space-y-0.5`}
      >
        <div className="flex items-center justify-between text-xs font-bold">
          <span>{tier.label}</span>
          <Sparkles className="w-3.5 h-3.5 opacity-80" />
        </div>
        <p className="text-[11px] opacity-90 leading-tight">
          {tier.desc}
        </p>
      </div>

      {/* Fast Preset Chips */}
      <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-1.5">
        <span className="text-[11px] font-medium text-stone-600 flex-shrink-0">
          Valores comuns:
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {presets.map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => onChange(val)}
              className={`text-xs px-2.5 py-1 rounded-xl font-medium transition-all ${
                value === val
                  ? "bg-stone-900 text-white shadow-sm"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              R${val}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
