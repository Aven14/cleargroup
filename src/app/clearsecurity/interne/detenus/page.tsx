"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";

interface Detenu {
  id: string;
  firstname: string;
  lastname: string;
  reason: string;
  enteredAt: string;
  detentionTime: number;
  agent: {
    firstname: string;
    lastname: string;
  };
}

export default function DetenusPage() {
  const [detenus, setDetenus] = useState<Detenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDetenu, setNewDetenu] = useState({
    firstname: "",
    lastname: "",
    reason: "",
    detentionTime: 60,
  });

  useEffect(() => {
    loadDetenus();
  }, []);

  const loadDetenus = async () => {
    try {
      const response = await fetch('/api/security/detainees');
      if (response.ok) {
        const data = await response.json();
        setDetenus(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des détenus:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDetenu = async () => {
    try {
      const response = await fetch('/api/security/detainees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDetenu),
      });
      if (response.ok) {
        await loadDetenus();
        setNewDetenu({ firstname: "", lastname: "", reason: "", detentionTime: 60 });
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du détenu:', error);
    }
  };

  const handleReleaseDetenu = async (id: string) => {
    try {
      const response = await fetch(`/api/security/detainees/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await loadDetenus();
      }
    } catch (error) {
      console.error('Erreur lors de la libération du détenu:', error);
    }
  };

  const calculateTempsRestant = (enteredAt: string, detentionTime: number) => {
    const entered = new Date(enteredAt);
    const now = new Date();
    const elapsed = Math.floor((now.getTime() - entered.getTime()) / 60000);
    return Math.max(0, detentionTime - elapsed);
  };

  const formatHeure = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="page-enter">
      <PageHeader
        brand="ClearSecurity"
        title="Détenus"
        subtitle="Gestion des personnes détenues et leur temps de rétention"
      />

      <section className="mb-8">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary"
        >
          {showAddForm ? "Annuler" : "Ajouter un détenu"}
        </button>

        {showAddForm && (
          <div className="mt-4 panel-soft p-6">
            <h3 className="mb-4 font-bold text-ink">Nouveau détenu</h3>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-muted">Prénom</label>
                  <input
                    type="text"
                    className="input-field w-full"
                    value={newDetenu.firstname}
                    onChange={(e) => setNewDetenu({ ...newDetenu, firstname: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-muted">Nom</label>
                  <input
                    type="text"
                    className="input-field w-full"
                    value={newDetenu.lastname}
                    onChange={(e) => setNewDetenu({ ...newDetenu, lastname: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-muted">Motif</label>
                <textarea
                  className="input-field w-full min-h-[80px]"
                  value={newDetenu.reason}
                  onChange={(e) => setNewDetenu({ ...newDetenu, reason: e.target.value })}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-muted">Temps de détention (minutes)</label>
                <input
                  type="number"
                  className="input-field w-full"
                  value={newDetenu.detentionTime}
                  onChange={(e) => setNewDetenu({ ...newDetenu, detentionTime: parseInt(e.target.value) || 60 })}
                />
              </div>
              <button onClick={handleAddDetenu} className="btn-primary w-full">
                Enregistrer le détenu
              </button>
            </div>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-bold text-ink">Détenus actuels</h2>
        {loading ? (
          <div className="panel-soft p-6 text-center text-muted">Chargement...</div>
        ) : detenus.length === 0 ? (
          <div className="panel-soft p-6 text-center text-muted">Aucun détenu</div>
        ) : (
          <div className="space-y-4">
            {detenus.map((detenu) => {
              const tempsRestant = calculateTempsRestant(detenu.enteredAt, detenu.detentionTime);
              return (
                <div key={detenu.id} className="panel-soft p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-ink">{detenu.firstname} {detenu.lastname}</h3>
                      <p className="text-sm text-muted">Agent: {detenu.agent?.firstname} {detenu.agent?.lastname}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${tempsRestant <= 0 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {tempsRestant <= 0 ? 'Libérable' : 'En détention'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted">Entrée</p>
                      <p className="font-medium text-ink">{formatHeure(detenu.enteredAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted">Durée</p>
                      <p className="font-medium text-ink">{detenu.detentionTime} min</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted">Restant</p>
                      <p className={`font-medium ${tempsRestant <= 0 ? 'text-green-600' : 'text-orange-600'}`}>{tempsRestant} min</p>
                    </div>
                  </div>
                  <div className="mb-4 p-4 bg-primary-light/20 rounded">
                    <p className="text-xs text-muted mb-1">Motif</p>
                    <p className="text-sm text-muted">{detenu.reason}</p>
                  </div>
                  {tempsRestant <= 0 && (
                    <button
                      onClick={() => handleReleaseDetenu(detenu.id)}
                      className="btn-primary"
                    >
                      Libérer
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
