"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { getCurrentUser } from "@/lib/session";

interface Alert {
  id: string;
  type: string;
  location: string;
  description: string;
  agentsRequested: number;
  active: boolean;
  closedAt: string | null;
  createdAt: string;
  createdBy: {
    id: string;
    firstname: string;
    lastname: string;
  };
  responses: Array<{
    user: {
      firstname: string;
      lastname: string;
    };
  }>;
}

export default function AlertesPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [alertes, setAlertes] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [newAlerte, setNewAlerte] = useState({
    type: "Intervention urgente",
    lieu: "",
    description: "",
    agentsDemandes: 1,
  });

  useEffect(() => {
    loadCurrentUser();
    loadAlertes();
  }, []);

  const loadCurrentUser = async () => {
    const user = await getCurrentUser();
    setCurrentUser(user);
  };

  const loadAlertes = async () => {
    try {
      const response = await fetch('/api/security/alerts');
      if (response.ok) {
        const data = await response.json();
        setAlertes(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des alertes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlerte = async () => {
    try {
      const response = await fetch('/api/security/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: newAlerte.type,
          location: newAlerte.lieu,
          description: newAlerte.description,
          agentsRequested: newAlerte.agentsDemandes,
        }),
      });
      if (response.ok) {
        await loadAlertes();
        setNewAlerte({
          type: "Intervention urgente",
          lieu: "",
          description: "",
          agentsDemandes: 1,
        });
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error('Erreur lors de la création de l&apos;alerte:', error);
    }
  };

  const handleAcceptAlerte = async (id: string) => {
    try {
      const response = await fetch(`/api/security/alerts/${id}`, {
        method: 'POST',
      });
      if (response.ok) {
        await loadAlertes();
      }
    } catch (error) {
      console.error('Erreur lors de l&apos;acceptation de l&apos;alerte:', error);
    }
  };

  const handleCloseAlerte = async (id: string) => {
    try {
      const response = await fetch(`/api/security/alerts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: false }),
      });
      if (response.ok) {
        await loadAlertes();
      }
    } catch (error) {
      console.error('Erreur lors de la clôture de l&apos;alerte:', error);
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'À l&apos;instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    return `Il y a ${Math.floor(diffHours / 24)} j`;
  };

  return (
    <div className="page-enter">
      <PageHeader
        title="Alertes"
        subtitle="Système de demande de renfort et gestion des urgences"
      />

      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-ink">Alertes actives</h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn-primary flex items-center gap-2"
          >
            <span className="text-lg">🚨</span>
            Besoin de renfort
          </button>
        </div>

        {showCreateForm && (
          <div className="panel-soft p-6 mb-6">
            <h3 className="mb-4 font-bold text-ink">Nouvelle alerte</h3>
            <div className="space-y-4">
              <div>
                <label className="label-caps block mb-2">Type d&apos;alerte</label>
                <select
                  className="input-field w-full"
                  value={newAlerte.type}
                  onChange={(e) => setNewAlerte({ ...newAlerte, type: e.target.value })}
                >
                  <option>Intervention urgente</option>
                  <option>Escorte</option>
                  <option>Événement</option>
                  <option>Manque d&apos;effectif</option>
                </select>
              </div>
              <div>
                <label className="label-caps block mb-2">Lieu</label>
                <input
                  type="text"
                  className="input-field w-full"
                  placeholder="Ex: Centre-ville"
                  value={newAlerte.lieu}
                  onChange={(e) => setNewAlerte({ ...newAlerte, lieu: e.target.value })}
                />
              </div>
              <div>
                <label className="label-caps block mb-2">Description</label>
                <textarea
                  className="input-field w-full min-h-[80px]"
                  placeholder="Description de la situation..."
                  value={newAlerte.description}
                  onChange={(e) => setNewAlerte({ ...newAlerte, description: e.target.value })}
                />
              </div>
              <div>
                <label className="label-caps block mb-2">Nombre d&apos;agents souhaités</label>
                <input
                  type="number"
                  className="input-field w-full"
                  min="1"
                  value={newAlerte.agentsDemandes}
                  onChange={(e) => setNewAlerte({ ...newAlerte, agentsDemandes: parseInt(e.target.value) })}
                />
              </div>
              <button onClick={handleCreateAlerte} className="btn-primary w-full">
                Créer l&apos;alerte
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {loading ? (
            <div className="panel-soft p-6 text-center text-muted">Chargement...</div>
          ) : alertes.length === 0 ? (
            <div className="panel-soft p-6 text-center text-muted">Aucune alerte</div>
          ) : (
            alertes.map((alerte) => (
              <div key={alerte.id} className={`panel-soft p-6 w-full ${alerte.active ? 'border-l-4 border-accent' : 'opacity-50'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">🚨</span>
                    <div>
                      <h3 className="font-bold text-ink">{alerte.type}</h3>
                      <p className="text-sm text-muted">{alerte.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${alerte.active ? 'bg-accent/20 text-accent' : 'bg-muted text-muted'}`}>
                      {alerte.active ? 'Active' : 'Clôturée'}
                    </span>
                    {alerte.active && (
                      <button
                        onClick={() => handleCloseAlerte(alerte.id)}
                        className="text-sm text-muted hover:text-primary"
                      >
                        Clôturer
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-ink mb-4">{alerte.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted">
                    {alerte.responses.length} / {alerte.agentsRequested} agents acceptés
                  </p>
                  <p className="text-xs text-muted">Créée par {alerte.createdBy?.firstname} {alerte.createdBy?.lastname} · {formatRelativeTime(alerte.createdAt)}</p>
                </div>
                {alerte.responses.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-muted mb-2">Agents ayant accepté :</p>
                    <div className="flex flex-wrap gap-2">
                      {alerte.responses.map((response, idx) => (
                        <span key={idx} className="px-2 py-1 bg-success/20 text-success rounded text-xs">
                          {response.user?.firstname} {response.user?.lastname}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {alerte.active && alerte.responses.length < alerte.agentsRequested && (
                  <button
                    onClick={() => handleAcceptAlerte(alerte.id)}
                    className="btn-primary w-full"
                  >
                    Accepter cette alerte
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-xl font-bold text-ink">Historique des alertes</h2>
        <div className="panel-soft p-6">
          <p className="text-muted text-center">Fonctionnalité à venir</p>
        </div>
      </section>
    </div>
  );
}
