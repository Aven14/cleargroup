"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";

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

  const [newAlerte, setNewAlerte] = useState({
    type: "Intervention urgente",
    lieu: "",
    description: "",
    agentsDemandes: 1,
  });

  useEffect(() => {
    loadAlertes();
  }, []);

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

        <div className="grid gap-4 md:grid-cols-2">
          {loading ? (
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-muted col-span-full">Chargement...</div>
          ) : alertes.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-muted col-span-full">Aucune alerte</div>
          ) : (
            alertes.map((alerte) => (
              <div key={alerte.id} className={`bg-white border-2 rounded-lg p-5 hover:border-gray-300 transition-colors ${alerte.active ? 'border-red-400' : 'border-gray-200 opacity-60'}`}>
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${alerte.active ? 'bg-red-100' : 'bg-gray-100'}`}>
                    🚨
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-base">{alerte.type}</h3>
                    <p className="text-xs text-gray-500">{alerte.location}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${alerte.active ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                    {alerte.active ? '● Active' : '○ Clôturée'}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-4">{alerte.description}</p>
                <div className="flex items-center justify-between mb-4 text-sm">
                  <span className="text-gray-500">
                    {alerte.responses.length} / {alerte.agentsRequested} agents
                  </span>
                  <span className="text-gray-400 text-xs">{formatRelativeTime(alerte.createdAt)}</span>
                </div>
                {alerte.responses.length > 0 && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-md">
                    <p className="text-xs text-gray-500 mb-2">Agents acceptés</p>
                    <div className="flex flex-wrap gap-2">
                      {alerte.responses.map((response, idx) => (
                        <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                          {response.user?.firstname} {response.user?.lastname}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  {alerte.active && alerte.responses.length < alerte.agentsRequested && (
                    <button
                      onClick={() => handleAcceptAlerte(alerte.id)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Accepter
                    </button>
                  )}
                  {alerte.active && (
                    <button
                      onClick={() => handleCloseAlerte(alerte.id)}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Clôturer
                    </button>
                  )}
                </div>
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
