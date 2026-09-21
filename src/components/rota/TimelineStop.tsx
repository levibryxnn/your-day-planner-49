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
  isFirst,
  isLast,
  onSelect,
}: TimelineStopProps) {
  // Format price display cleanly according to the 3 states
  const renderCost = () => {
    switch (stop.costType) {
      case "free":
        return <span className="font-semibold text-emerald-800">Grátis</span>;
      case "confirmed":
        return <span className="font-semibold text-stone-900">R${stop.cost}</span>;
      case "estimated":
        return <span className="font-semibold text-stone-800">~R${stop.cost}</span>;
      case "unavailable":
        return <span className="text-stone-600 font-normal">Preço indisponível</span>;
      default:
        return <span className="font-semibold text-stone-900">R${stop.cost}</span>;
    }
  };

  return (
    <div className="relative flex items-start gap-3.5 group">
      {/* Left Time & Timeline Connector */}
      <div className="flex flex-col items-center flex-shrink-0 w-12 pt-1">
        <span className="text-xs font-bold text-stone-900 tracking-tight font-mono">
          {stop.scheduledTime}
        </span>

        {/* Vertical Line */}
        {!isLast && (
          <div className="w-[1.5px] bg-stone-200 h-full min-h-[70px] mt-2 group-last:hidden" />
        )}
      </div>

      {/* Main Stop Card */}
      <div
        onClick={() => onSelect(stop)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(stop);
          }
        }}
        className={`flex-1 mb-4 p-3.5 rounded-2xl bg-white border transition-all cursor-pointer hover:border-stone-400/80 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-stone-400/30 ${
          stop.selectedByUser
            ? "border-stone-300 shadow-[0_2px_8px_rgba(0,0,0,0.04)] ring-1 ring-stone-900/5"
            : "border-stone-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.02)]"
        }`}
      >
        <div className="flex gap-3">
          {/* Thumbnail Image */}
          <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-stone-100">
            <img
              src={stop.image}
              alt={stop.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {stop.selectedByUser && (
              <div className="absolute top-1 left-1 bg-stone-900/80 backdrop-blur-sm text-white rounded-md p-1 shadow-sm">
                <Pin className="w-2.5 h-2.5 fill-white" />
              </div>
            )}
          </div>

          {/* Card Body */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-1.5 mb-1">
                <span className="text-[11px] font-medium tracking-wide uppercase text-stone-600">
                  {stop.category}
                </span>

                {/* Subtle User-Selected Badge */}
                {stop.selectedByUser && (
                  <span className="inline-flex items-center gap-1 text-[10.5px] font-medium text-stone-700 bg-stone-100/90 border border-stone-200/70 px-2 py-0.5 rounded-full">
                    <span>Escolhido por você</span>
                  </span>
                )}
              </div>

              <h3 className="text-sm font-semibold text-stone-900 truncate leading-snug">
                {stop.name}
              </h3>
            </div>

            {/* Bottom Metadata: Duration & Cost */}
            <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-100/80 text-xs">
              <div className="flex items-center gap-1 text-stone-600">
                <Clock className="w-3.5 h-3.5 text-stone-600" />
                <span>{stop.duration}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="text-xs">{renderCost()}</div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-600 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
