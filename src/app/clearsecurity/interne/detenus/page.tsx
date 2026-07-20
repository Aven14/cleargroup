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
    <div className="page-enter">
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

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-muted col-span-full">Chargement...</div>
          ) : detenus.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-muted col-span-full">Aucun détenu</div>
          ) : (
            detenus.map((detenu) => {
              const tempsRestant = calculateTempsRestant(detenu.enteredAt, detenu.detentionTime);
              return (
                <div key={detenu.id} className="bg-white border-2 border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                      👤
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-base">{detenu.firstname} {detenu.lastname}</h3>
                      <p className="text-xs text-gray-500">Agent: {detenu.agent?.firstname} {detenu.agent?.lastname}</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Entrée</span>
                      <span className="font-medium text-gray-900">{formatHeure(detenu.enteredAt)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Durée</span>
                      <span className="font-medium text-gray-900">{detenu.detentionTime} min</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Restant</span>
                      <span className={`font-medium ${tempsRestant <= 0 ? 'text-green-600' : 'text-orange-600'}`}>{tempsRestant} min</span>
                    </div>
                  </div>
                  <div className="mb-4 p-3 bg-gray-50 rounded-md">
                    <p className="text-xs text-gray-500 mb-1">Motif</p>
                    <p className="text-sm text-gray-700">{detenu.reason}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium px-2 py-1 rounded ${tempsRestant <= 0 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {tempsRestant <= 0 ? '✓ Libérable' : '⏱ En détention'}
                    </span>
                    {tempsRestant <= 0 && (
                      <button
                        onClick={() => handleReleaseDetenu(detenu.id)}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Libérer
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
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
