import React from "react";
import {
  CloudRain,
  CloudSun,
  RefreshCw,
  ShieldCheck,
  Umbrella,
} from "lucide-react";
import { useTripStore } from "../../lib/tripStore";

export function WeatherRiskBanner() {
  const {
    weatherForecast,
    weatherSummary,
    optimizeForWeather,
  } = useTripStore();

  const peakIndex = weatherSummary.peakTime
    ? weatherForecast.findIndex(
        (slot) => slot.time === weatherSummary.peakTime,
      )
    : -1;

  const previewSlots =
    peakIndex >= 0
      ? weatherForecast.slice(
          Math.max(0, peakIndex - 1),
          Math.min(weatherForecast.length, peakIndex + 2),
        )
      : weatherForecast.slice(0, 3);

  const hasConflict = weatherSummary.level === "conflict";
  const hasWatch = weatherSummary.level === "watch";

  return (
    <section
      className={
        hasConflict
          ? "rounded-3xl border border-sky-200 bg-sky-50/80 p-4 shadow-[0_2px_10px_rgba(14,116,144,0.05)]"
          : hasWatch
            ? "rounded-3xl border border-amber-200 bg-amber-50/70 p-4"
            : "rounded-3xl border border-emerald-100 bg-emerald-50/60 p-4"
      }
      aria-label="Previsão climática simulada"
    >
      <div className="flex items-start gap-3">
        <div
          className={
            hasConflict
              ? "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-800"
              : hasWatch
                ? "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-800"
                : "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800"
          }
        >
          {hasConflict ? (
            <CloudRain className="h-5 w-5" />
          ) : hasWatch ? (
            <Umbrella className="h-5 w-5" />
          ) : (
            <CloudSun className="h-5 w-5" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-stone-500">
              Clima no roteiro
            </span>
            <span className="rounded-full border border-stone-200 bg-white/80 px-2 py-0.5 text-[9.5px] font-semibold text-stone-500">
              Simulação visual
            </span>
          </div>

          <h3 className="mt-1 text-sm font-bold leading-snug text-stone-900">
            {weatherSummary.headline}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-stone-600">
            {weatherSummary.detail}
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {previewSlots.map((slot) => (
          <div
            key={slot.time}
            className="rounded-2xl border border-white/70 bg-white/75 px-2.5 py-2 text-center"
          >
            <span className="block font-mono text-[11px] font-bold text-stone-800">
              {slot.time}
            </span>
            <span className="mt-0.5 block text-[10px] text-stone-500">
              {slot.temperatureC}°C
            </span>
            <span
              className={
                slot.precipitationProbability >= 60
                  ? "mt-0.5 block text-[10.5px] font-bold text-sky-800"
                  : "mt-0.5 block text-[10.5px] font-semibold text-stone-600"
              }
            >
              {slot.precipitationProbability}% chuva
            </span>
          </div>
        ))}
      </div>

      {hasConflict ? (
        <button
          type="button"
          onClick={optimizeForWeather}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-900 px-4 py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-sky-800 active:scale-[0.99]"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Ajustar roteiro ao clima</span>
        </button>
      ) : (
        <div className="mt-3 flex items-center gap-2 rounded-2xl border border-white/70 bg-white/60 px-3 py-2 text-[11px] font-medium text-stone-600">
          <ShieldCheck className="h-3.5 w-3.5 flex-shrink-0 text-emerald-800" />
          <span>
            O Rota continua acompanhando o risco climático ao longo do dia.
          </span>
        </div>
      )}

      <p className="mt-2 text-center text-[9.5px] leading-relaxed text-stone-400">
        Nesta versão os dados climáticos são simulados. A integração real usará
        previsão horária por localização.
      </p>
    </section>
  );
}
