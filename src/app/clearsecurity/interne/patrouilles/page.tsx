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
          <h2 className="text-lg font-bold text-ink">Patrouilles actives</h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn-primary py-2 text-sm"
          >
            {showCreateForm ? "Annuler" : "Créer une patrouille"}
          </button>
        </div>

        {showCreateForm && (
          <div className="panel-soft mb-6">
            <h3 className="mb-3 font-bold text-ink text-sm">Nouvelle patrouille</h3>
            <div className="space-y-3">
              <div>
                <label className="label-caps block mb-1 text-xs">Secteur</label>
                <input
                  type="text"
                  className="input-field w-full py-2 text-sm"
                  placeholder="Ex: Centre-ville"
                  value={newPatrouille.secteur}
                  onChange={(e) => setNewPatrouille({ ...newPatrouille, secteur: e.target.value })}
                />
              </div>
              <div>
                <label className="label-caps block mb-1 text-xs">Véhicule</label>
                <input
                  type="text"
                  className="input-field w-full py-2 text-sm"
                  placeholder="Ex: SEC-001"
                  value={newPatrouille.vehicule}
                  onChange={(e) => setNewPatrouille({ ...newPatrouille, vehicule: e.target.value })}
                />
              </div>
              <div>
                <label className="label-caps block mb-1 text-xs">Type de mission</label>
                <select
                  className="input-field w-full py-2 text-sm"
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
                <label className="label-caps block mb-1 text-xs">Observations</label>
                <textarea
                  className="input-field w-full min-h-[60px] py-2 text-sm"
                  placeholder="Observations sur la mission..."
                  value={newPatrouille.observations}
                  onChange={(e) => setNewPatrouille({ ...newPatrouille, observations: e.target.value })}
                />
              </div>
              <button onClick={handleCreatePatrouille} className="btn-primary w-full py-2 text-sm">
                Créer la patrouille
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {loading ? (
            <div className="panel-soft text-center text-muted text-sm">Chargement...</div>
          ) : patrouilles.length === 0 ? (
            <div className="panel-soft text-center text-muted text-sm">Aucune patrouille</div>
          ) : (
            patrouilles.map((patrouille) => {
              const active = !patrouille.endedAt;
              return (
                <div key={patrouille.id} className="panel-soft">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🚔</span>
                      <div>
                        <h3 className="font-bold text-ink text-sm">
                          {patrouille.sector} - {patrouille.missionType}
                        </h3>
                        <p className="text-xs text-muted">
                          {patrouille.agent?.firstname} {patrouille.agent?.lastname} {patrouille.coequipier && `+ ${patrouille.coequipier.firstname} ${patrouille.coequipier.lastname}`} · {patrouille.vehicle}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${active ? 'bg-success/20 text-success' : 'bg-muted text-muted'}`}>
                        {active ? 'En cours' : 'Terminée'}
                      </span>
                      {active && (
                        <button
                          onClick={() => handleEndPatrouille(patrouille.id)}
                          className="text-xs text-muted hover:text-primary"
                        >
                          Terminer
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2 mb-3">
                    <div>
                      <p className="text-xs text-muted">Début</p>
                      <p className="font-semibold text-ink text-sm">{formatHeure(patrouille.startedAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted">Fin</p>
                      <p className="font-semibold text-ink text-sm">{formatHeure(patrouille.endedAt)}</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="text-xs text-muted mb-1">Type de mission</p>
                    <select
                      className="input-field w-full py-2 text-sm"
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
                  <div>
                    <p className="text-xs text-muted mb-1">Observations</p>
                    <p className="text-xs text-ink">{patrouille.observations}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-bold text-ink">Historique des patrouilles</h2>
        <div className="panel-soft">
          <p className="text-muted text-center text-sm">Fonctionnalité à venir</p>
        </div>
      </section>
    </div>
  );
}
