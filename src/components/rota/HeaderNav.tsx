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
  const { goBack, resetTrip, step, config } = useTripStore();
  const isHome = step === "home";

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-stone-200/70 bg-[#F9F7F2]/95 px-5 py-3.5 backdrop-blur-md transition-all">
      <div className="flex min-w-0 items-center gap-2.5">
        {!isHome && showBack ? (
          <button
            onClick={goBack}
            className="-ml-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-stone-700 transition-all hover:bg-stone-200/50 hover:text-stone-950 active:scale-95"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5 stroke-[2.2]" />
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 font-serif text-xl font-bold tracking-tight text-stone-900">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-900" />
              Rota
            </span>
          </div>
        )}

        {title && (
          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold leading-none tracking-tight text-stone-900">
              {title}
            </h1>
            {subtitle && (
              <span className="mt-0.5 block truncate text-[11px] font-medium leading-tight text-stone-500">
                {subtitle}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-shrink-0 items-center gap-2">
        {!isHome && (
          <div className="flex max-w-[130px] items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50/70 px-2.5 py-1 text-xs font-medium text-emerald-950">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-emerald-800" />
            <span className="truncate">{config.destination.name || "Seu destino"}</span>
          </div>
        )}

        {!isHome && showReset && (
          <button
            onClick={resetTrip}
            className="flex h-8 w-8 items-center justify-center rounded-full text-stone-500 transition-all hover:bg-stone-200/50 hover:text-stone-900"
            title="Recomeçar roteiro"
            aria-label="Recomeçar"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        )}
      </div>
    </header>
  );
}
