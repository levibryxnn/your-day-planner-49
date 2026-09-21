import React, { useState } from "react";
import { useTripStore } from "../../lib/tripStore";
import { AVAILABLE_MOCK_PLACES } from "../../lib/mockData";
import { AddedPlaceDraft, PriorityLevel } from "../../lib/types";
import {
  Plus,
  Trash2,
  Check,
  Sparkles,
  ArrowRight,
  Pin,
  Clock,
  Compass,
} from "lucide-react";
import { AddStopModal } from "./AddStopModal";

export function UserPlacesView() {
  const {
    userDraftPlaces,
    addUserDraftPlace,
    removeUserDraftPlace,
    toggleDraftPriority,
    goToStep,
  } = useTripStore();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddStop = (place: AddedPlaceDraft, priority: PriorityLevel) => {
    addUserDraftPlace({
      ...place,
      priority: priority === "required" ? "required" : "preferred",
    });
  };

  const handleProceedWithEverything = () => {
    goToStep("generating");
  };

  const handleSkipToDefault = () => {
    goToStep("generating");
  };

  return (
    <div className="flex flex-col justify-between min-h-[calc(100vh-60px)] px-6 pt-6 pb-8 animate-in fade-in duration-300">
      <div className="space-y-6 max-w-sm mx-auto w-full">
        <div>
          <span className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider block">
            Cocriação • Opcional
          </span>
          <h2 className="text-2xl font-serif font-bold text-stone-950 mt-1 leading-tight">
            Tem algum lugar que você já quer incluir no seu dia?
          </h2>
          <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
            Pode ser um restaurante que você conhece, uma atração que alguém recomendou ou simplesmente um lugar que você não quer deixar de visitar.
          </p>
        </div>

        {/* Added Places List */}
        <div className="space-y-3">
          {userDraftPlaces.length > 0 ? (
            userDraftPlaces.map((place) => {
              const isRequired = place.priority === "required";
              return (
                <div
                  key={place.id}
                  className="p-3.5 rounded-2xl bg-white border border-stone-300 shadow-sm space-y-2.5 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={place.image}
                      alt={place.name}
                      className="w-14 h-14 rounded-xl object-cover bg-stone-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10.5px] font-semibold text-stone-600 uppercase block">
                        {place.category}
                      </span>
                      <h3 className="text-sm font-bold text-stone-900 truncate">
                        {place.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-stone-600 mt-0.5">
                        <span>{place.neighborhood}</span>
                        <span>•</span>
                        <span>{place.costType === "free" ? "Grátis" : `~R$${place.cost}`}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => removeUserDraftPlace(place.id)}
                      className="w-8 h-8 rounded-full hover:bg-stone-100 text-stone-600 hover:text-stone-800 flex items-center justify-center transition-colors"
                      title="Remover lugar"
                      aria-label="Remover lugar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Priority selector */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[11px] text-stone-600 font-medium">
                      Importância no roteiro:
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleDraftPriority(place.id)}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 ${
                        isRequired
                          ? "bg-stone-900 text-white border-stone-900"
                          : "bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200"
                      }`}
                    >
                      {isRequired && <Pin className="w-3 h-3 fill-white" />}
                      <span>{isRequired ? "Quero muito ir" : "Se encaixar no roteiro"}</span>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-5 rounded-2xl bg-stone-100/70 border border-stone-200/60 text-center space-y-1">
              <Compass className="w-6 h-6 text-stone-600 mx-auto" />
              <p className="text-xs text-stone-600">
                Nenhum lugar adicionado ainda. Se preferir, nós cuidamos de toda a rota.
              </p>
            </div>
          )}

          {/* Action to Add Place */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-stone-300 hover:border-stone-400 bg-white/60 hover:bg-white text-stone-700 text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar outro lugar em São Paulo</span>
          </button>
        </div>
      </div>

      {/* Footer Decisions */}
      <div className="max-w-sm mx-auto w-full pt-6 space-y-2.5">
        <button
          onClick={handleProceedWithEverything}
          className="w-full py-4 px-6 rounded-2xl bg-stone-950 hover:bg-black active:scale-[0.98] text-white text-sm font-semibold tracking-tight shadow-md flex items-center justify-center gap-2 group transition-all"
        >
          <span>Organizar meu dia com estes lugares</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={handleSkipToDefault}
          className="w-full py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
        >
          Deixar o Rota escolher tudo
        </button>
      </div>

      <AddStopModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddStop={handleAddStop}
      />
    </div>
  );
}
