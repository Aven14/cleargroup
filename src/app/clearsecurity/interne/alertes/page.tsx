"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";

interface AlertResponse {
  user: {
    firstname: string;
    lastname: string;
  };
}

interface Alert {
  id: string;
  type: string;
  location: string;
  description: string;
  active: boolean;
  agentsRequested: number;
  responses: AlertResponse[];
  createdAt: string;
}

export default function AlertesPage() {
  const [alertes, setAlertes] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAlerte, setNewAlerte] = useState({
    type: "",
    location: "",
    description: "",
    agentsRequested: 2,
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
        body: JSON.stringify(newAlerte),
      });
      if (response.ok) {
        await loadAlertes();
        setNewAlerte({ type: "", location: "", description: "", agentsRequested: 2 });
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error('Erreur lors de la création de l\'alerte:', error);
    }
  };

  const handleAcceptAlerte = async (id: string) => {
    try {
      const response = await fetch(`/api/security/alerts/${id}/respond`, {
        method: 'POST',
      });
      if (response.ok) {
        await loadAlertes();
      }
    } catch (error) {
      console.error('Erreur lors de l\'acceptation de l\'alerte:', error);
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
      console.error('Erreur lors de la clôture de l\'alerte:', error);
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    return `Il y a ${Math.floor(diffHours / 24)} j`;
  };

  return (
    <div className="page-enter">
      <PageHeader
        title="Alertes"
        subtitle="Gestion des alertes de sécurité en temps réel"
      />

      <section className="mb-8">
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="btn-primary"
        >
          {showCreateForm ? "Annuler" : "Créer une alerte"}
        </button>

        {showCreateForm && (
          <div className="mt-4 p-6 bg-white border border-gray-200 rounded-lg">
            <h3 className="mb-4 font-bold text-gray-900">Nouvelle alerte</h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Type d'alerte</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Intrusion"
                  value={newAlerte.type}
                  onChange={(e) => setNewAlerte({ ...newAlerte, type: e.target.value })}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Lieu</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Entrée principale"
                  value={newAlerte.location}
                  onChange={(e) => setNewAlerte({ ...newAlerte, location: e.target.value })}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                  placeholder="Description de l'alerte..."
                  value={newAlerte.description}
                  onChange={(e) => setNewAlerte({ ...newAlerte, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Nombre d&apos;agents requis</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newAlerte.agentsRequested}
                  onChange={(e) => setNewAlerte({ ...newAlerte, agentsRequested: parseInt(e.target.value) || 2 })}
                />
              </div>
              <button onClick={handleCreateAlerte} className="btn-primary w-full">
                Créer l&apos;alerte
              </button>
            </div>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-bold text-gray-900">Alertes actives</h2>
        {loading ? (
          <div className="p-6 text-center text-gray-500 bg-white border border-gray-200 rounded-lg">Chargement...</div>
        ) : alertes.length === 0 ? (
          <div className="p-6 text-center text-gray-500 bg-white border border-gray-200 rounded-lg">Aucune alerte</div>
        ) : (
          <div className="space-y-4">
            {alertes.map((alerte) => (
              <div key={alerte.id} className={`p-6 border rounded-lg ${alerte.active ? 'bg-white border-red-400' : 'bg-white border-gray-200 opacity-60'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900">{alerte.type}</h3>
                    <p className="text-sm text-gray-500">{alerte.location}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${alerte.active ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                    {alerte.active ? 'Active' : 'Clôturée'}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-4">{alerte.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">
                    {alerte.responses.length} / {alerte.agentsRequested} agents
                  </span>
                  <span className="text-xs text-gray-400">{formatRelativeTime(alerte.createdAt)}</span>
                </div>
                {alerte.responses.length > 0 && (
                  <div className="mb-4 p-4 bg-gray-50 rounded">
                    <p className="text-xs text-gray-500 mb-2">Agents acceptés</p>
                    <div className="flex flex-wrap gap-2">
                      {alerte.responses.map((response, idx) => (
                        <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
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
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
