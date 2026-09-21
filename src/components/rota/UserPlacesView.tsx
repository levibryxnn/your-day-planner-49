import React, { useState } from "react";
import { useTripStore } from "../../lib/tripStore";
import { AddedPlaceDraft, PriorityLevel } from "../../lib/types";
import { Plus, Trash2, ArrowRight, Pin, Compass } from "lucide-react";
import { AddStopModal } from "./AddStopModal";

export function UserPlacesView() {
  const {
    config,
    userDraftPlaces,
    addUserDraftPlace,
    removeUserDraftPlace,
    toggleDraftPriority,
    generateItinerary,
    goToStep,
  } = useTripStore();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddStop = (place: AddedPlaceDraft, priority: PriorityLevel) => {
    addUserDraftPlace({
      ...place,
      priority: priority === "required" ? "required" : "preferred",
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-60px)] flex-col justify-between px-6 pb-8 pt-6 animate-in fade-in duration-300">
      <div className="mx-auto w-full max-w-sm space-y-6">
        <div>
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-emerald-800">
            Cocriação opcional
          </span>
          <h2 className="mt-1 font-serif text-2xl font-bold leading-tight text-stone-950">
            Tem algum lugar que você já quer incluir?
          </h2>
          <p className="mt-1.5 text-xs leading-relaxed text-stone-600">
            Pode ser um restaurante que você conhece, uma atração recomendada ou um lugar que não quer deixar de visitar.
          </p>
        </div>

        <div className="space-y-3">
          {userDraftPlaces.length > 0 ? (
            userDraftPlaces.map((place) => {
              const isRequired = place.priority === "required";
              return (
                <div
                  key={place.id}
                  className="space-y-2.5 rounded-2xl border border-stone-200 bg-white p-3.5 shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={place.image}
                      alt={place.name}
                      className="h-14 w-14 flex-shrink-0 rounded-xl bg-stone-100 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="block text-[10.5px] font-semibold uppercase text-stone-500">
                        {place.category}
                      </span>
                      <h3 className="truncate text-sm font-bold text-stone-900">{place.name}</h3>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-stone-500">
                        <span>{place.neighborhood}</span>
                        <span>•</span>
                        <span>{place.costType === "free" ? "Grátis" : "~R$" + place.cost}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => removeUserDraftPlace(place.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-800"
                      title="Remover lugar"
                      aria-label={"Remover " + place.name}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between border-t border-stone-100 pt-2">
                    <span className="text-[11px] font-medium text-stone-500">Importância</span>
                    <button
                      type="button"
                      onClick={() => toggleDraftPriority(place.id)}
                      className={
                        isRequired
                          ? "flex items-center gap-1 rounded-full border border-emerald-900 bg-emerald-900 px-2.5 py-1 text-[11px] font-semibold text-white transition-all"
                          : "flex items-center gap-1 rounded-full border border-stone-200 bg-stone-100 px-2.5 py-1 text-[11px] font-semibold text-stone-700 transition-all hover:bg-stone-200"
                      }
                    >
                      {isRequired && <Pin className="h-3 w-3 fill-white" />}
                      <span>{isRequired ? "Quero muito ir" : "Se encaixar no roteiro"}</span>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="space-y-1 rounded-2xl border border-stone-200/70 bg-stone-50 p-5 text-center">
              <Compass className="mx-auto h-6 w-6 text-emerald-800" />
              <p className="text-xs text-stone-600">
                Nenhum lugar adicionado. Se preferir, o Rota organiza tudo.
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-stone-300 bg-white/70 px-4 py-3 text-xs font-semibold text-stone-700 transition-all hover:border-emerald-800/40 hover:bg-white active:scale-[0.99]"
          >
            <Plus className="h-4 w-4" />
            <span>Adicionar lugar em {config.destination || "seu destino"}</span>
          </button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-sm space-y-2.5 pt-6">
        <button
          onClick={() => {
            generateItinerary();
            goToStep("generating");
          }}
          className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-stone-900 px-6 py-4 text-sm font-semibold tracking-tight text-white shadow-md transition-all hover:bg-stone-800 active:scale-[0.98]"
        >
          <span>Organizar meu dia com estes lugares</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>

        <button
          onClick={() => {
            generateItinerary([]);
            goToStep("generating");
          }}
          className="w-full py-2 text-xs font-semibold text-stone-500 transition-colors hover:text-stone-900"
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
