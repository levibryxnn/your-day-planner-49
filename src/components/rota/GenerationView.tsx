import React, { useEffect, useState } from "react";
import { useTripStore } from "../../lib/tripStore";
import { GENERATION_STEPS } from "../../lib/mockData";
import { Check } from "lucide-react";

export function GenerationView() {
  const { goToStep } = useTripStore();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    // Advance steps gracefully
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < GENERATION_STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            goToStep("itinerary");
          }, 600);
          return prev;
        }
      });
    }, 600);

    return () => clearInterval(interval);
  }, [goToStep]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-60px)] px-6 text-center animate-in fade-in duration-300">
      <div className="max-w-xs mx-auto space-y-8">
        {/* Subtle Minimalist Geometry Line Animation */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-stone-200" />
          <div
            className="w-12 h-12 rounded-full border-2 border-stone-900 border-t-transparent animate-spin"
            style={{ animationDuration: "1.2s" }}
          />
          <span className="text-xs font-serif font-bold text-stone-900 absolute">
            Rota
          </span>
        </div>

        {/* Sequential Human Messages */}
        <div className="space-y-4">
          <div className="h-12 flex items-center justify-center">
            <h2 className="text-lg font-serif font-bold text-stone-900 leading-snug transition-all duration-300">
              {GENERATION_STEPS[currentStepIndex]}
            </h2>
          </div>

          {/* Progress Indicators */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {GENERATION_STEPS.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx <= currentStepIndex
                    ? "w-6 bg-stone-900"
                    : "w-2 bg-stone-200"
                }`}
              />
            ))}
          </div>
        </div>

        <p className="text-xs text-stone-600">
          Cruzando opções culturais, tempo de deslocamento e margem segura de R$500.
        </p>
      </div>
    </div>
  );
}
