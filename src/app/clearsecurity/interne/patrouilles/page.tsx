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

      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">Patrouilles actives</h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn-primary"
          >
            {showCreateForm ? "Annuler" : "Créer une patrouille"}
          </button>
        </div>

        {showCreateForm && (
          <div className="mb-4 p-6 bg-white border border-gray-200 rounded-lg">
            <h3 className="mb-4 font-bold text-gray-900">Nouvelle patrouille</h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Secteur</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Centre-ville"
                  value={newPatrouille.secteur}
                  onChange={(e) => setNewPatrouille({ ...newPatrouille, secteur: e.target.value })}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Véhicule</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: SEC-001"
                  value={newPatrouille.vehicule}
                  onChange={(e) => setNewPatrouille({ ...newPatrouille, vehicule: e.target.value })}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Type de mission</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <label className="block mb-2 text-sm font-medium text-gray-700">Observations</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
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
          <div className="p-6 text-center text-gray-500 bg-white border border-gray-200 rounded-lg">Chargement...</div>
        ) : patrouilles.length === 0 ? (
          <div className="p-6 text-center text-gray-500 bg-white border border-gray-200 rounded-lg">Aucune patrouille</div>
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
                        <h3 className="font-bold text-gray-900">
                          {patrouille.sector} - {patrouille.missionType}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {patrouille.agent?.firstname} {patrouille.agent?.lastname} {patrouille.coequipier && `+ ${patrouille.coequipier.firstname} ${patrouille.coequipier.lastname}`} · {patrouille.vehicle}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {active ? 'En cours' : 'Terminée'}
                      </span>
                      {active && (
                        <button
                          onClick={() => handleEndPatrouille(patrouille.id)}
                          className="text-sm text-gray-500 hover:text-blue-600"
                        >
                          Terminer
                        </button>
                      )}
                    </div>
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  <div className="mb-4 p-4 bg-gray-50 rounded">
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
            })}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-bold text-gray-900">Historique des patrouilles</h2>
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <p className="text-gray-500 text-center">Fonctionnalité à venir</p>
        </div>
      </section>
    </div>
  );
}
