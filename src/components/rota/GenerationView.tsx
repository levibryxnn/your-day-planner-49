import React, { useEffect, useState } from "react";
import { useTripStore } from "../../lib/tripStore";
import { GENERATION_STEPS } from "../../lib/mockData";

export function GenerationView() {
  const { goToStep, config } = useTripStore();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < GENERATION_STEPS.length - 1) return prev + 1;

        clearInterval(interval);
        setTimeout(() => goToStep("itinerary"), 600);
        return prev;
      });
    }, 600);

    return () => clearInterval(interval);
  }, [goToStep]);

  return (
    <div className="flex min-h-[calc(100vh-60px)] flex-col items-center justify-center px-6 text-center animate-in fade-in duration-300">
      <div className="mx-auto max-w-xs space-y-8">
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-emerald-100 bg-emerald-50/40" />
          <div
            className="h-12 w-12 animate-spin rounded-full border-2 border-emerald-900 border-t-transparent"
            style={{ animationDuration: "1.2s" }}
          />
          <span className="absolute font-serif text-xs font-bold text-emerald-950">Rota</span>
        </div>

        <div className="space-y-4">
          <div className="flex h-12 items-center justify-center">
            <h2 className="font-serif text-lg font-bold leading-snug text-stone-900 transition-all duration-300">
              {GENERATION_STEPS[currentStepIndex]}
            </h2>
          </div>

          <div className="flex items-center justify-center gap-2 pt-2">
            {GENERATION_STEPS.map((_, index) => (
              <div
                key={index}
                className={
                  index <= currentStepIndex
                    ? "h-1.5 w-6 rounded-full bg-emerald-900 transition-all duration-300"
                    : "h-1.5 w-2 rounded-full bg-stone-200 transition-all duration-300"
                }
              />
            ))}
          </div>
        </div>

        <p className="text-xs leading-relaxed text-stone-500">
          Organizando {config.destination.name}, {config.startTime}–{config.endTime}, dentro do
          limite de {"R$" + config.budget}.
        </p>
      </div>
    </div>
  );
}
