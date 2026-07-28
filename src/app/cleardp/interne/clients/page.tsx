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
    totalCost: number;
    status: string;
    completedAt: string | null;
  }[];
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [newClient, setNewClient] = useState({
    firstname: "",
    lastname: "",
    phoneNumber: "",
    email: "",
    vehiclePlate: "",
    vehicleModel: "",
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
          phoneNumber: "",
          email: "",
          vehiclePlate: "",
          vehicleModel: "",
        });
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error('Erreur lors de la création du client:', error);
    }
  };

  const handleUpdateClient = async () => {
    if (!editingClient) return;
    try {
      const response = await fetch(`/api/dp/clients/${editingClient.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient),
      });
      if (response.ok) {
        await loadClients();
        setEditingClient(null);
        setNewClient({
          firstname: "",
          lastname: "",
          phoneNumber: "",
          email: "",
          vehiclePlate: "",
          vehicleModel: "",
        });
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du client:', error);
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

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setNewClient({
      firstname: client.firstname,
      lastname: client.lastname,
      phoneNumber: client.phoneNumber || "",
      email: client.email || "",
      vehiclePlate: client.vehiclePlate,
      vehicleModel: client.vehicleModel,
    });
    setShowCreateForm(true);
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
              setEditingClient(null);
              setNewClient({
                firstname: "",
                lastname: "",
                phoneNumber: "",
                email: "",
                vehiclePlate: "",
                vehicleModel: "",
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
              {editingClient ? "Modifier le dossier" : "Nouveau dossier client"}
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
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-muted">Téléphone</label>
                  <input
                    type="text"
                    className="input-field w-full"
                    placeholder="Ex: 06 12 34 56 78"
                    value={newClient.phoneNumber}
                    onChange={(e) => setNewClient({ ...newClient, phoneNumber: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-muted">Email</label>
                  <input
                    type="email"
                    className="input-field w-full"
                    placeholder="Ex: client@email.com"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-muted">Plaque d&apos;immatriculation</label>
                  <input
                    type="text"
                    className="input-field w-full"
                    placeholder="Ex: AA-123-BB"
                    value={newClient.vehiclePlate}
                    onChange={(e) => setNewClient({ ...newClient, vehiclePlate: e.target.value.toUpperCase() })}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-muted">Modèle de véhicule</label>
                  <input
                    type="text"
                    className="input-field w-full"
                    placeholder="Ex: Ford Mustang"
                    value={newClient.vehicleModel}
                    onChange={(e) => setNewClient({ ...newClient, vehicleModel: e.target.value })}
                  />
                </div>
              </div>
              <button
                onClick={editingClient ? handleUpdateClient : handleCreateClient}
                className="btn-primary w-full"
              >
                {editingClient ? "Mettre à jour" : "Créer le dossier"}
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
                  {client.phoneNumber && (
                    <div className="mb-4">
                      <p className="text-xs text-muted mb-1">Contact:</p>
                      <p className="text-sm text-ink">{client.phoneNumber}</p>
                      {client.email && <p className="text-sm text-muted">{client.email}</p>}
                    </div>
                  )}
                  <div className="mb-4">
                    <button
                      onClick={() => handleToggleDiscount(client.id, client.hasDiscount)}
                      className={`w-full px-3 py-2 rounded text-sm font-medium transition-colors ${
                        client.hasDiscount
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {client.hasDiscount ? "✓ Remise active" : "Activer remise"}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClient(client)}
                      className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200 transition-colors"
                    >
                      Modifier
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
    </div>
  );
}
