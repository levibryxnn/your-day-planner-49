import React from "react";
import { TripStop } from "../../lib/types";
import { Clock, ChevronRight, Pin } from "lucide-react";

interface TimelineStopProps {
  stop: TripStop;
  isFirst: boolean;
  isLast: boolean;
  onSelect: (stop: TripStop) => void;
}

export function TimelineStop({
  stop,
  isLast,
  onSelect,
}: TimelineStopProps) {
  const renderCost = () => {
    switch (stop.costType) {
      case "free":
        return <span className="font-semibold text-emerald-800">Grátis</span>;
      case "confirmed":
        return <span className="font-semibold text-stone-900">{"R$" + stop.cost}</span>;
      case "estimated":
        return <span className="font-semibold text-stone-800">{"~R$" + stop.cost}</span>;
      case "unavailable":
        return <span className="font-normal text-stone-500">Preço indisponível</span>;
      default:
        return <span className="font-semibold text-stone-900">{"R$" + stop.cost}</span>;
    }
  };

  return (
    <div className="group relative flex items-start gap-3.5">
      <div className="flex w-12 flex-shrink-0 flex-col items-center pt-1">
        <span className="font-mono text-xs font-bold tracking-tight text-stone-900">
          {stop.scheduledTime}
        </span>

        {!isLast && (
          <div className="mt-2 min-h-[70px] h-full w-[1.5px] bg-stone-200" />
        )}
      </div>

      <div
        onClick={() => onSelect(stop)}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onSelect(stop);
          }
        }}
        className={
          stop.selectedByUser
            ? "mb-4 flex-1 cursor-pointer rounded-2xl border border-emerald-800/25 bg-white p-3.5 shadow-[0_2px_8px_rgba(41,37,36,0.04)] ring-1 ring-emerald-900/5 transition-all hover:border-emerald-800/45 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
            : "mb-4 flex-1 cursor-pointer rounded-2xl border border-stone-200/80 bg-white p-3.5 shadow-[0_1px_4px_rgba(41,37,36,0.02)] transition-all hover:border-stone-300 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
        }
      >
        <div className="flex gap-3">
          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-stone-100">
            <img
              src={stop.image}
              alt={stop.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            {stop.selectedByUser && (
              <div className="absolute left-1 top-1 rounded-md bg-emerald-900/90 p-1 text-white shadow-sm backdrop-blur-sm">
                <Pin className="h-2.5 w-2.5 fill-white" />
              </div>
            )}
          </div>

          <div className="flex min-w-0 flex-1 flex-col justify-between">
            <div>
              <div className="mb-1 flex items-center justify-between gap-1.5">
                <span className="truncate text-[11px] font-medium uppercase tracking-wide text-stone-500">
                  {stop.category}
                </span>

                {stop.selectedByUser && (
                  <span className="inline-flex flex-shrink-0 items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[10.5px] font-medium text-emerald-900">
                    Escolhido por você
                  </span>
                )}
              </div>

              <h3 className="truncate text-sm font-semibold leading-snug text-stone-900">
                {stop.name}
              </h3>
            </div>

            <div className="mt-2 flex items-center justify-between border-t border-stone-100/80 pt-1 text-xs">
              <div className="flex items-center gap-1 text-stone-500">
                <Clock className="h-3.5 w-3.5" />
                <span>{stop.duration}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="text-xs">{renderCost()}</div>
                <ChevronRight className="h-3.5 w-3.5 text-stone-400 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
