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

  const [newPatrouille, setNewPatrouille] = useState({
    secteur: "",
    vehicule: "",
    type: "Patrouille mobile",
    observations: "",
  });

  useEffect(() => {
    loadPatrouilles();
  }, []);

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
        }),
      });
      if (response.ok) {
        await loadPatrouilles();
        setNewPatrouille({
          secteur: "",
          vehicule: "",
          type: "Patrouille mobile",
          observations: "",
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

  const formatHeure = (dateString: string | null) => {
    if (!dateString) return "--:--";
    return new Date(dateString).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="page-enter">
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

        <div className="grid gap-4 md:grid-cols-2">
          {loading ? (
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-muted col-span-full">Chargement...</div>
          ) : patrouilles.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-muted col-span-full">Aucune patrouille</div>
          ) : (
            patrouilles.map((patrouille) => {
              const active = !patrouille.endedAt;
              const borderClass = active ? 'border-green-400' : 'border-gray-200 opacity-60';
              const bgClass = active ? 'bg-green-100' : 'bg-gray-100';
              const statusClass = active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600';
              const statusText = active ? 'En cours' : 'Terminée';
              const statusIcon = active ? '●' : '○';
              
              return (
                <div key={patrouille.id} className={`bg-white border-2 rounded-lg p-5 hover:border-gray-300 transition-colors ${borderClass}`}>
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${bgClass}`}>
                      🚔
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-base">
                        {patrouille.sector} - {patrouille.missionType}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {patrouille.agent?.firstname} {patrouille.agent?.lastname} {patrouille.coequipier && `+ ${patrouille.coequipier.firstname} ${patrouille.coequipier.lastname}`} · {patrouille.vehicle}
                      </p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${statusClass}`}>
                      {statusIcon} {statusText}
                    </span>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Début</p>
                      <p className="font-medium text-gray-900">{formatHeure(patrouille.startedAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Fin</p>
                      <p className="font-medium text-gray-900">{formatHeure(patrouille.endedAt)}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Type de mission</p>
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
                  <div className="mb-4 p-3 bg-gray-50 rounded-md">
                    <p className="text-xs text-gray-500 mb-1">Observations</p>
                    <p className="text-sm text-gray-700">{patrouille.observations}</p>
                  </div>
                  {active && (
                    <button
                      onClick={() => handleEndPatrouille(patrouille.id)}
                      className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Terminer la patrouille
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-xl font-bold text-ink">Historique des patrouilles</h2>
        <div className="panel-soft p-6">
          <p className="text-muted text-center">Fonctionnalité à venir</p>
        </div>
      </section>
    </div>
  );
}
