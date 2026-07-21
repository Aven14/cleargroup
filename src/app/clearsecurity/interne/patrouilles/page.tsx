"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";

interface Patrol {
  id: string;
  agentId: string;
  coequipierId: string | null;
  sector: string;
  vehicle: string;
  startedAt: string;
  endedAt: string | null;
  missionType: string;
  observations: string;
  maxAgents: number;
  agents: {
    id: string;
    firstname: string;
    lastname: string;
  }[];
  agent: {
    id: string;
    firstname: string;
    lastname: string;
  };
  coequipier: {
    id: string;
    firstname: string;
    lastname: string;
  } | null;
}

export default function PatrouillesPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [patrouilles, setPatrouilles] = useState<Patrol[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ id: string; firstname: string; lastname: string; roles: string[] } | null>(null);

  const [newPatrouille, setNewPatrouille] = useState({
    secteur: "",
    vehicule: "",
    type: "Patrouille mobile",
    observations: "",
    maxAgents: 2,
  });

  useEffect(() => {
    loadPatrouilles();
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const response = await fetch('/api/auth/user');
      if (response.ok) {
        const user = await response.json();
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l&apos;utilisateur:', error);
    }
  };

  const loadPatrouilles = async () => {
    try {
      const response = await fetch('/api/security/patrols');
      if (response.ok) {
        const data = await response.json();
        setPatrouilles(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des patrouilles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePatrouille = async () => {
    try {
      const response = await fetch('/api/security/patrols', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sector: newPatrouille.secteur,
          vehicle: newPatrouille.vehicule,
          missionType: newPatrouille.type,
          observations: newPatrouille.observations,
          maxAgents: newPatrouille.maxAgents,
        }),
      });
      if (response.ok) {
        await loadPatrouilles();
        setNewPatrouille({
          secteur: "",
          vehicule: "",
          type: "Patrouille mobile",
          observations: "",
          maxAgents: 2,
        });
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error('Erreur lors de la création de la patrouille:', error);
    }
  };

  const handleEndPatrouille = async (id: string) => {
    try {
      const response = await fetch(`/api/security/patrols/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ended: true }),
      });
      if (response.ok) {
        await loadPatrouilles();
      }
    } catch (error) {
      console.error('Erreur lors de la fin de patrouille:', error);
    }
  };

  const handleUpdateType = async (id: string, type: string) => {
    try {
      const response = await fetch(`/api/security/patrols/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ missionType: type }),
      });
      if (response.ok) {
        await loadPatrouilles();
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du type:', error);
    }
  };

  const handleJoinPatrouille = async (id: string) => {
    try {
      const response = await fetch(`/api/security/patrols/${id}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        await loadPatrouilles();
      }
    } catch (error) {
      console.error('Erreur lors du rejoindre la patrouille:', error);
    }
  };

  const handleLeavePatrouille = async (id: string) => {
    try {
      const response = await fetch(`/api/security/patrols/${id}/leave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        await loadPatrouilles();
      }
    } catch (error) {
      console.error('Erreur lors du départ de la patrouille:', error);
    }
  };

  const isInPatrouille = (patrouille: Patrol) => {
    if (!currentUser) return false;
    return patrouille.agents.some(a => a.id === currentUser.id);
  };

  const canJoinPatrouille = (patrouille: Patrol) => {
    if (!currentUser) return false;
    return !isInPatrouille(patrouille) && patrouille.agents.length < patrouille.maxAgents && !patrouille.endedAt;
  };

  const formatHeure = (dateString: string | null) => {
    if (!dateString) return "--:--";
    return new Date(dateString).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="page-enter">
      <PageHeader
        brand="ClearSecurity"
        title="Patrouilles"
        subtitle="Gestion des patrouilles et des missions en cours"
      />

      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-ink">Patrouilles actives</h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn-primary"
          >
            {showCreateForm ? "Annuler" : "Créer une patrouille"}
          </button>
        </div>

        {showCreateForm && (
          <div className="mb-4 panel-soft p-6">
            <h3 className="mb-4 font-bold text-ink">Nouvelle patrouille</h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-muted">Secteur</label>
                <input
                  type="text"
                  className="input-field w-full"
                  placeholder="Ex: Centre-ville"
                  value={newPatrouille.secteur}
                  onChange={(e) => setNewPatrouille({ ...newPatrouille, secteur: e.target.value })}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-muted">Véhicule</label>
                <input
                  type="text"
                  className="input-field w-full"
                  placeholder="Ex: SEC-001"
                  value={newPatrouille.vehicule}
                  onChange={(e) => setNewPatrouille({ ...newPatrouille, vehicule: e.target.value })}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-muted">Type de mission</label>
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
                <label className="block mb-2 text-sm font-medium text-muted">Nombre max d&apos;agents (max 8)</label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  className="input-field w-full"
                  value={newPatrouille.maxAgents}
                  onChange={(e) => setNewPatrouille({ ...newPatrouille, maxAgents: Math.min(8, Math.max(1, parseInt(e.target.value) || 1)) })}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-muted">Observations</label>
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

        {loading ? (
          <div className="panel-soft p-6 text-center text-muted">Chargement...</div>
        ) : patrouilles.length === 0 ? (
          <div className="panel-soft p-6 text-center text-muted">Aucune patrouille</div>
        ) : (
          <div className="space-y-4">
            {patrouilles.map((patrouille) => {
              const active = !patrouille.endedAt;
              return (
                <div key={patrouille.id} className={`p-6 border rounded-lg ${active ? 'bg-white border-green-400' : 'bg-white border-gray-200 opacity-60'}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">🚔</span>
                      <div>
                        <h3 className="font-bold text-ink">
                          {patrouille.sector} - {patrouille.missionType}
                        </h3>
                        <p className="text-sm text-muted">
                          {patrouille.agents.map(a => `${a.firstname} ${a.lastname}`).join(', ')} · {patrouille.vehicle}
                        </p>
                        <p className="text-xs text-muted mt-1">
                          {patrouille.agents.length}/{patrouille.maxAgents} agents
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-muted'}`}>
                        {active ? 'En cours' : 'Terminée'}
                      </span>
                      {active && (
                        <button
                          onClick={() => handleEndPatrouille(patrouille.id)}
                          className="text-sm text-muted hover:text-blue-600"
                        >
                          Terminer
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 mb-4">
                    <div>
                      <p className="text-xs text-muted">Début</p>
                      <p className="font-medium text-ink">{formatHeure(patrouille.startedAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted">Fin</p>
                      <p className="font-medium text-ink">{formatHeure(patrouille.endedAt)}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-xs text-muted mb-2">Type de mission</p>
                    <select
                      className="input-field w-full"
                      value={patrouille.missionType}
                      onChange={(e) => handleUpdateType(patrouille.id, e.target.value)}
                      disabled={!active}
                    >
                      <option>Patrouille mobile</option>
                      <option>Intervention</option>
                      <option>Escorte</option>
                      <option>Événement</option>
                    </select>
                  </div>
                  <div className="mb-4 p-4 bg-primary-light/20 rounded">
                    <p className="text-xs text-muted mb-1">Observations</p>
                    <p className="text-sm text-muted">{patrouille.observations}</p>
                  </div>
                  {active && currentUser && currentUser.roles.includes('SECURITY') && (
                    <div className="mb-4">
                      {isInPatrouille(patrouille) ? (
                        <button
                          onClick={() => handleLeavePatrouille(patrouille.id)}
                          className="w-full px-3 py-2 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200 transition-colors"
                        >
                          Quitter la patrouille
                        </button>
                      ) : canJoinPatrouille(patrouille) ? (
                        <button
                          onClick={() => handleJoinPatrouille(patrouille.id)}
                          className="w-full px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200 transition-colors"
                        >
                          Rejoindre la patrouille ({patrouille.agents.length}/{patrouille.maxAgents})
                        </button>
                      ) : (
                        <p className="text-sm text-muted text-center">
                          {patrouille.agents.length >= patrouille.maxAgents ? "Patrouille complète" : "Impossible de rejoindre"}
                        </p>
                      )}
                    </div>
                  )}
                  {active && (
                    <button
                      onClick={() => handleEndPatrouille(patrouille.id)}
                      className="w-full btn-primary"
                    >
                      Terminer la patrouille
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-bold text-ink">Historique des patrouilles</h2>
        <div className="panel-soft p-6">
          <p className="text-muted text-center">Fonctionnalité à venir</p>
        </div>
      </section>
    </div>
  );
}
