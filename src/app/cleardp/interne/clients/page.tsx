"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";

interface Client {
  id: string;
  firstname: string;
  lastname: string;
  phoneNumber: string | null;
  email: string | null;
  vehiclePlate: string;
  vehicleModel: string;
  totalRepairs: number;
  loyaltyPoints: number;
  hasDiscount: boolean;
  createdAt: string;
  updatedAt: string;
  repairs: {
    id: string;
    repairType: string;
    description: string | null;
    totalCost: number;
    status: string;
    startedAt: string;
    completedAt: string | null;
  }[];
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [viewingClient, setViewingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [newClient, setNewClient] = useState({
    firstname: "",
    lastname: "",
    email: "",
  });

  const [newRepair, setNewRepair] = useState({
    description: "",
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const response = await fetch('/api/dp/clients');
      if (response.ok) {
        const data = await response.json();
        setClients(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClient = async () => {
    try {
      const response = await fetch('/api/dp/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient),
      });
      if (response.ok) {
        await loadClients();
        setNewClient({
          firstname: "",
          lastname: "",
          email: "",
        });
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error('Erreur lors de la création du client:', error);
    }
  };

  const handleAddRepair = async () => {
    if (!viewingClient) return;
    try {
      const response = await fetch(`/api/dp/clients/${viewingClient.id}/repairs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: newRepair.description }),
      });
      if (response.ok) {
        await loadClients();
        const updatedClient = clients.find(c => c.id === viewingClient.id);
        if (updatedClient) {
          setViewingClient(updatedClient);

          // Vérifier si le nombre de réparations atteint 10 pour activer la remise
          if (updatedClient.totalRepairs % 10 === 0 && !updatedClient.hasDiscount) {
            await fetch(`/api/dp/clients/${updatedClient.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ hasDiscount: true }),
            });
            await loadClients();
            const finalClient = clients.find(c => c.id === viewingClient.id);
            if (finalClient) {
              setViewingClient(finalClient);
            }
          }
        }
        setNewRepair({ description: "" });
      }
    } catch (error) {
      console.error('Erreur lors de l&apos;ajout de la réparation:', error);
    }
  };

  const handleDeleteClient = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce dossier client ?")) {
      try {
        const response = await fetch(`/api/dp/clients/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          await loadClients();
        }
      } catch (error) {
        console.error('Erreur lors de la suppression du client:', error);
      }
    }
  };

  const handleViewClient = (client: Client) => {
    setViewingClient(client);
  };

  const handleToggleDiscount = async (id: string, hasDiscount: boolean) => {
    try {
      const response = await fetch(`/api/dp/clients/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hasDiscount: !hasDiscount }),
      });
      if (response.ok) {
        await loadClients();
      }
    } catch (error) {
      console.error('Erreur lors de la modification de la remise:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const filteredClients = clients.filter(c => {
    const searchLower = searchTerm.toLowerCase();
    return (
      c.firstname.toLowerCase().includes(searchLower) ||
      c.lastname.toLowerCase().includes(searchLower) ||
      c.vehiclePlate.toLowerCase().includes(searchLower)
    );
  });

  const getLoyaltyLevel = (points: number) => {
    if (points >= 500) return { level: "Or", color: "bg-yellow-100 text-yellow-700" };
    if (points >= 200) return { level: "Argent", color: "bg-gray-100 text-gray-700" };
    if (points >= 50) return { level: "Bronze", color: "bg-orange-100 text-orange-700" };
    return { level: "Nouveau", color: "bg-blue-100 text-blue-700" };
  };

  return (
    <div className="page-enter">
      <PageHeader
        brand="ClearDP"
        title="Clients"
        subtitle="Gestion des fiches clients et programme de fidélité"
      />

      <section className="mb-8">
        <div className="flex justify-between items-center mb-4 gap-4">
          <input
            type="text"
            className="input-field flex-1"
            placeholder="Rechercher par nom ou plaque d'immatriculation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => {
              setShowCreateForm(!showCreateForm);
              setViewingClient(null);
              setNewClient({
                firstname: "",
                lastname: "",
                email: "",
              });
            }}
            className="btn-primary"
          >
            {showCreateForm ? "Annuler" : "Nouveau client"}
          </button>
        </div>

        {showCreateForm && (
          <div className="panel-soft p-6">
            <h3 className="mb-4 font-bold text-ink">
              Nouveau dossier client
            </h3>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-muted">Prénom</label>
                  <input
                    type="text"
                    className="input-field w-full"
                    value={newClient.firstname}
                    onChange={(e) => setNewClient({ ...newClient, firstname: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-muted">Nom</label>
                  <input
                    type="text"
                    className="input-field w-full"
                    value={newClient.lastname}
                    onChange={(e) => setNewClient({ ...newClient, lastname: e.target.value })}
                  />
                </div>
              </div>
              <div className="relative">
                <label className="block mb-2 text-sm font-medium text-muted">Email</label>
                <input
                  type="email"
                  className="input-field w-full pr-24"
                  placeholder="Ex: client"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none opacity-60">
                  @a4l.fr
                </span>
              </div>
              <button
                onClick={handleCreateClient}
                className="btn-primary w-full"
              >
                Créer le dossier
              </button>
            </div>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-bold text-ink">
          Clients ({filteredClients.length})
        </h2>
        {loading ? (
          <div className="panel-soft p-6 text-center text-muted">Chargement...</div>
        ) : filteredClients.length === 0 ? (
          <div className="panel-soft p-6 text-center text-muted">
            {searchTerm ? "Aucun résultat" : "Aucun client"}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredClients.map((client) => {
              const loyalty = getLoyaltyLevel(client.loyaltyPoints);
              return (
                <div key={client.id} className="panel-soft p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-ink">
                        {client.firstname} {client.lastname}
                      </h3>
                      <p className="text-sm text-muted">
                        {client.vehiclePlate} · {client.vehicleModel}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${loyalty.color}`}>
                      {loyalty.level}
                    </span>
                  </div>
                  <div className="mb-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Points de fidélité:</span>
                      <span className="text-ink font-semibold">{client.loyaltyPoints}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Réparations:</span>
                      <span className="text-ink">{client.totalRepairs}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Client depuis:</span>
                      <span className="text-ink">{formatDate(client.createdAt)}</span>
                    </div>
                  </div>
                  {client.email && (
                    <div className="mb-4">
                      <p className="text-xs text-muted mb-1">Contact:</p>
                      <p className="text-sm text-ink">{client.email}</p>
                    </div>
                  )}
                  {client.hasDiscount && (
                    <div className="mb-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        ✓ Remise active
                      </span>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewClient(client)}
                      className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200 transition-colors"
                    >
                      Ouvrir
                    </button>
                    <button
                      onClick={() => handleDeleteClient(client.id)}
                      className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200 transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {viewingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="panel-soft max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-ink">
                Dossier client : {viewingClient.firstname} {viewingClient.lastname}
              </h2>
              <button
                onClick={() => setViewingClient(null)}
                className="text-muted hover:text-ink text-2xl"
              >
                ×
              </button>
            </div>

            <div className="mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Email:</span>
                <span className="text-ink">{viewingClient.email || "-"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Points de fidélité:</span>
                <span className="text-ink font-semibold">{viewingClient.loyaltyPoints}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Réparations:</span>
                <span className="text-ink">{viewingClient.totalRepairs}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Client depuis:</span>
                <span className="text-ink">{formatDate(viewingClient.createdAt)}</span>
              </div>
              {viewingClient.hasDiscount && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Remise:</span>
                  <span className="text-green-700 font-semibold">✓ Active</span>
                </div>
              )}
            </div>

            <div className="mb-6">
              <h3 className="mb-4 font-bold text-ink">Ajouter une réparation</h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-muted">Description de la réparation</label>
                  <textarea
                    className="input-field w-full min-h-[80px]"
                    placeholder="Ex: Remplacement plaquettes de frein avant, changement huile moteur..."
                    value={newRepair.description}
                    onChange={(e) => setNewRepair({ description: e.target.value })}
                  />
                </div>
                <button
                  onClick={handleAddRepair}
                  className="btn-primary w-full"
                >
                  Ajouter la réparation
                </button>
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-bold text-ink">Historique des réparations</h3>
              {viewingClient.repairs && viewingClient.repairs.length > 0 ? (
                <div className="space-y-3">
                  {viewingClient.repairs
                    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
                    .map((repair) => (
                      <div key={repair.id} className="p-4 bg-surface rounded border">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <p className="font-medium text-ink">{repair.repairType}</p>
                            <p className="text-sm text-muted mt-1">{repair.description || "Pas de description"}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            repair.status === "Terminé"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {repair.status}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-muted">
                          <span>Coût: {Number(repair.totalCost).toFixed(2)}€</span>
                          <span>{repair.completedAt ? formatDate(repair.completedAt) : formatDate(repair.startedAt)}</span>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="panel-soft p-4 text-center text-muted">
                  Aucune réparation enregistrée
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
