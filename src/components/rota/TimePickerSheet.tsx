import React from "react";
import { Check, X } from "lucide-react";

interface TimePickerSheetProps {
  isOpen: boolean;
  title: string;
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
}

const TIME_OPTIONS = Array.from({ length: 36 }, (_, index) => {
  const totalMinutes = 6 * 60 + index * 30;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
});

export function TimePickerSheet({
  isOpen,
  title,
  value,
  onChange,
  onClose,
}: TimePickerSheetProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/35 backdrop-blur-[2px]"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-md rounded-t-[28px] border border-stone-200 bg-[#FFFEFB] shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex items-center justify-between border-b border-stone-200/80 px-5 py-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-800">
              Horário do passeio
            </span>
            <h3 className="mt-1 text-lg font-serif font-bold text-stone-950">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900"
            aria-label="Fechar seletor de horário"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[52vh] overflow-y-auto px-4 py-3">
          <div className="grid grid-cols-3 gap-2">
            {TIME_OPTIONS.map((time) => {
              const selected = time === value;
              return (
                <button
                  key={time}
                  type="button"
                  onClick={() => onChange(time)}
                  className={`min-h-12 rounded-2xl border px-3 py-3 text-sm font-semibold transition-all ${
                    selected
                      ? "border-emerald-800 bg-emerald-50 text-emerald-950 shadow-sm"
                      : "border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50"
                  }`}
                  aria-pressed={selected}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {selected && <Check className="h-3.5 w-3.5" />}
                    {time}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-stone-200/80 bg-[#FAF8F3] px-4 py-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-2xl bg-stone-900 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-stone-800 active:scale-[0.99]"
          >
            Confirmar horário
          </button>
        </div>
      </div>
    </div>
  );
}
