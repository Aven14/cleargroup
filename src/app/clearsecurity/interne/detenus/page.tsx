"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";

export default function DetenusPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [detenus, setDetenus] = useState([
    {
      id: 1,
      nom: "Smith",
      prenom: "John",
      heureEntree: "14:30",
      tempsDetention: 60,
      motif: "Trouble à l&apos;ordre public",
      agentResponsable: "Jean Dupont",
      statut: "En détention",
    },
    {
      id: 2,
      nom: "Doe",
      prenom: "Jane",
      heureEntree: "15:00",
      tempsDetention: 30,
      motif: "Refus d&apos;obtempérer",
      agentResponsable: "Marie Martin",
      statut: "Libérable",
    },
  ]);

  const [newDetenu, setNewDetenu] = useState({
    nom: "",
    prenom: "",
    tempsDetention: 30,
    motif: "",
  });

  // Calcul du temps restant
  const calculateTempsRestant = (heureEntree: string, tempsDetention: number) => {
    const [heures, minutes] = heureEntree.split(':').map(Number);
    const entree = new Date();
    entree.setHours(heures, minutes);
    
    const fin = new Date(entree.getTime() + tempsDetention * 60000);
    const maintenant = new Date();
    const diff = fin.getTime() - maintenant.getTime();
    
    if (diff <= 0) return 0;
    return Math.floor(diff / 60000);
  };

  const handleAddDetenu = () => {
    const detenu = {
      id: detenus.length + 1,
      nom: newDetenu.nom,
      prenom: newDetenu.prenom,
      heureEntree: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      tempsDetention: newDetenu.tempsDetention,
      motif: newDetenu.motif,
      agentResponsable: "Jean Dupont", // TODO: Récupérer l'agent connecté
      statut: "En détention",
    };
    setDetenus([...detenus, detenu]);
    setNewDetenu({
      nom: "",
      prenom: "",
      tempsDetention: 30,
      motif: "",
    });
    setShowAddForm(false);
  };

  const handleReleaseDetenu = (id: number) => {
    setDetenus(detenus.filter((d) => d.id !== id));
  };

  // Mise à jour automatique des statuts
  useEffect(() => {
    const interval = setInterval(() => {
      setDetenus(
        detenus.map((d) => {
          const tempsRestant = calculateTempsRestant(d.heureEntree, d.tempsDetention);
          return {
            ...d,
            statut: tempsRestant <= 0 ? "Libérable" : "En détention",
          };
        })
      );
    }, 60000); // Mise à jour chaque minute

    return () => clearInterval(interval);
  }, [detenus]);

  return (
    <div className="page-enter mx-auto max-w-6xl px-4">
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
                <label className="label-caps block mb-2">Temps de détention (minutes)</label>
                <input
                  type="number"
                  className="input-field w-full"
                  min="1"
                  value={newDetenu.tempsDetention}
                  onChange={(e) => setNewDetenu({ ...newDetenu, tempsDetention: parseInt(e.target.value) })}
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
              {detenus.map((detenu) => {
                const tempsRestant = calculateTempsRestant(detenu.heureEntree, detenu.tempsDetention);
                return (
                  <tr key={detenu.id} className="border-b border-line/70">
                    <td className="p-3 text-sm text-ink">{detenu.nom}</td>
                    <td className="p-3 text-sm text-ink">{detenu.prenom}</td>
                    <td className="p-3 text-sm text-ink">{detenu.heureEntree}</td>
                    <td className="p-3 text-sm text-ink">{detenu.tempsDetention} min</td>
                    <td className="p-3 text-sm text-ink">{tempsRestant} min</td>
                    <td className="p-3 text-sm text-ink">{detenu.motif}</td>
                    <td className="p-3 text-sm text-ink">{detenu.agentResponsable}</td>
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
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-xl font-bold text-ink">Historique complet</h2>
        <div className="panel-soft p-6">
          <p className="text-muted text-center">Aucune personne libérée pour le moment</p>
        </div>
      </section>
    </div>
  );
}
