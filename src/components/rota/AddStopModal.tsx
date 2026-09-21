import React, { useState } from "react";
import { AVAILABLE_MOCK_PLACES } from "../../lib/mockData";
import { AddedPlaceDraft, PriorityLevel } from "../../lib/types";
import { useTripStore } from "../../lib/tripStore";
import { X, Search, Plus, Check, Clock } from "lucide-react";

interface AddStopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStop: (place: AddedPlaceDraft, priority: PriorityLevel) => void;
}

export function AddStopModal({ isOpen, onClose, onAddStop }: AddStopModalProps) {
  const { config } = useTripStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<AddedPlaceDraft | null>(null);
  const [priorityChoice, setPriorityChoice] =
    useState<PriorityLevel>("required");

  if (!isOpen) return null;

  const filteredPlaces = AVAILABLE_MOCK_PLACES.filter((place) => {
    const query = searchTerm.toLowerCase();
    return (
      place.name.toLowerCase().includes(query) ||
      place.category.toLowerCase().includes(query) ||
      place.neighborhood.toLowerCase().includes(query)
    );
  });

  const handleClose = () => {
    setSelectedPlace(null);
    setSearchTerm("");
    onClose();
  };

  const handleConfirm = () => {
    if (!selectedPlace) return;
    onAddStop(selectedPlace, priorityChoice);
    setSelectedPlace(null);
    setSearchTerm("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/40 p-0 backdrop-blur-sm animate-in fade-in duration-200 sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-stone-200 bg-[#FFFEFB] shadow-2xl slide-in-from-bottom duration-300 sm:rounded-3xl"
        role="dialog"
        aria-modal="true"
        aria-label="Adicionar parada ao roteiro"
      >
        <div className="flex items-center justify-between border-b border-stone-100 p-4">
          <div>
            <h2 className="font-serif text-base font-bold text-stone-900">
              Adicionar parada
            </h2>
            <p className="text-xs text-stone-500">
              Buscar lugar em {config.destination || "seu destino"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-stone-500 transition-all hover:bg-stone-100"
            aria-label="Fechar busca de lugar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 pb-2">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              type="search"
              placeholder="Buscar por nome, bairro ou categoria"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 py-3 pl-10 pr-4 text-xs font-medium text-stone-900 outline-none transition-all placeholder:text-stone-400 focus:border-emerald-800/40"
              aria-label="Buscar lugar"
            />
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {!selectedPlace ? (
            <div className="space-y-2">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                Exemplos simulados para esta versão
              </span>

              {filteredPlaces.map((place) => (
                <button
                  key={place.id}
                  type="button"
                  onClick={() => setSelectedPlace(place)}
                  className="group flex w-full items-center gap-3 rounded-2xl border border-stone-200/80 bg-white p-3 text-left transition-all hover:border-emerald-800/30 hover:bg-emerald-50/20"
                >
                  <img
                    src={place.image}
                    alt={place.name}
                    className="h-14 w-14 flex-shrink-0 rounded-xl bg-stone-100 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-[10.5px] font-medium uppercase text-stone-500">
                        {place.category}
                      </span>
                      <span className="flex-shrink-0 text-xs font-semibold text-stone-900">
                        {place.costType === "free" ? "Grátis" : "~R$" + place.cost}
                      </span>
                    </div>
                    <h3 className="truncate text-sm font-semibold text-stone-900">
                      {place.name}
                    </h3>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-stone-500">
                      <span className="truncate">{place.neighborhood}</span>
                      <span>•</span>
                      <span className="flex flex-shrink-0 items-center gap-0.5">
                        <Clock className="h-3 w-3 text-stone-400" />
                        {place.duration}
                      </span>
                    </div>
                  </div>
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-500 transition-all group-hover:bg-emerald-900 group-hover:text-white">
                    <Plus className="h-4 w-4" />
                  </div>
                </button>
              ))}

              {filteredPlaces.length === 0 && (
                <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5 text-center text-xs text-stone-500">
                  Nenhum exemplo corresponde à busca.
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4 pt-1">
              <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-3">
                <img
                  src={selectedPlace.image}
                  alt={selectedPlace.name}
                  className="h-12 w-12 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-stone-900">
                    {selectedPlace.name}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {selectedPlace.costType === "free"
                      ? "Atividade gratuita"
                      : "Previsão de R$" + selectedPlace.cost}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPlace(null)}
                  className="text-xs font-medium text-emerald-900 underline underline-offset-2"
                >
                  Alterar
                </button>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-stone-900">
                  Como você quer encaixar este lugar?
                </label>
                <p className="mb-3 text-xs leading-relaxed text-stone-500">
                  Sua escolha define o que pode ou não ser substituído durante os ajustes do roteiro.
                </p>

                <div className="grid grid-cols-1 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPriorityChoice("required")}
                    className={
                      priorityChoice === "required"
                        ? "flex items-start gap-3 rounded-2xl border border-emerald-800/50 bg-emerald-50/60 p-3.5 text-left shadow-sm"
                        : "flex items-start gap-3 rounded-2xl border border-stone-200 bg-white p-3.5 text-left transition-all hover:border-stone-300"
                    }
                    aria-pressed={priorityChoice === "required"}
                  >
                    <div
                      className={
                        priorityChoice === "required"
                          ? "mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-900 text-white"
                          : "mt-0.5 h-5 w-5 rounded-full border border-stone-300"
                      }
                    >
                      {priorityChoice === "required" && (
                        <Check className="h-3 w-3 stroke-[3]" />
                      )}
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-stone-900">
                        Quero muito ir
                      </span>
                      <span className="text-xs leading-tight text-stone-500">
                        O Rota preserva esta parada e ajusta o restante primeiro.
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPriorityChoice("preferred")}
                    className={
                      priorityChoice === "preferred"
                        ? "flex items-start gap-3 rounded-2xl border border-emerald-800/50 bg-emerald-50/60 p-3.5 text-left shadow-sm"
                        : "flex items-start gap-3 rounded-2xl border border-stone-200 bg-white p-3.5 text-left transition-all hover:border-stone-300"
                    }
                    aria-pressed={priorityChoice === "preferred"}
                  >
                    <div
                      className={
                        priorityChoice === "preferred"
                          ? "mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-900 text-white"
                          : "mt-0.5 h-5 w-5 rounded-full border border-stone-300"
                      }
                    >
                      {priorityChoice === "preferred" && (
                        <Check className="h-3 w-3 stroke-[3]" />
                      )}
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-stone-900">
                        Encaixe se fizer sentido
                      </span>
                      <span className="text-xs leading-tight text-stone-500">
                        Tentamos incluir sem prejudicar tempo e orçamento.
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {selectedPlace && (
          <div className="flex gap-2 border-t border-stone-200 bg-[#FAF8F3] p-4">
            <button
              type="button"
              onClick={() => setSelectedPlace(null)}
              className="flex-1 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-xs font-semibold text-stone-700 hover:bg-stone-50"
            >
              Voltar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 rounded-2xl bg-stone-900 px-4 py-3 text-xs font-semibold text-white transition-all hover:bg-stone-800 active:scale-[0.98]"
            >
              Adicionar ao dia
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
