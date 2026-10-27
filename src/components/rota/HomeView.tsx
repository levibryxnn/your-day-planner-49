import React, { useState } from "react";
import { useTripStore } from "../../lib/tripStore";
import { ArrowRight, MapPin, ShieldCheck } from "lucide-react";
import { BudgetInput } from "./BudgetInput";
import type { DestinationRef } from "../../lib/domain";
import { IS_STATIC_DEMO } from "../../lib/runtime";

export function HomeView() {
  const { config, updateConfig, goToStep } = useTripStore();
  const [isResolvingDestination, setIsResolvingDestination] = useState(false);
  const [destinationError, setDestinationError] = useState<string | null>(null);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = config.destination.name.trim();
    if (query.length < 2) return;

    setDestinationError(null);
    setIsResolvingDestination(true);

    if (IS_STATIC_DEMO) {
      goToStep("config_group");
      setIsResolvingDestination(false);
      return;
    }

    try {
      const response = await fetch("/api/destinations?q=" + encodeURIComponent(query));
      const result = (await response.json()) as {
        ok?: boolean;
        data?: DestinationRef[];
      };
      const destination = result.data?.[0];

      if (!response.ok || !result.ok || !destination) {
        if (
          config.destination.id === "mock-destination-sao-paulo" &&
          query.toLowerCase() === "são paulo"
        ) {
          goToStep("config_group");
          return;
        }
        throw new Error("Destino não encontrado");
      }

      updateConfig({ destination });
      goToStep("config_group");
    } catch {
      if (
        config.destination.id === "mock-destination-sao-paulo" &&
        query.toLowerCase() === "são paulo"
      ) {
        goToStep("config_group");
        return;
      }
      setDestinationError(
        "Não conseguimos confirmar este destino agora. Tente novamente antes de planejar.",
      );
    } finally {
      setIsResolvingDestination(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-60px)] flex-col justify-between px-6 pb-8 pt-7 animate-in fade-in duration-300">
      <div className="mx-auto w-full max-w-sm space-y-7">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50/70 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-900">
            <span className="h-2 w-2 rounded-full bg-emerald-800" />
            <span>Copiloto turístico por orçamento</span>
          </div>

          <h1 className="max-w-[19ch] font-serif text-[2rem] font-bold leading-[1.08] tracking-tight text-stone-950 sm:text-[2.35rem]">
            Quanto você quer gastar no seu próximo passeio?
          </h1>

          <p className="max-w-[42ch] text-sm font-normal leading-relaxed text-stone-600">
            Diga seu orçamento e seu tempo. O Rota organiza o dia sem fazer você ultrapassar seus
            limites.
          </p>
        </div>

        <form onSubmit={handleStart} className="space-y-5">
          <div className="rounded-2xl border border-stone-200/80 bg-white p-4 shadow-[0_2px_8px_rgba(41,37,36,0.035)] transition-all focus-within:border-emerald-800/40">
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-stone-600">
              Onde você quer passear?
            </label>
            <div className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 text-emerald-800" />
              <input
                type="text"
                value={config.destination.name}
                onChange={(e) =>
                  updateConfig({
                    destination: {
                      ...config.destination,
                      id: "draft-destination",
                      name: e.target.value,
                      source: { provider: "mock" },
                    },
                  })
                }
                className="w-full bg-transparent text-base font-semibold text-stone-900 outline-none placeholder:text-stone-300"
                placeholder="Ex: São Paulo"
                required
              />
            </div>
            {destinationError && (
              <p className="mt-2 text-xs leading-relaxed text-amber-800">{destinationError}</p>
            )}
          </div>

          <BudgetInput
            value={config.budget}
            onChange={(budget) => updateConfig({ budget })}
            min={100}
            max={2000}
            step={25}
          />

          <button
            type="submit"
            disabled={isResolvingDestination}
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-stone-900 px-6 py-4 text-base font-semibold tracking-tight text-white shadow-lg shadow-stone-950/10 transition-all hover:bg-stone-800 active:scale-[0.98]"
          >
            <span>{isResolvingDestination ? "Confirmando destino…" : "Planejar meu dia"}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </form>
      </div>

      <div className="mx-auto max-w-xs pt-8 text-center">
        <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-stone-500">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-800" />
          <span>Seu orçamento continua no controle durante o passeio.</span>
        </div>
      </div>
    </div>
  );
}
