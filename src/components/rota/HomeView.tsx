import React from "react";
import { useTripStore } from "../../lib/tripStore";
import { ArrowRight, MapPin, Sparkles, ShieldCheck } from "lucide-react";
import { BudgetInput } from "./BudgetInput";

export function HomeView() {
  const { config, updateConfig, goToStep } = useTripStore();

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    goToStep("config_group");
  };

  return (
    <div className="flex flex-col justify-between min-h-[calc(100vh-60px)] px-6 pt-8 pb-8 animate-in fade-in duration-300">
      <div className="space-y-8 max-w-sm mx-auto w-full">
        {/* Editorial Value Proposition */}
        <div className="space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-semibold tracking-wide border border-stone-200/60">
            <span className="w-2 h-2 rounded-full bg-emerald-700"></span>
            <span>Copiloto turístico por orçamento</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-950 tracking-tight leading-[1.15]">
            Quanto você quer gastar no seu próximo dia inesquecível?
          </h1>

          <p className="text-sm text-stone-600 font-normal leading-relaxed">
            Diga seu dinheiro, seu tempo e o que quer fazer. O Rota organiza o dia inteiro sem você ultrapassar seus limites.
          </p>
        </div>

        {/* Core Input Container */}
        <form onSubmit={handleStart} className="space-y-5 pt-2">
          {/* Destination */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] focus-within:border-stone-400 transition-all">
            <label className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider block mb-1">
              Onde você quer passear?
            </label>
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-stone-600" />
              <input
                type="text"
                value={config.destination}
                onChange={(e) => updateConfig({ destination: e.target.value })}
                className="w-full text-base font-semibold text-stone-900 bg-transparent focus:outline-none placeholder:text-stone-300"
                placeholder="Ex: São Paulo"
                required
              />
            </div>
          </div>

          {/* Optimized Budget Input */}
          <BudgetInput
            value={config.budget}
            onChange={(budget) => updateConfig({ budget })}
            min={100}
            max={2000}
            step={25}
          />

          {/* CTA */}
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-stone-950 hover:bg-black active:scale-[0.98] text-white text-base font-semibold tracking-tight shadow-lg shadow-stone-950/10 flex items-center justify-center gap-2 group transition-all"
          >
            <span>Planejar meu dia</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>

      {/* Discreet Trust Footer */}
      <div className="pt-8 text-center max-w-xs mx-auto">
        <div className="flex items-center justify-center gap-1.5 text-xs text-stone-600 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
          <span>Sem cálculos na rua. Seu orçamento respeitado.</span>
        </div>
      </div>
    </div>
  );
}
