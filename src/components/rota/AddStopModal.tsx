import React, { useState } from "react";
import { AVAILABLE_MOCK_PLACES } from "../../lib/mockData";
import { AddedPlaceDraft, PriorityLevel } from "../../lib/types";
import { X, Search, Plus, Check, Clock } from "lucide-react";

interface AddStopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStop: (place: AddedPlaceDraft, priority: PriorityLevel) => void;
}

export function AddStopModal({ isOpen, onClose, onAddStop }: AddStopModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<AddedPlaceDraft | null>(null);
  const [priorityChoice, setPriorityChoice] = useState<PriorityLevel>("required");

  if (!isOpen) return null;

  const filteredPlaces = AVAILABLE_MOCK_PLACES.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.neighborhood.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConfirm = () => {
    if (selectedPlace) {
      onAddStop(selectedPlace, priorityChoice);
      setSelectedPlace(null);
      setSearchTerm("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-stone-950/40 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl border border-stone-200 max-h-[85vh] flex flex-col slide-in-from-bottom duration-300"
        role="dialog"
      >
        {/* Header */}
        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-serif font-bold text-stone-900">
              Adicionar parada ao roteiro
            </h2>
            <p className="text-xs text-stone-500">
              Selecione uma atração ou restaurante em São Paulo
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-stone-100 text-stone-500 flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 pb-2">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nome, bairro ou categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-stone-100/80 border border-stone-200 text-xs font-medium text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400/30 transition-all"
            />
          </div>
        </div>

        {/* Place Selection or Priority Step */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {!selectedPlace ? (
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
                Lugares sugeridos em São Paulo
              </span>
              {filteredPlaces.map((place) => (
                <div
                  key={place.id}
                  onClick={() => setSelectedPlace(place)}
                  className="flex items-center gap-3 p-3 rounded-2xl border border-stone-200/80 hover:border-stone-400 hover:bg-stone-50/50 cursor-pointer transition-all group"
                >
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-14 h-14 rounded-xl object-cover flex-shrink-0 bg-stone-100"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10.5px] font-medium text-stone-500 uppercase">
                        {place.category}
                      </span>
                      <span className="text-xs font-semibold text-stone-900">
                        {place.costType === "free" ? "Grátis" : `~R$${place.cost}`}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-stone-900 truncate">
                      {place.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                      <span>{place.neighborhood}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-3 h-3 text-stone-400" />
                        {place.duration}
                      </span>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-stone-100 group-hover:bg-stone-900 group-hover:text-white text-stone-500 flex items-center justify-center transition-all flex-shrink-0">
                    <Plus className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4 pt-1">
              {/* Selected preview */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-stone-100/80 border border-stone-200">
                <img
                  src={selectedPlace.image}
                  alt={selectedPlace.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-stone-900 truncate">
                    {selectedPlace.name}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {selectedPlace.costType === "free"
                      ? "Atividade gratuita"
                      : `Previsão de R$${selectedPlace.cost}`}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="text-xs text-stone-500 hover:text-stone-900 underline"
                >
                  Alterar
                </button>
              </div>

              {/* Priority question */}
              <div>
                <label className="text-sm font-semibold text-stone-900 block mb-1">
                  Como você quer encaixar este lugar?
                </label>
                <p className="text-xs text-stone-500 mb-3">
                  Defina a importância para a organização dos seus horários e saldo.
                </p>

                <div className="grid grid-cols-1 gap-2.5">
                  <div
                    onClick={() => setPriorityChoice("required")}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      priorityChoice === "required"
                        ? "border-stone-900 bg-stone-50 shadow-sm"
                        : "border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                        priorityChoice === "required"
                          ? "bg-stone-900 text-white"
                          : "border border-stone-300"
                      }`}
                    >
                      {priorityChoice === "required" && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-stone-900 block">
                        Quero ir de qualquer jeito (Prioridade)
                      </span>
                      <span className="text-xs text-stone-500 leading-tight">
                        O roteiro será organizado ao redor dele. Nunca o removeremos silenciosamente.
                      </span>
                    </div>
                  </div>

                  <div
                    onClick={() => setPriorityChoice("preferred")}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      priorityChoice === "preferred"
                        ? "border-stone-900 bg-stone-50 shadow-sm"
                        : "border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                        priorityChoice === "preferred"
                          ? "bg-stone-900 text-white"
                          : "border border-stone-300"
                      }`}
                    >
                      {priorityChoice === "preferred" && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-stone-900 block">
                        Encaixe se fizer sentido (Preferencial)
                      </span>
                      <span className="text-xs text-stone-500 leading-tight">
                        Tentaremos incluí-lo se houver tempo e orçamento sem prejudicar o restante do dia.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {selectedPlace && (
          <div className="p-4 bg-stone-50 border-t border-stone-200 flex gap-2">
            <button
              onClick={() => setSelectedPlace(null)}
              className="flex-1 py-3 px-4 rounded-2xl border border-stone-200 bg-white text-stone-700 text-xs font-semibold hover:bg-stone-100 transition-all"
            >
              Voltar
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 py-3 px-4 rounded-2xl bg-stone-900 text-white text-xs font-semibold hover:bg-black transition-all active:scale-[0.98]"
            >
              Adicionar ao dia
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
