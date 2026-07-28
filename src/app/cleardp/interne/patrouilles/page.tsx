"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";

interface Intervention {
  id: string;
  mechanicId: string;
  coequipierId: string | null;
  sector: string;
  vehicle: string;
  startedAt: string;
  endedAt: string | null;
  interventionType: string;
  observations: string;
  maxMechanics: number;
  available: boolean;
  mechanics: {
    id: string;
    firstname: string;
    lastname: string;
  }[];
  mechanic: {
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

export default function InterventionsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ id: string; firstname: string; lastname: string; roles: string[] } | null>(null);

  const [newIntervention, setNewIntervention] = useState({
    secteur: "",
    vehicule: "",
    observations: "",
    maxMechanics: 4,
  });

  useEffect(() => {
    loadInterventions();
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

  const loadInterventions = async () => {
    try {
      const response = await fetch('/api/dp/patrols');
      if (response.ok) {
        const data = await response.json();
        setInterventions(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des interventions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIntervention = async () => {
    try {
      const response = await fetch('/api/dp/patrols', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sector: newIntervention.secteur,
          vehicle: newIntervention.vehicule,
          observations: newIntervention.observations,
          maxMechanics: newIntervention.maxMechanics,
        }),
      });
      if (response.ok) {
        await loadInterventions();
        setNewIntervention({
          secteur: "",
          vehicule: "",
          observations: "",
          maxMechanics: 4,
        });
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error('Erreur lors de la création de l&apos;intervention:', error);
    }
  };

  const handleEndIntervention = async (id: string) => {
    try {
      const response = await fetch(`/api/dp/patrols/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ended: true }),
      });
      if (response.ok) {
        await loadInterventions();
      }
    } catch (error) {
      console.error('Erreur lors de la fin d&apos;intervention:', error);
    }
  };

  const handleJoinIntervention = async (id: string) => {
    try {
      const response = await fetch(`/api/dp/interventions/${id}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        await loadInterventions();
      }
    } catch (error) {
      console.error('Erreur lors du rejoindre l&apos;intervention:', error);
    }
  };

  const handleLeaveIntervention = async (id: string) => {
    try {
      const response = await fetch(`/api/dp/patrols/${id}/leave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        await loadInterventions();
      }
    } catch (error) {
      console.error('Erreur lors du départ de l&apos;intervention:', error);
    }
  };

  const handleToggleAvailable = async (id: string, available: boolean) => {
    try {
      const response = await fetch(`/api/dp/patrols/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available: !available }),
      });
      if (response.ok) {
        await loadInterventions();
      }
    } catch (error) {
      console.error('Erreur lors du changement de disponibilité:', error);
    }
  };

  const isInIntervention = (intervention: Intervention) => {
    if (!currentUser) return false;
    return intervention.mechanics.some(m => m.id === currentUser.id);
  };

  const canJoinIntervention = (intervention: Intervention) => {
    if (!currentUser) return false;
    return !isInIntervention(intervention) && intervention.mechanics.length < intervention.maxMechanics && !intervention.endedAt;
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

  const activeInterventions = interventions.filter(i => !i.endedAt);
  const completedInterventions = interventions.filter(i => i.endedAt);

  return (
    <div className="page-enter">
      <PageHeader
        brand="ClearDP"
        title="Interventions"
        subtitle="Gestion des interventions et missions en cours"
      />

      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-ink">Interventions actives</h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn-primary"
          >
            {showCreateForm ? "Annuler" : "Créer une intervention"}
          </button>
        </div>

        {showCreateForm && (
          <div className="mb-4 panel-soft p-6">
            <h3 className="mb-4 font-bold text-ink">Nouvelle intervention</h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-muted">Secteur</label>
                <input
                  type="text"
                  className="input-field w-full"
                  placeholder="Ex: Centre-ville"
                  value={newIntervention.secteur}
                  onChange={(e) => setNewIntervention({ ...newIntervention, secteur: e.target.value })}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-muted">Véhicule</label>
                <input
                  type="text"
                  className="input-field w-full"
                  placeholder="Ex: DP-001"
                  value={newIntervention.vehicule}
                  onChange={(e) => setNewIntervention({ ...newIntervention, vehicule: e.target.value })}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-muted">Nombre max de dépanneurs (max 4)</label>
                <input
                  type="number"
                  min="1"
                  max="4"
                  className="input-field w-full"
                  value={newIntervention.maxMechanics}
                  onChange={(e) => setNewIntervention({ ...newIntervention, maxMechanics: Math.min(4, Math.max(1, parseInt(e.target.value) || 1)) })}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-muted">Observations</label>
                <textarea
                  className="input-field w-full min-h-[80px]"
                  placeholder="Observations sur l&apos;intervention..."
                  value={newIntervention.observations}
                  onChange={(e) => setNewIntervention({ ...newIntervention, observations: e.target.value })}
                />
              </div>
              <button onClick={handleCreateIntervention} className="btn-primary w-full">
                Créer l&apos;intervention
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="panel-soft p-6 text-center text-muted">Chargement...</div>
        ) : activeInterventions.length === 0 ? (
          <div className="panel-soft p-6 text-center text-muted">Aucune intervention active</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeInterventions.map((intervention) => (
              <div key={intervention.id} className="p-4 border rounded-lg bg-white border-green-400">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🔧</span>
                    <div>
                      <h3 className="font-bold text-ink text-sm">
                        {intervention.sector}
                      </h3>
                      <p className="text-xs text-muted">
                        {intervention.interventionType}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    En cours
                  </span>
                </div>
                <div className="mb-3">
                  <p className="text-xs text-muted mb-1">Dépanneurs ({intervention.mechanics.length}/{intervention.maxMechanics})</p>
                  <div className="flex flex-wrap gap-1">
                    {intervention.mechanics.map((m, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                        {m.firstname} {m.lastname}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <p className="text-xs text-muted">Début</p>
                    <p className="font-medium text-ink text-sm">{formatHeure(intervention.startedAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Véhicule</p>
                    <p className="font-medium text-ink text-sm">{intervention.vehicle}</p>
                  </div>
                </div>
                <div className="mb-3">
                  <button
                    onClick={() => handleToggleAvailable(intervention.id, intervention.available)}
                    className={`w-full px-2 py-1.5 rounded text-xs font-medium transition-colors ${
                      intervention.available
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    {intervention.available ? "✓ Disponible" : "✗ Indisponible"}
                  </button>
                </div>
                {currentUser && currentUser.roles.includes('MECANICIEN') && (
                  <div className="mb-3">
                    {isInIntervention(intervention) ? (
                      <button
                        onClick={() => handleLeaveIntervention(intervention.id)}
                        className="w-full px-2 py-1.5 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200 transition-colors"
                      >
                        Quitter
                      </button>
                    ) : canJoinIntervention(intervention) ? (
                      <button
                        onClick={() => handleJoinIntervention(intervention.id)}
                        className="w-full px-2 py-1.5 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200 transition-colors"
                      >
                        Rejoindre ({intervention.mechanics.length}/{intervention.maxMechanics})
                      </button>
                    ) : (
                      <p className="text-xs text-muted text-center">
                        {intervention.mechanics.length >= intervention.maxMechanics ? "Complète" : "-"}
                      </p>
                    )}
                  </div>
                )}
                <button
                  onClick={() => handleEndIntervention(intervention.id)}
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
        <h2 className="mb-4 text-lg font-bold text-ink">Historique des interventions</h2>
        {completedInterventions.length === 0 ? (
          <div className="panel-soft p-6 text-center text-muted">Aucune intervention terminée</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedInterventions.map((intervention) => (
              <div key={intervention.id} className="p-4 border rounded-lg bg-white border-gray-200 opacity-80">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🔧</span>
                    <div>
                      <h3 className="font-bold text-ink text-sm">
                        {intervention.sector}
                      </h3>
                      <p className="text-xs text-muted">
                        {intervention.interventionType}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-muted">
                    Terminée
                  </span>
                </div>
                <div className="mb-3">
                  <p className="text-xs text-muted mb-1">Dépanneurs ({intervention.mechanics.length})</p>
                  <div className="flex flex-wrap gap-1">
                    {intervention.mechanics.map((m, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                        {m.firstname} {m.lastname}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <p className="text-xs text-muted">Début</p>
                    <p className="font-medium text-ink text-sm">{formatHeure(intervention.startedAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Fin</p>
                    <p className="font-medium text-ink text-sm">{formatHeure(intervention.endedAt)}</p>
                  </div>
                </div>
                <div className="mb-3">
                  <p className="text-xs text-muted">Durée</p>
                  <p className="font-medium text-ink text-sm">{formatDuree(intervention.startedAt, intervention.endedAt)}</p>
                </div>
                <div className="mb-3">
                  <p className="text-xs text-muted">Véhicule</p>
                  <p className="font-medium text-ink text-sm">{intervention.vehicle}</p>
                </div>
                {intervention.observations && (
                  <div className="mb-3 p-2 bg-gray-50 rounded">
                    <p className="text-xs text-muted mb-1">Observations</p>
                    <p className="text-xs text-muted">{intervention.observations}</p>
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
