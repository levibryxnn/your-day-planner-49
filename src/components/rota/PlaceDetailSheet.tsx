import React from "react";
import { TripStop } from "../../lib/types";
import {
  X,
  Clock,
  Star,
  MapPin,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Navigation,
} from "lucide-react";

interface PlaceDetailSheetProps {
  stop: TripStop | null;
  onClose: () => void;
  onTogglePriority: (stopId: string) => void;
  onSwapAlternative: (stopId: string) => void;
}

export function PlaceDetailSheet({
  stop,
  onClose,
  onTogglePriority,
  onSwapAlternative,
}: PlaceDetailSheetProps) {
  if (!stop) return null;

  const isRequired = stop.priority === "required";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-stone-950/40 backdrop-blur-sm transition-opacity p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl border border-stone-200 max-h-[90vh] flex flex-col slide-in-from-bottom duration-300"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Image Bar */}
        <div className="relative h-52 w-full bg-stone-100 flex-shrink-0">
          <img
            src={stop.image}
            alt={stop.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-all active:scale-95"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badge over photo */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
            <span className="text-xs uppercase tracking-wider font-semibold bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/20">
              {stop.category}
            </span>

            {stop.rating && (
              <div className="flex items-center gap-1 text-xs bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/20 font-medium">
                <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>{stop.rating}</span>
                <span className="text-stone-300">
                  ({stop.reviewCount?.toLocaleString("pt-BR")})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-stone-500 font-medium flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {stop.neighborhood || "São Paulo"}
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-xs text-stone-500 font-mono font-medium">
                Chegada prevista: {stop.scheduledTime}
              </span>
            </div>

            <h2 className="text-xl font-serif font-bold text-stone-900 leading-tight">
              {stop.name}
            </h2>
          </div>

          {/* Essential specs in 1 line: Duration & Cost */}
          <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-stone-600" />
              <div>
                <span className="text-[11px] text-stone-600 block">Tempo sugerido</span>
                <span className="text-xs font-semibold text-stone-900">{stop.duration}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-stone-200 flex items-center justify-center text-[11px] font-bold text-stone-600">
                $
              </div>
              <div>
                <span className="text-[11px] text-stone-600 block">Preço</span>
                <span className="text-xs font-semibold text-stone-900">
                  {stop.costType === "free"
                    ? "Grátis"
                    : stop.costType === "estimated"
                    ? `~R$${stop.cost}`
                    : `R$${stop.cost}`}
                </span>
              </div>
            </div>
          </div>

          {/* Short 2-3 line description */}
          <p className="text-sm text-stone-600 leading-relaxed font-normal">
            {stop.description}
          </p>

          {/* Section: Por que está no seu roteiro */}
          <div className="p-4 rounded-2xl bg-[#F6F5F2] border border-stone-200/80 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-800">
              <Sparkles className="w-3.5 h-3.5 text-stone-600" />
              <span>Por que está no seu roteiro</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              {stop.whyInRoute}
            </p>
          </div>

          {/* Simulated Map Link */}
          <button
            onClick={() => {}}
            className="w-full py-2 px-3 rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
          >
            <Navigation className="w-3.5 h-3.5 text-stone-500" />
            <span>Ver localização aproximada no mapa</span>
          </button>
        </div>

        {/* Action Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200/80 flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onTogglePriority(stop.id)}
              className={`py-2.5 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] ${
                isRequired
                  ? "bg-stone-900 text-white border-stone-900"
                  : "bg-white text-stone-800 border-stone-200 hover:border-stone-300"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isRequired ? "Prioridade garantida" : "Tornar prioridade"}</span>
            </button>

            <button
              onClick={() => onSwapAlternative(stop.id)}
              className="py-2.5 px-3 rounded-xl text-xs font-medium border border-stone-200 bg-white text-stone-700 hover:bg-stone-100 flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
            >
              <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
              <span>Trocar lugar</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs font-semibold text-stone-800 hover:text-stone-950 transition-colors"
          >
            Manter no roteiro
          </button>
        </div>
      </div>
    </div>
  );
}
