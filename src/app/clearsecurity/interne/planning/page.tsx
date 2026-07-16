"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";

export default function PlanningPage() {
  const [view, setView] = useState<"jour" | "semaine" | "mois">("semaine");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [evenements, setEvenements] = useState([
    {
      id: 1,
      nom: "Formation sécurité",
      date: "2024-01-20",
      heureDebut: "09:00",
      heureFin: "17:00",
      description: "Formation obligatoire pour tous les agents",
      lieu: "Centre de formation",
      agents: ["Jean Dupont", "Marie Martin", "Pierre Bernard"],
      public: true,
    },
    {
      id: 2,
      nom: "Événement Centre-ville",
      date: "2024-01-22",
      heureDebut: "18:00",
      heureFin: "23:00",
      description: "Surveillance événement public",
      lieu: "Centre-ville",
      agents: ["Sophie Petit"],
      public: true,
    },
  ]);

  const [newEvenement, setNewEvenement] = useState({
    nom: "",
    date: "",
    heureDebut: "",
    heureFin: "",
    description: "",
    lieu: "",
    agents: "",
    public: true,
  });

  const handleCreateEvenement = () => {
    const evenement = {
      id: evenements.length + 1,
      nom: newEvenement.nom,
      date: newEvenement.date,
      heureDebut: newEvenement.heureDebut,
      heureFin: newEvenement.heureFin,
      description: newEvenement.description,
      lieu: newEvenement.lieu,
      agents: newEvenement.agents.split(',').map(a => a.trim()).filter(a => a),
      public: newEvenement.public,
    };
    setEvenements([...evenements, evenement]);
    setNewEvenement({
      nom: "",
      date: "",
      heureDebut: "",
      heureFin: "",
      description: "",
      lieu: "",
      agents: "",
      public: true,
    });
    setShowCreateForm(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  return (
    <div className="page-enter mx-auto max-w-6xl px-4">
      <PageHeader
        title="Planning"
        subtitle="Calendrier des événements et affectations des agents"
      />

      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setView("jour")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${view === "jour" ? "bg-primary text-white" : "bg-surface text-muted hover:bg-primary-light/40"}`}
            >
              Jour
            </button>
            <button
              onClick={() => setView("semaine")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${view === "semaine" ? "bg-primary text-white" : "bg-surface text-muted hover:bg-primary-light/40"}`}
            >
              Semaine
            </button>
            <button
              onClick={() => setView("mois")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${view === "mois" ? "bg-primary text-white" : "bg-surface text-muted hover:bg-primary-light/40"}`}
            >
              Mois
            </button>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn-primary"
          >
            {showCreateForm ? "Annuler" : "Nouvel événement"}
          </button>
        </div>

        {showCreateForm && (
          <div className="panel-soft p-6 mb-6">
            <h3 className="mb-4 font-bold text-ink">Nouvel événement</h3>
            <div className="space-y-4">
              <div>
                <label className="label-caps block mb-2">Nom de l'événement</label>
                <input
                  type="text"
                  className="input-field w-full"
                  placeholder="Ex: Formation sécurité"
                  value={newEvenement.nom}
                  onChange={(e) => setNewEvenement({ ...newEvenement, nom: e.target.value })}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="label-caps block mb-2">Date</label>
                  <input
                    type="date"
                    className="input-field w-full"
                    value={newEvenement.date}
                    onChange={(e) => setNewEvenement({ ...newEvenement, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label-caps block mb-2">Lieu</label>
                  <input
                    type="text"
                    className="input-field w-full"
                    placeholder="Ex: Centre de formation"
                    value={newEvenement.lieu}
                    onChange={(e) => setNewEvenement({ ...newEvenement, lieu: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="label-caps block mb-2">Heure de début</label>
                  <input
                    type="time"
                    className="input-field w-full"
                    value={newEvenement.heureDebut}
                    onChange={(e) => setNewEvenement({ ...newEvenement, heureDebut: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label-caps block mb-2">Heure de fin</label>
                  <input
                    type="time"
                    className="input-field w-full"
                    value={newEvenement.heureFin}
                    onChange={(e) => setNewEvenement({ ...newEvenement, heureFin: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="label-caps block mb-2">Description</label>
                <textarea
                  className="input-field w-full min-h-[80px]"
                  placeholder="Description de l'événement..."
                  value={newEvenement.description}
                  onChange={(e) => setNewEvenement({ ...newEvenement, description: e.target.value })}
                />
              </div>
              <div>
                <label className="label-caps block mb-2">Agents affectés (séparés par des virgules)</label>
                <input
                  type="text"
                  className="input-field w-full"
                  placeholder="Ex: Jean Dupont, Marie Martin"
                  value={newEvenement.agents}
                  onChange={(e) => setNewEvenement({ ...newEvenement, agents: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="public"
                  checked={newEvenement.public}
                  onChange={(e) => setNewEvenement({ ...newEvenement, public: e.target.checked })}
                />
                <label htmlFor="public" className="text-sm text-ink">Événement public (visible par tous)</label>
              </div>
              <button onClick={handleCreateEvenement} className="btn-primary w-full">
                Créer l'événement
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {evenements.map((evenement) => (
            <div key={evenement.id} className="panel-soft p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-ink">{evenement.nom}</h3>
                  <p className="text-sm text-muted">{formatDate(evenement.date)}</p>
                </div>
                {evenement.public && (
                  <span className="px-2 py-1 bg-accent/20 text-accent rounded text-xs font-semibold">
                    Public
                  </span>
                )}
              </div>
              <div className="mb-4">
                <p className="text-sm text-muted mb-2">
                  {evenement.heureDebut} - {evenement.heureFin} · {evenement.lieu}
                </p>
                <p className="text-sm text-ink">{evenement.description}</p>
              </div>
              {evenement.agents.length > 0 && (
                <div>
                  <p className="text-xs text-muted mb-2">Agents affectés :</p>
                  <div className="flex flex-wrap gap-2">
                    {evenement.agents.map((agent, idx) => (
                      <span key={idx} className="px-2 py-1 bg-primary/20 text-primary rounded text-xs">
                        {agent}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
