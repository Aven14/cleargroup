"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";

interface Debriefing {
  id: string;
  titre: string;
  date: string;
  lieu: string;
  typeIntervention: string;
  agentsPresents: string[];
  resume: string;
  deroulement: string;
  resultat: string;
  incidents: string;
  observations: string;
  auteur: string;
}

export default function DebriefingsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [debriefings, setDebriefings] = useState<Debriefing[]>([
    {
      id: "1",
      titre: "Patrouille centre-ville",
      date: "20/07/2026",
      lieu: "Centre-ville",
      typeIntervention: "Patrouille mobile",
      agentsPresents: ["Jean Dupont", "Marie Martin"],
      resume: "Patrouille de routine dans le centre-ville",
      deroulement: "Déroulement normal sans incident",
      resultat: "Aucune intervention requise",
      incidents: "",
      observations: "Zone calme",
      auteur: "Jean Dupont",
    },
  ]);
  const [newDebriefing, setNewDebriefing] = useState({
    titre: "",
    date: new Date().toLocaleDateString("fr-FR"),
    lieu: "",
    typeIntervention: "Patrouille mobile",
    agentsPresents: "",
    resume: "",
    deroulement: "",
    resultat: "",
    incidents: "",
    observations: "",
  });

  const handleCreateDebriefing = () => {
    const agentsArray = newDebriefing.agentsPresents.split(',').map(a => a.trim()).filter(a => a);
    const debriefing: Debriefing = {
      id: Date.now().toString(),
      titre: newDebriefing.titre,
      date: newDebriefing.date,
      lieu: newDebriefing.lieu,
      typeIntervention: newDebriefing.typeIntervention,
      agentsPresents: agentsArray,
      resume: newDebriefing.resume,
      deroulement: newDebriefing.deroulement,
      resultat: newDebriefing.resultat,
      incidents: newDebriefing.incidents,
      observations: newDebriefing.observations,
      auteur: "Agent actuel",
    };
    setDebriefings([...debriefings, debriefing]);
    setNewDebriefing({
      titre: "",
      date: new Date().toLocaleDateString("fr-FR"),
      lieu: "",
      typeIntervention: "Patrouille mobile",
      agentsPresents: "",
      resume: "",
      deroulement: "",
      resultat: "",
      incidents: "",
      observations: "",
    });
    setShowCreateForm(false);
  };

  return (
    <div className="page-enter">
      <PageHeader
        brand="ClearSecurity"
        title="Debriefings"
        subtitle="Comptes-rendus et rapports d'intervention"
      />

      <section className="mb-8">
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="btn-primary"
        >
          {showCreateForm ? "Annuler" : "Créer un debriefing"}
        </button>

        {showCreateForm && (
          <div className="mt-4 panel-soft p-6">
            <h3 className="mb-4 font-bold text-ink">Nouveau debriefing</h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-muted">Titre</label>
                <input
                  type="text"
                  className="input-field w-full"
                  placeholder="Ex: Patrouille centre-ville"
                  value={newDebriefing.titre}
                  onChange={(e) => setNewDebriefing({ ...newDebriefing, titre: e.target.value })}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-muted">Date</label>
                  <input
                    type="text"
                    className="input-field w-full"
                    value={newDebriefing.date}
                    onChange={(e) => setNewDebriefing({ ...newDebriefing, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-muted">Lieu</label>
                  <input
                    type="text"
                    className="input-field w-full"
                    placeholder="Ex: Centre-ville"
                    value={newDebriefing.lieu}
                    onChange={(e) => setNewDebriefing({ ...newDebriefing, lieu: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-muted">Type d&apos;intervention</label>
                <select
                  className="input-field w-full"
                  value={newDebriefing.typeIntervention}
                  onChange={(e) => setNewDebriefing({ ...newDebriefing, typeIntervention: e.target.value })}
                >
                  <option>Patrouille mobile</option>
                  <option>Intervention</option>
                  <option>Escorte</option>
                  <option>Événement</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-muted">Agents présents (séparés par des virgules)</label>
                <input
                  type="text"
                  className="input-field w-full"
                  placeholder="Ex: Jean Dupont, Marie Martin"
                  value={newDebriefing.agentsPresents}
                  onChange={(e) => setNewDebriefing({ ...newDebriefing, agentsPresents: e.target.value })}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-muted">Résumé</label>
                <textarea
                  className="input-field w-full min-h-[80px]"
                  placeholder="Résumé de l'intervention..."
                  value={newDebriefing.resume}
                  onChange={(e) => setNewDebriefing({ ...newDebriefing, resume: e.target.value })}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-muted">Déroulement</label>
                <textarea
                  className="input-field w-full min-h-[80px]"
                  placeholder="Déroulement de l'intervention..."
                  value={newDebriefing.deroulement}
                  onChange={(e) => setNewDebriefing({ ...newDebriefing, deroulement: e.target.value })}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-muted">Résultat</label>
                <textarea
                  className="input-field w-full min-h-[80px]"
                  placeholder="Résultat de l'intervention..."
                  value={newDebriefing.resultat}
                  onChange={(e) => setNewDebriefing({ ...newDebriefing, resultat: e.target.value })}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-muted">Incidents (optionnel)</label>
                <textarea
                  className="input-field w-full min-h-[80px]"
                  placeholder="Incidents survenus..."
                  value={newDebriefing.incidents}
                  onChange={(e) => setNewDebriefing({ ...newDebriefing, incidents: e.target.value })}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-muted">Observations (optionnel)</label>
                <textarea
                  className="input-field w-full min-h-[80px]"
                  placeholder="Observations supplémentaires..."
                  value={newDebriefing.observations}
                  onChange={(e) => setNewDebriefing({ ...newDebriefing, observations: e.target.value })}
                />
              </div>
              <button onClick={handleCreateDebriefing} className="btn-primary w-full">
                Enregistrer le debriefing
              </button>
            </div>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-bold text-ink">Debriefings récents</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {debriefings.map((debriefing) => (
            <div key={debriefing.id} className="panel-soft p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-ink">{debriefing.titre}</h3>
                  <p className="text-sm text-muted">{debriefing.date} · {debriefing.lieu}</p>
                </div>
                <span className="text-xs text-muted/70">{debriefing.auteur}</span>
              </div>
              <div className="mb-4">
                <p className="text-xs text-muted mb-2">Type: {debriefing.typeIntervention}</p>
                <p className="text-xs text-muted mb-2">Agents: {debriefing.agentsPresents.join(', ')}</p>
              </div>
              <div className="mb-4 p-4 bg-primary-light/20 rounded">
                <p className="text-sm text-muted mb-2"><strong>Résumé:</strong> {debriefing.resume}</p>
                <p className="text-sm text-muted mb-2"><strong>Déroulement:</strong> {debriefing.deroulement}</p>
                <p className="text-sm text-muted mb-2"><strong>Résultat:</strong> {debriefing.resultat}</p>
                {debriefing.incidents && (
                  <p className="text-sm text-muted mb-2"><strong>Incidents:</strong> {debriefing.incidents}</p>
                )}
                {debriefing.observations && (
                  <p className="text-sm text-muted"><strong>Observations:</strong> {debriefing.observations}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
