"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";

interface Detenu {
  id: string;
  firstname: string;
  lastname: string;
  enteredAt: string;
  detentionTime: number;
  reason: string;
  agent: {
    firstname: string;
    lastname: string;
  };
  releasedAt: string | null;
}

export default function DetenusPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [detenus, setDetenus] = useState<Detenu[]>([]);
  const [loading, setLoading] = useState(true);

  const [newDetenu, setNewDetenu] = useState({
    nom: "",
    prenom: "",
    tempsDetention: 30,
    motif: "",
  });

  const handleTempsDetentionChange = (value: string) => {
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 1) {
      setNewDetenu({ ...newDetenu, tempsDetention: 1 });
    } else if (numValue > 120) {
      setNewDetenu({ ...newDetenu, tempsDetention: 120 });
    } else {
      setNewDetenu({ ...newDetenu, tempsDetention: numValue });
    }
  };

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

  // Calcul du temps restant
  const calculateTempsRestant = (enteredAt: string, detentionTime: number) => {
    const entree = new Date(enteredAt);
    const fin = new Date(entree.getTime() + detentionTime * 60000);
    const maintenant = new Date();
    const diff = fin.getTime() - maintenant.getTime();
    
    if (diff <= 0) return 0;
    return Math.floor(diff / 60000);
  };

  const formatHeure = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  };

  const handleAddDetenu = async () => {
    try {
      const response = await fetch('/api/security/detainees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstname: newDetenu.prenom,
          lastname: newDetenu.nom,
          detentionTime: newDetenu.tempsDetention,
          reason: newDetenu.motif,
        }),
      });
      if (response.ok) {
        await loadDetenus();
        setNewDetenu({
          nom: "",
          prenom: "",
          tempsDetention: 30,
          motif: "",
        });
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Erreur lors de l&apos;ajout du détenu:', error);
    }
  };

  const handleReleaseDetenu = async (id: string) => {
    try {
      const response = await fetch(`/api/security/detainees/${id}`, {
        method: 'PATCH',
      });
      if (response.ok) {
        await loadDetenus();
      }
    } catch (error) {
      console.error('Erreur lors de la libération du détenu:', error);
    }
  };

  // Mise à jour automatique des statuts
  useEffect(() => {
    const interval = setInterval(() => {
      setDetenus(
        detenus.map((d) => {
          calculateTempsRestant(d.enteredAt, d.detentionTime);
          return {
            ...d,
          };
        })
      );
    }, 60000); // Mise à jour chaque minute

    return () => clearInterval(interval);
  }, [detenus]);

  return (
    <div className="page-enter compact-layout">
      <PageHeader
        title="Personnes détenues"
        subtitle="Gestion des personnes placées en cellule"
      />

      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-ink">Personnes en cellule</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-primary"
          >
            {showAddForm ? "Annuler" : "Ajouter une personne"}
          </button>
        </div>

        {showAddForm && (
          <div className="panel-soft p-6 mb-6">
            <h3 className="mb-4 font-bold text-ink">Nouvelle personne détenue</h3>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="label-caps block mb-2">Nom</label>
                  <input
                    type="text"
                    className="input-field w-full"
                    placeholder="Nom"
                    value={newDetenu.nom}
                    onChange={(e) => setNewDetenu({ ...newDetenu, nom: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label-caps block mb-2">Prénom</label>
                  <input
                    type="text"
                    className="input-field w-full"
                    placeholder="Prénom"
                    value={newDetenu.prenom}
                    onChange={(e) => setNewDetenu({ ...newDetenu, prenom: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="label-caps block mb-2">Temps de détention (minutes, max 120)</label>
                <input
                  type="number"
                  className="input-field w-full"
                  min="1"
                  max="120"
                  value={newDetenu.tempsDetention}
                  onChange={(e) => handleTempsDetentionChange(e.target.value)}
                />
              </div>
              <div>
                <label className="label-caps block mb-2">Motif</label>
                <textarea
                  className="input-field w-full min-h-[80px]"
                  placeholder="Motif de la détention..."
                  value={newDetenu.motif}
                  onChange={(e) => setNewDetenu({ ...newDetenu, motif: e.target.value })}
                />
              </div>
              <button onClick={handleAddDetenu} className="btn-primary w-full">
                Ajouter la personne
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-line/70">
                <th className="text-left p-3 text-sm font-semibold text-ink">Nom</th>
                <th className="text-left p-3 text-sm font-semibold text-ink">Prénom</th>
                <th className="text-left p-3 text-sm font-semibold text-ink">Heure d&apos;entrée</th>
                <th className="text-left p-3 text-sm font-semibold text-ink">Temps détention</th>
                <th className="text-left p-3 text-sm font-semibold text-ink">Temps restant</th>
                <th className="text-left p-3 text-sm font-semibold text-ink">Motif</th>
                <th className="text-left p-3 text-sm font-semibold text-ink">Agent responsable</th>
                <th className="text-left p-3 text-sm font-semibold text-ink">Statut</th>
                <th className="text-left p-3 text-sm font-semibold text-ink">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="p-3 text-center text-muted">Chargement...</td>
                </tr>
              ) : detenus.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-3 text-center text-muted">Aucun détenu</td>
                </tr>
              ) : (
                detenus.map((detenu) => {
                  const tempsRestant = calculateTempsRestant(detenu.enteredAt, detenu.detentionTime);
                  return (
                    <tr key={detenu.id} className="border-b border-line/70">
                      <td className="p-3 text-sm text-ink">{detenu.lastname}</td>
                      <td className="p-3 text-sm text-ink">{detenu.firstname}</td>
                      <td className="p-3 text-sm text-ink">{formatHeure(detenu.enteredAt)}</td>
                      <td className="p-3 text-sm text-ink">{detenu.detentionTime} min</td>
                      <td className="p-3 text-sm text-ink">{tempsRestant} min</td>
                      <td className="p-3 text-sm text-ink">{detenu.reason}</td>
                      <td className="p-3 text-sm text-ink">{detenu.agent?.firstname} {detenu.agent?.lastname}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${tempsRestant <= 0 ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>
                          {tempsRestant <= 0 ? '🟢 Libérable' : '⚠️ En détention'}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleReleaseDetenu(detenu.id)}
                          className="text-sm text-muted hover:text-primary"
                        >
                          Libérer
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-xl font-bold text-ink">Historique complet</h2>
        <div className="panel-soft p-6">
          <p className="text-muted text-center">Fonctionnalité à venir</p>
        </div>
      </section>
    </div>
  );
}
