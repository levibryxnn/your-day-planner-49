import React from "react";
import { useTripStore } from "../../lib/tripStore";
import { INTEREST_OPTIONS } from "../../lib/mockData";
import {
  ArrowRight,
  User,
  Users,
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

export function ConfigWizard() {
  const { step, config, updateConfig, goToStep } = useTripStore();

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
    if (exists) {
      updateConfig({ interests: config.interests.filter((i) => i !== label) });
    } else {
      updateConfig({ interests: [...config.interests, label] });
    }
  };

  // STEP 1: Quem vai com você?
  if (step === "config_group") {
    return (
      <div className="flex flex-col justify-between min-h-[calc(100vh-60px)] px-6 pt-6 pb-8 animate-in fade-in duration-300">
        <div className="space-y-6 max-w-sm mx-auto w-full">
          <div>
            <span className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider block">
              Etapa 1 de 4
            </span>
            <h2 className="text-2xl font-serif font-bold text-stone-950 mt-1">
              Quem vai com você?
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Adequamos os lugares e o ritmo do dia para o tamanho do seu grupo.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {/* Adultos */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-bold text-stone-900 block">Adultos</span>
                  <span className="text-xs text-stone-600">A partir de 12 anos</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    updateConfig({ adults: Math.max(1, config.adults - 1) })
                  }
                  className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold flex items-center justify-center transition-all"
                  aria-label="Diminuir adultos"
                >
                  -
                </button>
                <span className="w-5 text-center font-bold text-base text-stone-950 font-mono">
                  {config.adults}
                </span>
                <button
                  type="button"
                  onClick={() => updateConfig({ adults: config.adults + 1 })}
                  className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold flex items-center justify-center transition-all"
                  aria-label="Aumentar adultos"
                >
                  +
                </button>
              </div>
            </div>

            {/* Crianças */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700">
                  <Baby className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-bold text-stone-900 block">Crianças</span>
                  <span className="text-xs text-stone-600">Até 11 anos</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    updateConfig({ children: Math.max(0, config.children - 1) })
                  }
                  className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold flex items-center justify-center transition-all"
                  aria-label="Diminuir crianças"
                >
                  -
                </button>
                <span className="w-5 text-center font-bold text-base text-stone-950 font-mono">
                  {config.children}
                </span>
                <button
                  type="button"
                  onClick={() => updateConfig({ children: config.children + 1 })}
                  className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold flex items-center justify-center transition-all"
                  aria-label="Aumentar crianças"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-sm mx-auto w-full pt-6">
          <button
            onClick={() => goToStep("config_time")}
            className="w-full py-4 px-6 rounded-2xl bg-stone-950 hover:bg-black active:scale-[0.98] text-white text-sm font-semibold tracking-tight shadow-md flex items-center justify-center gap-2 group transition-all"
          >
            <span>Continuar</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  // STEP 2: Quanto tempo temos?
  if (step === "config_time") {
    return (
      <div className="flex flex-col justify-between min-h-[calc(100vh-60px)] px-6 pt-6 pb-8 animate-in fade-in duration-300">
        <div className="space-y-6 max-w-sm mx-auto w-full">
          <div>
            <span className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider block">
              Etapa 2 de 4
            </span>
            <h2 className="text-2xl font-serif font-bold text-stone-950 mt-1">
              Quanto tempo temos?
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Defina seu horário de saída e a hora em que deseja encerrar o dia.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-sm space-y-1">
              <label className="text-[11px] font-semibold text-stone-600 uppercase block">
                Horário inicial
              </label>
              <input
                type="time"
                value={config.startTime}
                onChange={(e) => updateConfig({ startTime: e.target.value })}
                className="w-full text-2xl font-mono font-bold text-stone-900 bg-transparent focus:outline-none"
              />
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-sm space-y-1">
              <label className="text-[11px] font-semibold text-stone-600 uppercase block">
                Voltar às
              </label>
              <input
                type="time"
                value={config.endTime}
                onChange={(e) => updateConfig({ endTime: e.target.value })}
                className="w-full text-2xl font-mono font-bold text-stone-900 bg-transparent focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-100/80 border border-stone-200/60 flex items-center gap-3 text-xs text-stone-600 font-medium">
            <Clock className="w-4 h-4 text-stone-600 flex-shrink-0" />
            <span>
              Total de 12 horas de disponibilidade com tempo confortável para cada parada.
            </span>
          </div>
        </div>

        <div className="max-w-sm mx-auto w-full pt-6">
          <button
            onClick={() => goToStep("config_transport")}
            className="w-full py-4 px-6 rounded-2xl bg-stone-950 hover:bg-black active:scale-[0.98] text-white text-sm font-semibold tracking-tight shadow-md flex items-center justify-center gap-2 group transition-all"
          >
            <span>Continuar</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  // STEP 3: Como vocês querem se locomover?
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
      <div className="flex flex-col justify-between min-h-[calc(100vh-60px)] px-6 pt-6 pb-8 animate-in fade-in duration-300">
        <div className="space-y-6 max-w-sm mx-auto w-full">
          <div>
            <span className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider block">
              Etapa 3 de 4
            </span>
            <h2 className="text-2xl font-serif font-bold text-stone-950 mt-1">
              Como vocês querem se locomover?
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Calculamos os custos de deslocamento e vagas conforme sua escolha.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {modes.map((mode) => {
              const Icon = mode.icon;
              const isSelected = config.transportMode === mode.id;
              return (
                <div
                  key={mode.id}
                  onClick={() => updateConfig({ transportMode: mode.id })}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3.5 ${
                    isSelected
                      ? "bg-white border-stone-950 shadow-md ring-1 ring-stone-950"
                      : "bg-white/80 border-stone-200/80 hover:border-stone-300"
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-stone-950 text-white"
                        : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-bold text-stone-900 block">
                      {mode.label}
                    </span>
                    <span className="text-xs text-stone-600">{mode.desc}</span>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-stone-950 text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="max-w-sm mx-auto w-full pt-6">
          <button
            onClick={() => goToStep("config_interests")}
            className="w-full py-4 px-6 rounded-2xl bg-stone-950 hover:bg-black active:scale-[0.98] text-white text-sm font-semibold tracking-tight shadow-md flex items-center justify-center gap-2 group transition-all"
          >
            <span>Continuar</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  // STEP 4: O que faria esse dia valer a pena? (Interesses)
  if (step === "config_interests") {
    return (
      <div className="flex flex-col justify-between min-h-[calc(100vh-60px)] px-6 pt-6 pb-8 animate-in fade-in duration-300">
        <div className="space-y-5 max-w-sm mx-auto w-full">
          <div>
            <span className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider block">
              Etapa 4 de 4
            </span>
            <h2 className="text-2xl font-serif font-bold text-stone-950 mt-1">
              O que faria esse dia valer a pena?
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Selecione o que mais combina com seu momento. Sem exageros.
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
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between h-24 ${
                    isSelected
                      ? "bg-white border-stone-950 shadow-sm ring-1 ring-stone-950"
                      : "bg-white/80 border-stone-200/80 hover:border-stone-300"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        isSelected
                          ? "bg-stone-950 text-white"
                          : "bg-stone-100 text-stone-600"
                      }`}
                    >
                      {renderIcon(interest.icon)}
                    </div>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-stone-950 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-bold text-stone-900 mt-2">
                    {interest.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="max-w-sm mx-auto w-full pt-6">
          <button
            onClick={() => goToStep("user_places")}
            className="w-full py-4 px-6 rounded-2xl bg-stone-950 hover:bg-black active:scale-[0.98] text-white text-sm font-semibold tracking-tight shadow-md flex items-center justify-center gap-2 group transition-all"
          >
            <span>Próximo: Lugares que quero incluir</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  return null;
}
