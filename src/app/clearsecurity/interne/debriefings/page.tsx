"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";

export default function DebriefingsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [debriefings, setDebriefings] = useState([
    {
      id: 1,
      titre: "Intervention Centre-ville",
      date: "2024-01-15",
      lieu: "Centre-ville",
      agentsPresents: ["Jean Dupont", "Marie Martin"],
      typeIntervention: "Intervention",
      resume: "Intervention suite à signalement de trouble",
      deroulement: "Arrivée sur place à 14h30. Situation calme après intervention verbale.",
      resultat: "Situation résolue sans incident",
      incidents: "Aucun",
      observations: "Intervention bien gérée",
      auteur: "Jean Dupont",
    },
  ]);

  const [newDebriefing, setNewDebriefing] = useState({
    titre: "",
    date: new Date().toISOString().split('T')[0],
    lieu: "",
    agentsPresents: "",
    typeIntervention: "Intervention",
    resume: "",
    deroulement: "",
    resultat: "",
    incidents: "",
    observations: "",
  });

  const handleCreateDebriefing = () => {
    const debriefing = {
      id: debriefings.length + 1,
      titre: newDebriefing.titre,
      date: newDebriefing.date,
      lieu: newDebriefing.lieu,
      agentsPresents: newDebriefing.agentsPresents.split(',').map(a => a.trim()),
      typeIntervention: newDebriefing.typeIntervention,
      resume: newDebriefing.resume,
      deroulement: newDebriefing.deroulement,
      resultat: newDebriefing.resultat,
      incidents: newDebriefing.incidents,
      observations: newDebriefing.observations,
      auteur: "Jean Dupont", // TODO: Récupérer l'agent connecté
    };
    setDebriefings([...debriefings, debriefing]);
    setNewDebriefing({
      titre: "",
      date: new Date().toISOString().split('T')[0],
      lieu: "",
      agentsPresents: "",
      typeIntervention: "Intervention",
      resume: "",
      deroulement: "",
      resultat: "",
      incidents: "",
      observations: "",
    });
    setShowCreateForm(false);
  };

  return (
    <div className="page-enter mx-auto max-w-6xl px-4">
      <PageHeader
        title="Débriefings"
        subtitle="Compte-rendus d&apos;intervention et rapports de mission"
      />

      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-ink">Débriefings récents</h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn-primary"
          >
            {showCreateForm ? "Annuler" : "Nouveau débriefing"}
          </button>
        </div>

        {showCreateForm && (
          <div className="panel-soft p-6 mb-6">
            <h3 className="mb-4 font-bold text-ink">Nouveau débriefing</h3>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="label-caps block mb-2">Titre</label>
                  <input
                    type="text"
                    className="input-field w-full"
                    placeholder="Titre du rapport"
                    value={newDebriefing.titre}
                    onChange={(e) => setNewDebriefing({ ...newDebriefing, titre: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label-caps block mb-2">Date</label>
                  <input
                    type="date"
                    className="input-field w-full"
                    value={newDebriefing.date}
                    onChange={(e) => setNewDebriefing({ ...newDebriefing, date: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="label-caps block mb-2">Lieu</label>
                <input
                  type="text"
                  className="input-field w-full"
                  placeholder="Ex: Centre-ville"
                  value={newDebriefing.lieu}
                  onChange={(e) => setNewDebriefing({ ...newDebriefing, lieu: e.target.value })}
                />
              </div>
              <div>
                <label className="label-caps block mb-2">Agents présents (séparés par des virgules)</label>
                <input
                  type="text"
                  className="input-field w-full"
                  placeholder="Ex: Jean Dupont, Marie Martin"
                  value={newDebriefing.agentsPresents}
                  onChange={(e) => setNewDebriefing({ ...newDebriefing, agentsPresents: e.target.value })}
                />
              </div>
              <div>
                <label className="label-caps block mb-2">Type d&apos;intervention</label>
                <select
                  className="input-field w-full"
                  value={newDebriefing.typeIntervention}
                  onChange={(e) => setNewDebriefing({ ...newDebriefing, typeIntervention: e.target.value })}
                >
                  <option>Intervention</option>
                  <option>Patrouille</option>
                  <option>Escorte</option>
                  <option>Événement</option>
                  <option>Surveillance</option>
                </select>
              </div>
              <div>
                <label className="label-caps block mb-2">Résumé</label>
                <textarea
                  className="input-field w-full min-h-[80px]"
                  placeholder="Résumé de l&apos;intervention..."
                  value={newDebriefing.resume}
                  onChange={(e) => setNewDebriefing({ ...newDebriefing, resume: e.target.value })}
                />
              </div>
              <div>
                <label className="label-caps block mb-2">Déroulement</label>
                <textarea
                  className="input-field w-full min-h-[120px]"
                  placeholder="Déroulement détaillé de l&apos;intervention..."
                  value={newDebriefing.deroulement}
                  onChange={(e) => setNewDebriefing({ ...newDebriefing, deroulement: e.target.value })}
                />
              </div>
              <div>
                <label className="label-caps block mb-2">Résultat</label>
                <textarea
                  className="input-field w-full min-h-[80px]"
                  placeholder="Résultat de l&apos;intervention..."
                  value={newDebriefing.resultat}
                  onChange={(e) => setNewDebriefing({ ...newDebriefing, resultat: e.target.value })}
                />
              </div>
              <div>
                <label className="label-caps block mb-2">Incidents</label>
                <textarea
                  className="input-field w-full min-h-[80px]"
                  placeholder="Incidents survenus..."
                  value={newDebriefing.incidents}
                  onChange={(e) => setNewDebriefing({ ...newDebriefing, incidents: e.target.value })}
                />
              </div>
              <div>
                <label className="label-caps block mb-2">Observations</label>
                <textarea
                  className="input-field w-full min-h-[80px]"
                  placeholder="Observations supplémentaires..."
                  value={newDebriefing.observations}
                  onChange={(e) => setNewDebriefing({ ...newDebriefing, observations: e.target.value })}
                />
              </div>
              <button onClick={handleCreateDebriefing} className="btn-primary w-full">
                Enregistrer le débriefing
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {debriefings.map((debriefing) => (
            <div key={debriefing.id} className="panel-soft p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-ink">{debriefing.titre}</h3>
                  <p className="text-sm text-muted">{debriefing.date} · {debriefing.lieu}</p>
                </div>
                <span className="text-xs text-muted">Auteur: {debriefing.auteur}</span>
              </div>
              <div className="mb-4">
                <p className="text-xs text-muted mb-2">Type: {debriefing.typeIntervention}</p>
                <p className="text-xs text-muted mb-2">Agents: {debriefing.agentsPresents.join(', ')}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-ink mb-2"><strong>Résumé:</strong> {debriefing.resume}</p>
                <p className="text-sm text-ink mb-2"><strong>Déroulement:</strong> {debriefing.deroulement}</p>
                <p className="text-sm text-ink mb-2"><strong>Résultat:</strong> {debriefing.resultat}</p>
                {debriefing.incidents && (
                  <p className="text-sm text-ink mb-2"><strong>Incidents:</strong> {debriefing.incidents}</p>
                )}
                {debriefing.observations && (
                  <p className="text-sm text-ink"><strong>Observations:</strong> {debriefing.observations}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
