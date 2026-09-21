import React from "react";
import { ArrowLeft, RotateCcw, MapPin } from "lucide-react";
import { useTripStore } from "../../lib/tripStore";

interface HeaderNavProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  showReset?: boolean;
}

export function HeaderNav({
  title,
  subtitle,
  showBack = true,
  showReset = true,
}: HeaderNavProps) {
  const { goBack, resetTrip, step } = useTripStore();

  const isHome = step === "home";

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-5 py-3.5 bg-[#FAFAF8]/95 backdrop-blur-md border-b border-stone-200/70 transition-all">
      <div className="flex items-center gap-2.5">
        {!isHome && showBack ? (
          <button
            onClick={goBack}
            className="flex items-center justify-center w-9 h-9 -ml-1 text-stone-700 hover:text-stone-950 hover:bg-stone-200/50 active:scale-95 rounded-full transition-all"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="font-serif tracking-tight text-xl font-bold text-stone-900 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-900 inline-block"></span>
              Rota
            </span>
          </div>
        )}

        {title && (
          <div className="flex flex-col">
            <h1 className="text-sm font-semibold text-stone-900 tracking-tight leading-none">
              {title}
            </h1>
            {subtitle && (
              <span className="text-[11px] text-stone-500 font-medium leading-tight mt-0.5">
                {subtitle}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {!isHome && (
          <div className="flex items-center gap-1.5 text-xs text-stone-600 bg-stone-100/80 px-2.5 py-1 rounded-full border border-stone-200/60 font-medium">
            <MapPin className="w-3.5 h-3.5 text-stone-500" />
            <span>São Paulo</span>
          </div>
        )}

        {!isHome && showReset && (
          <button
            onClick={resetTrip}
            className="flex items-center justify-center w-8 h-8 text-stone-500 hover:text-stone-900 hover:bg-stone-200/50 rounded-full transition-all"
            title="Recomeçar roteiro"
            aria-label="Recomeçar"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
}
