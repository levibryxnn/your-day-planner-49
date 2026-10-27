import React from "react";
import { TripStop } from "../../lib/types";
import { useTripStore } from "../../lib/tripStore";
import { confidenceLabel, providerLabel } from "../../lib/confidence";
import {
  X,
  Clock,
  Star,
  MapPin,
  CheckCircle2,
  RefreshCw,
  Navigation,
  Route as RouteIcon,
  CloudRain,
  Umbrella,
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
  const { config } = useTripStore();

  if (!stop) return null;

  const isRequired = stop.priority === "required";

  const priceLabel =
    stop.costType === "free"
      ? "Grátis para o grupo"
      : stop.costType === "estimated"
        ? "~R$" + stop.cost + " para o grupo"
        : stop.costType === "unavailable"
          ? "Preço indisponível"
          : "R$" + stop.cost + " para o grupo";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/40 p-0 backdrop-blur-sm transition-opacity animate-in fade-in duration-200 sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-stone-200 bg-[#FFFEFB] shadow-2xl slide-in-from-bottom duration-300 sm:rounded-3xl"
        role="dialog"
        aria-modal="true"
        aria-label={"Detalhes de " + stop.name}
      >
        <div className="relative h-52 w-full flex-shrink-0 bg-stone-100">
          <img src={stop.image} alt={stop.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:bg-black/60 active:scale-95"
            aria-label="Fechar detalhes"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between gap-3 text-white">
            <span className="rounded-full border border-white/20 bg-black/40 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
              {stop.category}
            </span>

            {stop.rating && (
              <div className="flex items-center gap-1 rounded-full border border-white/20 bg-black/40 px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
                <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                <span>{stop.rating}</span>
                {stop.reviewCount && (
                  <span className="text-stone-300">
                    ({stop.reviewCount.toLocaleString("pt-BR")})
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          <div>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 text-xs font-medium text-stone-500">
                <MapPin className="h-3.5 w-3.5 text-emerald-800" />
                {stop.neighborhood || config.destination.name}
              </span>
              <span className="text-stone-300">•</span>
              <span className="font-mono text-xs font-medium text-stone-500">
                {stop.scheduledTime}
              </span>
            </div>

            <h2 className="font-serif text-xl font-bold leading-tight text-stone-900">
              {stop.name}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-2.5 rounded-2xl border border-stone-200/70 bg-stone-50 p-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-800" />
              <div>
                <span className="block text-[11px] text-stone-500">Tempo sugerido</span>
                <span className="text-xs font-semibold text-stone-900">{stop.duration}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-900">
                $
              </div>
              <div>
                <span className="block text-[11px] text-stone-500">Total do grupo</span>
                <span className="text-xs font-semibold text-stone-900">{priceLabel}</span>
              </div>
            </div>
          </div>

          {stop.costBreakdown && stop.costBreakdown.length > 0 && (
            <div className="rounded-2xl border border-stone-200 bg-white p-3.5">
              <span className="block text-[11px] font-bold uppercase tracking-wide text-stone-500">
                Como chegamos a esse valor
              </span>
              <div className="mt-2 space-y-1.5">
                {stop.costBreakdown.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2 text-xs leading-relaxed text-stone-700"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-700" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              {stop.pricing?.note && (
                <p className="mt-2 border-t border-stone-100 pt-2 text-[10.5px] leading-relaxed text-stone-500">
                  {stop.pricing.note}
                </p>
              )}
            </div>
          )}

          {stop.weatherRisk && stop.weatherRisk !== "none" && (
            <div
              className={
                stop.weatherRisk === "conflict"
                  ? "rounded-2xl border border-sky-200 bg-sky-50/80 p-3.5"
                  : "rounded-2xl border border-amber-200 bg-amber-50/70 p-3.5"
              }
            >
              <div className="flex items-start gap-2.5">
                {stop.weatherRisk === "conflict" ? (
                  <CloudRain className="mt-0.5 h-4 w-4 flex-shrink-0 text-sky-800" />
                ) : (
                  <Umbrella className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-800" />
                )}
                <div>
                  <span className="block text-xs font-bold text-stone-900">
                    Clima neste horário
                  </span>
                  <p className="mt-0.5 text-xs leading-relaxed text-stone-600">
                    {stop.weatherNote}
                  </p>
                  <span className="mt-1.5 inline-block text-[9.5px] font-semibold uppercase tracking-wide text-stone-400">
                    Simulação climática
                  </span>
                </div>
              </div>
            </div>
          )}

          <p className="text-sm font-normal leading-relaxed text-stone-600">{stop.description}</p>

          {(stop.dataConfidence || stop.source) && (
            <div className="flex flex-wrap items-center gap-2 border-t border-stone-100 pt-3 text-[10.5px] text-stone-500">
              <span className="font-semibold text-stone-600">Dados do local:</span>
              {stop.source && <span>{providerLabel(stop.source.provider)}</span>}
              {stop.dataConfidence && (
                <>
                  <span>•</span>
                  <span>{confidenceLabel(stop.dataConfidence)}</span>
                </>
              )}
            </div>
          )}

          <div className="space-y-1.5 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-950">
              <RouteIcon className="h-3.5 w-3.5 text-emerald-800" />
              <span>Por que está no seu roteiro</span>
            </div>
            <p className="text-xs leading-relaxed text-stone-600">{stop.whyInRoute}</p>
          </div>

          <button
            type="button"
            onClick={() => {}}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-600 transition-all hover:bg-stone-50"
          >
            <Navigation className="h-3.5 w-3.5 text-emerald-800" />
            <span>Mapa disponível em uma etapa futura</span>
          </button>
        </div>

        <div className="flex flex-col gap-2 border-t border-stone-200/80 bg-[#FAF8F3] p-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onTogglePriority(stop.id)}
              className={
                isRequired
                  ? "flex items-center justify-center gap-1.5 rounded-xl border border-emerald-900 bg-emerald-900 px-3 py-2.5 text-xs font-medium text-white transition-all active:scale-[0.98]"
                  : "flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-xs font-medium text-stone-800 transition-all hover:border-emerald-800/30 active:scale-[0.98]"
              }
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{isRequired ? "Prioridade garantida" : "Tornar prioridade"}</span>
            </button>

            <button
              onClick={() => onSwapAlternative(stop.id)}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-xs font-medium text-stone-700 transition-all hover:border-stone-300 hover:bg-stone-50 active:scale-[0.98]"
            >
              <RefreshCw className="h-3.5 w-3.5 text-stone-500" />
              <span>Trocar lugar</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs font-semibold text-stone-700 transition-colors hover:text-stone-950"
          >
            Manter no roteiro
          </button>
        </div>
      </div>
    </div>
  );
}
