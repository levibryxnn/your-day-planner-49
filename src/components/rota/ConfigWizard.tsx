import React, { useMemo, useState } from "react";
import { useTripStore } from "../../lib/tripStore";
import { INTEREST_OPTIONS } from "../../lib/mockData";
import { TimePickerSheet } from "./TimePickerSheet";
import {
  ArrowRight,
  User,
  Clock,
  Car,
  Bus,
  Footprints,
  Check,
  Trees,
  Utensils,
  Landmark,
  Baby,
  ShoppingBag,
  BookOpen,
  Compass,
  Camera,
} from "lucide-react";

type TimeField = "start" | "end" | null;

function toMinutes(time: string) {
  const [hours = 0, minutes = 0] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatDuration(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (minutes === 0) return hours + "h";
  return hours + "h" + String(minutes).padStart(2, "0");
}

export function ConfigWizard() {
  const { step, config, updateConfig, goToStep } = useTripStore();
  const [timeField, setTimeField] = useState<TimeField>(null);

  const totalAvailableMinutes = useMemo(
    () => toMinutes(config.endTime) - toMinutes(config.startTime),
    [config.startTime, config.endTime]
  );
  const invalidTimeRange = totalAvailableMinutes <= 0;

  const renderIcon = (iconName: string) => {
    const props = { className: "w-5 h-5" };
    switch (iconName) {
      case "Trees":
        return <Trees {...props} />;
      case "Utensils":
        return <Utensils {...props} />;
      case "Landmark":
        return <Landmark {...props} />;
      case "Baby":
        return <Baby {...props} />;
      case "ShoppingBag":
        return <ShoppingBag {...props} />;
      case "BookOpen":
        return <BookOpen {...props} />;
      case "Compass":
        return <Compass {...props} />;
      case "Camera":
        return <Camera {...props} />;
      default:
        return <Compass {...props} />;
    }
  };

  const toggleInterest = (label: string) => {
    const exists = config.interests.includes(label);
    updateConfig({
      interests: exists
        ? config.interests.filter((interest) => interest !== label)
        : [...config.interests, label],
    });
  };

  if (step === "config_group") {
    return (
      <div className="flex min-h-[calc(100vh-60px)] flex-col justify-between px-6 pb-8 pt-6 animate-in fade-in duration-300">
        <div className="mx-auto w-full max-w-sm space-y-6">
          <div>
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Etapa 1 de 4
            </span>
            <h2 className="mt-1 font-serif text-2xl font-bold text-stone-950">
              Quem vai com você?
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-stone-600">
              Adequamos os lugares e o ritmo do dia para o tamanho do seu grupo.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between rounded-2xl border border-stone-200/80 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-900">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-sm font-bold text-stone-900">Adultos</span>
                  <span className="text-xs text-stone-500">A partir de 12 anos</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => updateConfig({ adults: Math.max(1, config.adults - 1) })}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-stone-50 font-bold text-stone-700 transition-all hover:bg-stone-100"
                  aria-label="Diminuir adultos"
                >
                  -
                </button>
                <span className="w-5 text-center font-mono text-base font-bold text-stone-950">
                  {config.adults}
                </span>
                <button
                  type="button"
                  onClick={() => updateConfig({ adults: config.adults + 1 })}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-stone-50 font-bold text-stone-700 transition-all hover:bg-stone-100"
                  aria-label="Aumentar adultos"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-stone-200/80 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-900">
                  <Baby className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-sm font-bold text-stone-900">Crianças</span>
                  <span className="text-xs text-stone-500">Até 11 anos</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => updateConfig({ children: Math.max(0, config.children - 1) })}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-stone-50 font-bold text-stone-700 transition-all hover:bg-stone-100"
                  aria-label="Diminuir crianças"
                >
                  -
                </button>
                <span className="w-5 text-center font-mono text-base font-bold text-stone-950">
                  {config.children}
                </span>
                <button
                  type="button"
                  onClick={() => updateConfig({ children: config.children + 1 })}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-stone-50 font-bold text-stone-700 transition-all hover:bg-stone-100"
                  aria-label="Aumentar crianças"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-sm pt-6">
          <button
            onClick={() => goToStep("config_time")}
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-stone-900 px-6 py-4 text-sm font-semibold tracking-tight text-white shadow-md transition-all hover:bg-stone-800 active:scale-[0.98]"
          >
            <span>Continuar</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    );
  }

  if (step === "config_time") {
    return (
      <>
        <div className="flex min-h-[calc(100vh-60px)] flex-col justify-between px-6 pb-8 pt-6 animate-in fade-in duration-300">
          <div className="mx-auto w-full max-w-sm space-y-6">
            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Etapa 2 de 4
              </span>
              <h2 className="mt-1 font-serif text-2xl font-bold text-stone-950">
                Quanto tempo temos?
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-stone-600">
                Escolha quando quer começar e até que horas deseja aproveitar o dia.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTimeField("start")}
                className="rounded-2xl border border-stone-200 bg-white p-4 text-left shadow-sm transition-all hover:border-emerald-800/40 hover:shadow-md"
              >
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                  Saída
                </span>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <strong className="font-mono text-2xl text-stone-950">{config.startTime}</strong>
                  <Clock className="h-5 w-5 text-emerald-800" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTimeField("end")}
                className="rounded-2xl border border-stone-200 bg-white p-4 text-left shadow-sm transition-all hover:border-emerald-800/40 hover:shadow-md"
              >
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                  Volta
                </span>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <strong className="font-mono text-2xl text-stone-950">{config.endTime}</strong>
                  <Clock className="h-5 w-5 text-emerald-800" />
                </div>
              </button>
            </div>

            <div
              className={
                invalidTimeRange
                  ? "flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-950"
                  : "flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-xs text-emerald-950"
              }
            >
              <Clock className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <div>
                <span className="block font-semibold">
                  {invalidTimeRange
                    ? "O horário de volta precisa ser depois da saída."
                    : "Você terá " + formatDuration(totalAvailableMinutes) + " para aproveitar o dia."}
                </span>
                {!invalidTimeRange && (
                  <span className="mt-0.5 block opacity-75">
                    O roteiro será montado dentro dessa janela.
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-sm pt-6">
            <button
              onClick={() => goToStep("config_transport")}
              disabled={invalidTimeRange}
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-stone-900 px-6 py-4 text-sm font-semibold tracking-tight text-white shadow-md transition-all hover:bg-stone-800 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40"
            >
              <span>Continuar</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        <TimePickerSheet
          isOpen={timeField === "start"}
          title="Escolha o horário de saída"
          value={config.startTime}
          onChange={(value) => updateConfig({ startTime: value })}
          onClose={() => setTimeField(null)}
        />
        <TimePickerSheet
          isOpen={timeField === "end"}
          title="Que horas você quer voltar?"
          value={config.endTime}
          onChange={(value) => updateConfig({ endTime: value })}
          onClose={() => setTimeField(null)}
        />
      </>
    );
  }

  if (step === "config_transport") {
    const modes = [
      {
        id: "car" as const,
        label: "Carro",
        desc: "Ideal para trajetos maiores com família",
        icon: Car,
      },
      {
        id: "public_transit" as const,
        label: "Transporte público",
        desc: "Metrô e ônibus sem custo de estacionamento",
        icon: Bus,
      },
      {
        id: "walking" as const,
        label: "A pé",
        desc: "Paradas concentradas no mesmo bairro",
        icon: Footprints,
      },
    ];

    return (
      <div className="flex min-h-[calc(100vh-60px)] flex-col justify-between px-6 pb-8 pt-6 animate-in fade-in duration-300">
        <div className="mx-auto w-full max-w-sm space-y-6">
          <div>
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Etapa 3 de 4
            </span>
            <h2 className="mt-1 font-serif text-2xl font-bold leading-tight text-stone-950">
              Como vocês querem se locomover?
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-stone-600">
              Estimamos deslocamentos e custos conforme sua escolha.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {modes.map((mode) => {
              const Icon = mode.icon;
              const isSelected = config.transportMode === mode.id;
              return (
                <button
                  type="button"
                  key={mode.id}
                  onClick={() => updateConfig({ transportMode: mode.id })}
                  className={
                    isSelected
                      ? "flex w-full items-center gap-3.5 rounded-2xl border border-emerald-800/50 bg-emerald-50/60 p-4 text-left shadow-sm transition-all"
                      : "flex w-full items-center gap-3.5 rounded-2xl border border-stone-200/80 bg-white p-4 text-left transition-all hover:border-stone-300"
                  }
                  aria-pressed={isSelected}
                >
                  <div
                    className={
                      isSelected
                        ? "flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-900 text-white"
                        : "flex h-11 w-11 items-center justify-center rounded-xl bg-stone-100 text-stone-600"
                    }
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <span className="block text-sm font-bold text-stone-900">{mode.label}</span>
                    <span className="text-xs text-stone-500">{mode.desc}</span>
                  </div>
                  {isSelected && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-900 text-white">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mx-auto w-full max-w-sm pt-6">
          <button
            onClick={() => goToStep("config_interests")}
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-stone-900 px-6 py-4 text-sm font-semibold tracking-tight text-white shadow-md transition-all hover:bg-stone-800 active:scale-[0.98]"
          >
            <span>Continuar</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    );
  }

  if (step === "config_interests") {
    return (
      <div className="flex min-h-[calc(100vh-60px)] flex-col justify-between px-6 pb-8 pt-6 animate-in fade-in duration-300">
        <div className="mx-auto w-full max-w-sm space-y-5">
          <div>
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Etapa 4 de 4
            </span>
            <h2 className="mt-1 font-serif text-2xl font-bold text-stone-950">
              O que faria esse dia valer a pena?
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-stone-600">
              Escolha o que combina com vocês. Você pode selecionar mais de uma opção.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            {INTEREST_OPTIONS.map((interest) => {
              const isSelected = config.interests.includes(interest.label);
              return (
                <button
                  key={interest.id}
                  type="button"
                  onClick={() => toggleInterest(interest.label)}
                  className={
                    isSelected
                      ? "flex h-24 flex-col justify-between rounded-2xl border border-emerald-800/50 bg-emerald-50/60 p-3.5 text-left shadow-sm transition-all"
                      : "flex h-24 flex-col justify-between rounded-2xl border border-stone-200/80 bg-white p-3.5 text-left transition-all hover:border-stone-300"
                  }
                  aria-pressed={isSelected}
                >
                  <div className="flex w-full items-center justify-between">
                    <div
                      className={
                        isSelected
                          ? "flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-900 text-white"
                          : "flex h-8 w-8 items-center justify-center rounded-xl bg-stone-100 text-stone-600"
                      }
                    >
                      {renderIcon(interest.icon)}
                    </div>
                    {isSelected && (
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-900 text-white">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <span className="mt-2 text-xs font-bold text-stone-900">{interest.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mx-auto w-full max-w-sm pt-6">
          <button
            onClick={() => goToStep("user_places")}
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-stone-900 px-6 py-4 text-sm font-semibold tracking-tight text-white shadow-md transition-all hover:bg-stone-800 active:scale-[0.98]"
          >
            <span>Próximo: lugares que quero incluir</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    );
  }

  return null;
}
