"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";

export default function PatrouillesPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [patrouilles, setPatrouilles] = useState<Array<{
    id: number;
    agent: string;
    coequipier: string | null;
    secteur: string;
    vehicule: string;
    debut: string;
    fin: string | null;
    type: string;
    observations: string;
    active: boolean;
  }>>([
    {
      id: 1,
      agent: "Jean Dupont",
      coequipier: "Marie Martin",
      secteur: "Centre-ville",
      vehicule: "SEC-001",
      debut: "14:30",
      fin: null,
      type: "Patrouille mobile",
      observations: "Ronde normale",
      active: true,
    },
    {
      id: 2,
      agent: "Pierre Bernard",
      coequipier: null,
      secteur: "Quartier Nord",
      vehicule: "SEC-002",
      debut: "15:00",
      fin: null,
      type: "Intervention",
      observations: "Intervention en cours",
      active: true,
    },
  ]);

  const [newPatrouille, setNewPatrouille] = useState({
    coequipier: "",
    secteur: "",
    vehicule: "",
    type: "Patrouille mobile",
    observations: "",
  });

  const handleCreatePatrouille = () => {
    const patrouille = {
      id: patrouilles.length + 1,
      agent: "Jean Dupont", // TODO: Récupérer l'agent connecté
      coequipier: newPatrouille.coequipier || null,
      secteur: newPatrouille.secteur,
      vehicule: newPatrouille.vehicule,
      debut: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      fin: null,
      type: newPatrouille.type,
      observations: newPatrouille.observations,
      active: true,
    };
    setPatrouilles([...patrouilles, patrouille]);
    setNewPatrouille({
      coequipier: "",
      secteur: "",
      vehicule: "",
      type: "Patrouille mobile",
      observations: "",
    });
    setShowCreateForm(false);
  };

  const handleEndPatrouille = (id: number) => {
    setPatrouilles(
      patrouilles.map((p) =>
        p.id === id
          ? { ...p, fin: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }), active: false }
          : p
      )
    );
  };

  const handleUpdateType = (id: number, type: string) => {
    setPatrouilles(patrouilles.map((p) => (p.id === id ? { ...p, type } : p)));
  };

  return (
    <div className="page-enter mx-auto max-w-6xl px-4">
      <PageHeader
        title="Patrouilles"
        subtitle="Gestion des patrouilles et des missions en cours"
      />

      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-ink">Patrouilles actives</h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn-primary"
          >
            {showCreateForm ? "Annuler" : "Créer une patrouille"}
          </button>
        </div>

        {showCreateForm && (
          <div className="panel-soft p-6 mb-6">
            <h3 className="mb-4 font-bold text-ink">Nouvelle patrouille</h3>
            <div className="space-y-4">
              <div>
                <label className="label-caps block mb-2">Coéquipier (optionnel)</label>
                <input
                  type="text"
                  className="input-field w-full"
                  placeholder="Nom du coéquipier"
                  value={newPatrouille.coequipier}
                  onChange={(e) => setNewPatrouille({ ...newPatrouille, coequipier: e.target.value })}
                />
              </div>
              <div>
                <label className="label-caps block mb-2">Secteur</label>
                <input
                  type="text"
                  className="input-field w-full"
                  placeholder="Ex: Centre-ville"
                  value={newPatrouille.secteur}
                  onChange={(e) => setNewPatrouille({ ...newPatrouille, secteur: e.target.value })}
                />
              </div>
              <div>
                <label className="label-caps block mb-2">Véhicule</label>
                <input
                  type="text"
                  className="input-field w-full"
                  placeholder="Ex: SEC-001"
                  value={newPatrouille.vehicule}
                  onChange={(e) => setNewPatrouille({ ...newPatrouille, vehicule: e.target.value })}
                />
              </div>
              <div>
                <label className="label-caps block mb-2">Type de mission</label>
                <select
                  className="input-field w-full"
                  value={newPatrouille.type}
                  onChange={(e) => setNewPatrouille({ ...newPatrouille, type: e.target.value })}
                >
                  <option>Patrouille mobile</option>
                  <option>Intervention</option>
                  <option>Escorte</option>
                  <option>Événement</option>
                </select>
              </div>
              <div>
                <label className="label-caps block mb-2">Observations</label>
                <textarea
                  className="input-field w-full min-h-[80px]"
                  placeholder="Observations sur la mission..."
                  value={newPatrouille.observations}
                  onChange={(e) => setNewPatrouille({ ...newPatrouille, observations: e.target.value })}
                />
              </div>
              <button onClick={handleCreatePatrouille} className="btn-primary w-full">
                Créer la patrouille
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {patrouilles.map((patrouille) => (
            <div key={patrouille.id} className="panel-soft p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">🚔</span>
                  <div>
                    <h3 className="font-bold text-ink">
                      {patrouille.secteur} - {patrouille.type}
                    </h3>
                    <p className="text-sm text-muted">
                      {patrouille.agent} {patrouille.coequipier && `+ ${patrouille.coequipier}`} · {patrouille.vehicule}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${patrouille.active ? 'bg-success/20 text-success' : 'bg-muted text-muted'}`}>
                    {patrouille.active ? 'En cours' : 'Terminée'}
                  </span>
                  {patrouille.active && (
                    <button
                      onClick={() => handleEndPatrouille(patrouille.id)}
                      className="text-sm text-muted hover:text-primary"
                    >
                      Terminer
                    </button>
                  )}
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 mb-4">
                <div>
                  <p className="text-xs text-muted">Début</p>
                  <p className="font-semibold text-ink">{patrouille.debut}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Fin</p>
                  <p className="font-semibold text-ink">{patrouille.fin || "--:--"}</p>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-xs text-muted mb-2">Type de mission</p>
                <select
                  className="input-field w-full"
                  value={patrouille.type}
                  onChange={(e) => handleUpdateType(patrouille.id, e.target.value)}
                  disabled={!patrouille.active}
                >
                  <option>Patrouille mobile</option>
                  <option>Intervention</option>
                  <option>Escorte</option>
                  <option>Événement</option>
                </select>
              </div>
              <div>
                <p className="text-xs text-muted mb-2">Observations</p>
                <p className="text-sm text-ink">{patrouille.observations}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-xl font-bold text-ink">Historique des patrouilles</h2>
        <div className="panel-soft p-6">
          <p className="text-muted text-center">Aucune patrouille terminée pour le moment</p>
        </div>
      </section>
    </div>
  );
}
