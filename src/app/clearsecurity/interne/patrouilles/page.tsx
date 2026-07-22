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

  const formatDuree = (start: string, end: string | null) => {
    if (!end) return "En cours";
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins} min`;
  };

  const activePatrouilles = patrouilles.filter(p => !p.endedAt);
  const completedPatrouilles = patrouilles.filter(p => p.endedAt);

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
        ) : activePatrouilles.length === 0 ? (
          <div className="panel-soft p-6 text-center text-muted">Aucune patrouille active</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activePatrouilles.map((patrouille) => (
              <div key={patrouille.id} className="p-4 border rounded-lg bg-white border-green-400">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🚔</span>
                    <div>
                      <h3 className="font-bold text-ink text-sm">
                        {patrouille.sector}
                      </h3>
                      <p className="text-xs text-muted">
                        {patrouille.missionType}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    En cours
                  </span>
                </div>
                <div className="mb-3">
                  <p className="text-xs text-muted mb-1">Agents ({patrouille.agents.length}/{patrouille.maxAgents})</p>
                  <div className="flex flex-wrap gap-1">
                    {patrouille.agents.map((a, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                        {a.firstname} {a.lastname}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <p className="text-xs text-muted">Début</p>
                    <p className="font-medium text-ink text-sm">{formatHeure(patrouille.startedAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Véhicule</p>
                    <p className="font-medium text-ink text-sm">{patrouille.vehicle}</p>
                  </div>
                </div>
                <div className="mb-3">
                  <p className="text-xs text-muted mb-1">Type de mission</p>
                  <select
                    className="input-field w-full text-sm py-1"
                    value={patrouille.missionType}
                    onChange={(e) => handleUpdateType(patrouille.id, e.target.value)}
                  >
                    <option>Patrouille mobile</option>
                    <option>Intervention</option>
                    <option>Escorte</option>
                    <option>Événement</option>
                  </select>
                </div>
                {currentUser && currentUser.roles.includes('SECURITY') && (
                  <div className="mb-3">
                    {isInPatrouille(patrouille) ? (
                      <button
                        onClick={() => handleLeavePatrouille(patrouille.id)}
                        className="w-full px-2 py-1.5 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200 transition-colors"
                      >
                        Quitter
                      </button>
                    ) : canJoinPatrouille(patrouille) ? (
                      <button
                        onClick={() => handleJoinPatrouille(patrouille.id)}
                        className="w-full px-2 py-1.5 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200 transition-colors"
                      >
                        Rejoindre ({patrouille.agents.length}/{patrouille.maxAgents})
                      </button>
                    ) : (
                      <p className="text-xs text-muted text-center">
                        {patrouille.agents.length >= patrouille.maxAgents ? "Complète" : "-"}
                      </p>
                    )}
                  </div>
                )}
                <button
                  onClick={() => handleEndPatrouille(patrouille.id)}
                  className="w-full btn-primary text-sm py-1.5"
                >
                  Terminer
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-bold text-ink">Historique des patrouilles</h2>
        {completedPatrouilles.length === 0 ? (
          <div className="panel-soft p-6 text-center text-muted">Aucune patrouille terminée</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedPatrouilles.map((patrouille) => (
              <div key={patrouille.id} className="p-4 border rounded-lg bg-white border-gray-200 opacity-80">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🚔</span>
                    <div>
                      <h3 className="font-bold text-ink text-sm">
                        {patrouille.sector}
                      </h3>
                      <p className="text-xs text-muted">
                        {patrouille.missionType}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-muted">
                    Terminée
                  </span>
                </div>
                <div className="mb-3">
                  <p className="text-xs text-muted mb-1">Agents ({patrouille.agents.length})</p>
                  <div className="flex flex-wrap gap-1">
                    {patrouille.agents.map((a, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                        {a.firstname} {a.lastname}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <p className="text-xs text-muted">Début</p>
                    <p className="font-medium text-ink text-sm">{formatHeure(patrouille.startedAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Fin</p>
                    <p className="font-medium text-ink text-sm">{formatHeure(patrouille.endedAt)}</p>
                  </div>
                </div>
                <div className="mb-3">
                  <p className="text-xs text-muted">Durée</p>
                  <p className="font-medium text-ink text-sm">{formatDuree(patrouille.startedAt, patrouille.endedAt)}</p>
                </div>
                <div className="mb-3">
                  <p className="text-xs text-muted">Véhicule</p>
                  <p className="font-medium text-ink text-sm">{patrouille.vehicle}</p>
                </div>
                {patrouille.observations && (
                  <div className="mb-3 p-2 bg-gray-50 rounded">
                    <p className="text-xs text-muted mb-1">Observations</p>
                    <p className="text-xs text-muted">{patrouille.observations}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
