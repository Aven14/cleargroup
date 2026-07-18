"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";

export default function AlertesPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [alertes, setAlertes] = useState([
    {
      id: 1,
      type: "Manque d&apos;effectif",
      lieu: "Centre-ville",
      description: "Besoin de renfort pour la surveillance du centre-ville",
      agentsDemandes: 3,
      agentsAcceptes: ["Jean Dupont", "Marie Martin"],
      createur: "Pierre Bernard",
      active: true,
    },
  ]);

  const [newAlerte, setNewAlerte] = useState({
    type: "Intervention urgente",
    lieu: "",
    description: "",
    agentsDemandes: 1,
  });

  const handleCreateAlerte = () => {
    const alerte = {
      id: alertes.length + 1,
      type: newAlerte.type,
      lieu: newAlerte.lieu,
      description: newAlerte.description,
      agentsDemandes: newAlerte.agentsDemandes,
      agentsAcceptes: [],
      createur: "Jean Dupont", // TODO: Récupérer l'agent connecté
      active: true,
    };
    setAlertes([...alertes, alerte]);
    setNewAlerte({
      type: "Intervention urgente",
      lieu: "",
      description: "",
      agentsDemandes: 1,
    });
    setShowCreateForm(false);
  };

  const handleAcceptAlerte = (id: number) => {
    setAlertes(
      alertes.map((a) =>
        a.id === id
          ? { ...a, agentsAcceptes: [...a.agentsAcceptes, "Jean Dupont"] }
          : a
      )
    );
  };

  const handleCloseAlerte = (id: number) => {
    setAlertes(alertes.map((a) => (a.id === id ? { ...a, active: false } : a)));
  };

  return (
    <div className="page-enter">
      <PageHeader
        title="Alertes"
        subtitle="Système de demande de renfort et gestion des urgences"
      />

      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-ink">Alertes actives</h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn-primary flex items-center gap-2"
          >
            <span className="text-lg">🚨</span>
            Besoin de renfort
          </button>
        </div>

        {showCreateForm && (
          <div className="panel-soft p-6 mb-6">
            <h3 className="mb-4 font-bold text-ink">Nouvelle alerte</h3>
            <div className="space-y-4">
              <div>
                <label className="label-caps block mb-2">Type d&apos;alerte</label>
                <select
                  className="input-field w-full"
                  value={newAlerte.type}
                  onChange={(e) => setNewAlerte({ ...newAlerte, type: e.target.value })}
                >
                  <option>Intervention urgente</option>
                  <option>Escorte</option>
                  <option>Événement</option>
                  <option>Manque d&apos;effectif</option>
                </select>
              </div>
              <div>
                <label className="label-caps block mb-2">Lieu</label>
                <input
                  type="text"
                  className="input-field w-full"
                  placeholder="Ex: Centre-ville"
                  value={newAlerte.lieu}
                  onChange={(e) => setNewAlerte({ ...newAlerte, lieu: e.target.value })}
                />
              </div>
              <div>
                <label className="label-caps block mb-2">Description</label>
                <textarea
                  className="input-field w-full min-h-[80px]"
                  placeholder="Description de la situation..."
                  value={newAlerte.description}
                  onChange={(e) => setNewAlerte({ ...newAlerte, description: e.target.value })}
                />
              </div>
              <div>
                <label className="label-caps block mb-2">Nombre d&apos;agents souhaités</label>
                <input
                  type="number"
                  className="input-field w-full"
                  min="1"
                  value={newAlerte.agentsDemandes}
                  onChange={(e) => setNewAlerte({ ...newAlerte, agentsDemandes: parseInt(e.target.value) })}
                />
              </div>
              <button onClick={handleCreateAlerte} className="btn-primary w-full">
                Créer l&apos;alerte
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {alertes.map((alerte) => (
            <div key={alerte.id} className={`panel-soft p-6 w-full ${alerte.active ? 'border-l-4 border-accent' : 'opacity-50'}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">🚨</span>
                  <div>
                    <h3 className="font-bold text-ink">{alerte.type}</h3>
                    <p className="text-sm text-muted">{alerte.lieu}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${alerte.active ? 'bg-accent/20 text-accent' : 'bg-muted text-muted'}`}>
                    {alerte.active ? 'Active' : 'Clôturée'}
                  </span>
                  {alerte.active && (
                    <button
                      onClick={() => handleCloseAlerte(alerte.id)}
                      className="text-sm text-muted hover:text-primary"
                    >
                      Clôturer
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm text-ink mb-4">{alerte.description}</p>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted">
                  {alerte.agentsAcceptes.length} / {alerte.agentsDemandes} agents acceptés
                </p>
                <p className="text-xs text-muted">Créée par {alerte.createur}</p>
              </div>
              {alerte.agentsAcceptes.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-muted mb-2">Agents ayant accepté :</p>
                  <div className="flex flex-wrap gap-2">
                    {alerte.agentsAcceptes.map((agent, idx) => (
                      <span key={idx} className="px-2 py-1 bg-success/20 text-success rounded text-xs">
                        {agent}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {alerte.active && alerte.agentsAcceptes.length < alerte.agentsDemandes && (
                <button
                  onClick={() => handleAcceptAlerte(alerte.id)}
                  className="btn-primary w-full"
                >
                  Accepter cette alerte
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-xl font-bold text-ink">Historique des alertes</h2>
        <div className="panel-soft p-6">
          <p className="text-muted text-center">Aucune alerte clôturée pour le moment</p>
        </div>
      </section>
    </div>
  );
}
