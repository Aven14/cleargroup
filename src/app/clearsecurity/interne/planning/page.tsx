"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";

interface Evenement {
  id: string;
  nom: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  lieu: string;
  description: string;
  confirmedAgents: string[];
  public: boolean;
}

interface Agent {
  id: string;
  firstname: string;
  lastname: string;
  roles: string[];
}

export default function PlanningPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [currentUser, setCurrentUser] = useState<Agent | null>(null);
  const [evenements, setEvenements] = useState<Evenement[]>([
    {
      id: "1",
      nom: "Patrouille centre-ville",
      date: new Date().toISOString().split('T')[0],
      heureDebut: "08:00",
      heureFin: "12:00",
      lieu: "Centre-ville",
      description: "Patrouille de routine dans le centre-ville",
      confirmedAgents: [],
      public: true,
    },
    {
      id: "2",
      nom: "Surveillance événement",
      date: new Date().toISOString().split('T')[0],
      heureDebut: "14:00",
      heureFin: "18:00",
      lieu: "Salle des fêtes",
      description: "Surveillance de l'événement public",
      confirmedAgents: [],
      public: false,
    },
  ]);
  const [newEvenement, setNewEvenement] = useState({
    nom: "",
    date: new Date().toISOString().split('T')[0],
    heureDebut: "",
    heureFin: "",
    lieu: "",
    description: "",
    public: false,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userResponse = await fetch('/api/auth/user');
      if (userResponse.ok) {
        const user = await userResponse.json();
        setCurrentUser(user);
      }

      const usersResponse = await fetch('/api/users');
      if (usersResponse.ok) {
        const users = await usersResponse.json();
        const securityAgents = users.filter((u: Agent) => u.roles.includes('SECURITY'));
        setAgents(securityAgents);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleCreateEvenement = () => {
    const evenement: Evenement = {
      id: Date.now().toString(),
      nom: newEvenement.nom,
      date: newEvenement.date,
      heureDebut: newEvenement.heureDebut,
      heureFin: newEvenement.heureFin,
      lieu: newEvenement.lieu,
      description: newEvenement.description,
      confirmedAgents: [],
      public: newEvenement.public,
    };
    setEvenements([...evenements, evenement]);
    setNewEvenement({
      nom: "",
      date: new Date().toISOString().split('T')[0],
      heureDebut: "",
      heureFin: "",
      lieu: "",
      description: "",
      public: false,
    });
    setShowCreateForm(false);
  };

  const handleConfirmAgent = (evenementId: string, agentName: string) => {
    setEvenements(evenements.map(e => {
      if (e.id === evenementId) {
        if (e.confirmedAgents.includes(agentName)) {
          return {
            ...e,
            confirmedAgents: e.confirmedAgents.filter(a => a !== agentName)
          };
        } else {
          return {
            ...e,
            confirmedAgents: [...e.confirmedAgents, agentName]
          };
        }
      }
      return e;
    }));
  };

  const hasEvenementOnDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    return evenements.some(e => e.date === dateString);
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

  return (
    <div className="page-enter">
      <PageHeader
        brand="ClearSecurity"
        title="Planning"
        subtitle="Gestion du planning et des événements de sécurité"
      />

      <section className="mb-8">
        <div className="panel-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <button onClick={handlePreviousMonth} className="px-4 py-2 bg-gray-100 text-muted rounded-md hover:bg-gray-200 transition-colors">
              ← Précédent
            </button>
            <h2 className="text-xl font-bold text-ink">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button onClick={handleNextMonth} className="px-4 py-2 bg-gray-100 text-muted rounded-md hover:bg-gray-200 transition-colors">
              Suivant →
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-2 mb-2">
            {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-muted">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, idx) => {
              const hasEvent = day && hasEvenementOnDate(day);
              return (
                <div
                  key={idx}
                  className={`p-2 border rounded-md text-center cursor-pointer transition-colors ${
                    day
                      ? "hover:bg-blue-50 border-gray-200"
                      : "border-transparent"
                  } ${
                    selectedDate && day && day.toDateString() === selectedDate.toDateString()
                      ? "bg-blue-100 border-blue-400"
                      : ""
                  } ${
                    hasEvent ? "bg-blue-200 border-blue-500" : ""
                  }`}
                  onClick={() => day && setSelectedDate(day)}
                >
                  {day ? day.getDate() : ""}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-ink">Événements du {formatDate(selectedDate.toISOString())}</h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn-primary"
          >
            {showCreateForm ? "Annuler" : "Créer un événement"}
          </button>
        </div>

        {showCreateForm && (
          <div className="mb-4 panel-soft p-6">
            <h3 className="mb-4 font-bold text-ink">Nouvel événement</h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-muted">Nom de l&apos;événement</label>
                <input
                  type="text"
                  className="input-field w-full"
                  placeholder="Ex: Patrouille centre-ville"
                  value={newEvenement.nom}
                  onChange={(e) => setNewEvenement({ ...newEvenement, nom: e.target.value })}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-muted">Date</label>
                  <input
                    type="date"
                    className="input-field w-full"
                    value={newEvenement.date}
                    onChange={(e) => setNewEvenement({ ...newEvenement, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-muted">Lieu</label>
                  <input
                    type="text"
                    className="input-field w-full"
                    placeholder="Ex: Centre-ville"
                    value={newEvenement.lieu}
                    onChange={(e) => setNewEvenement({ ...newEvenement, lieu: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-muted">Heure de début</label>
                  <input
                    type="time"
                    className="input-field w-full"
                    value={newEvenement.heureDebut}
                    onChange={(e) => setNewEvenement({ ...newEvenement, heureDebut: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-muted">Heure de fin</label>
                  <input
                    type="time"
                    className="input-field w-full"
                    value={newEvenement.heureFin}
                    onChange={(e) => setNewEvenement({ ...newEvenement, heureFin: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-muted">Description</label>
                <textarea
                  className="input-field w-full min-h-[80px]"
                  placeholder="Description de l&apos;événement..."
                  value={newEvenement.description}
                  onChange={(e) => setNewEvenement({ ...newEvenement, description: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="public"
                  checked={newEvenement.public}
                  onChange={(e) => setNewEvenement({ ...newEvenement, public: e.target.checked })}
                />
                <label htmlFor="public" className="text-sm text-muted">Événement public (visible par tous)</label>
              </div>
              <button onClick={handleCreateEvenement} className="btn-primary w-full">
                Créer l&apos;événement
              </button>
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {evenements
            .filter(e => new Date(e.date).toDateString() === selectedDate.toDateString())
            .sort((a, b) => a.heureDebut.localeCompare(b.heureDebut))
            .map((evenement) => (
            <div key={evenement.id} className="panel-soft p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-ink">{evenement.nom}</h3>
                  <p className="text-sm text-muted">{formatDate(evenement.date)}</p>
                </div>
                {evenement.public && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                    Public
                  </span>
                )}
              </div>
              <div className="mb-4">
                <p className="text-sm text-muted mb-2">
                  {evenement.heureDebut} - {evenement.heureFin} · {evenement.lieu}
                </p>
                <p className="text-sm text-muted">{evenement.description}</p>
              </div>
              <div>
                <p className="text-xs text-muted mb-2">Agents disponibles :</p>
                <div className="space-y-2">
                  {agents.map((agent) => {
                    const isConfirmed = evenement.confirmedAgents.includes(`${agent.firstname} ${agent.lastname}`);
                    return (
                      <div key={agent.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-ink">{agent.firstname} {agent.lastname}</span>
                        <button
                          onClick={() => handleConfirmAgent(evenement.id, `${agent.firstname} ${agent.lastname}`)}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                            isConfirmed
                              ? "bg-red-100 text-red-700 hover:bg-red-200"
                              : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                          }`}
                        >
                          {isConfirmed ? "Désassigner" : "M'assigner"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
