"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";

interface Evenement {
  id: string;
  nom: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  lieu: string;
  description: string;
  agents: string[];
  public: boolean;
}

export default function PlanningPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [evenements, setEvenements] = useState<Evenement[]>([
    {
      id: "1",
      nom: "Patrouille centre-ville",
      date: new Date().toISOString().split('T')[0],
      heureDebut: "08:00",
      heureFin: "12:00",
      lieu: "Centre-ville",
      description: "Patrouille de routine dans le centre-ville",
      agents: ["Jean Dupont", "Marie Martin"],
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
      agents: ["Pierre Bernard"],
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
    agents: "",
    public: false,
  });

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
    const agentsArray = newEvenement.agents.split(',').map(a => a.trim()).filter(a => a);
    const evenement: Evenement = {
      id: Date.now().toString(),
      nom: newEvenement.nom,
      date: newEvenement.date,
      heureDebut: newEvenement.heureDebut,
      heureFin: newEvenement.heureFin,
      lieu: newEvenement.lieu,
      description: newEvenement.description,
      agents: agentsArray,
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
      agents: "",
      public: false,
    });
    setShowCreateForm(false);
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

  return (
    <div className="page-enter">
      <PageHeader
        title="Planning"
        subtitle="Gestion du planning et des événements de sécurité"
      />

      <section className="mb-8">
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <button onClick={handlePreviousMonth} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
              ← Précédent
            </button>
            <h2 className="text-xl font-bold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button onClick={handleNextMonth} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
              Suivant →
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-2 mb-2">
            {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, idx) => (
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
                }`}
                onClick={() => day && setSelectedDate(day)}
              >
                {day ? day.getDate() : ""}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">Événements du {formatDate(selectedDate.toISOString())}</h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn-primary"
          >
            {showCreateForm ? "Annuler" : "Créer un événement"}
          </button>
        </div>

        {showCreateForm && (
          <div className="mb-4 p-6 bg-white border border-gray-200 rounded-lg">
            <h3 className="mb-4 font-bold text-gray-900">Nouvel événement</h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Nom de l'événement</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Patrouille centre-ville"
                  value={newEvenement.nom}
                  onChange={(e) => setNewEvenement({ ...newEvenement, nom: e.target.value })}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newEvenement.date}
                    onChange={(e) => setNewEvenement({ ...newEvenement, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Lieu</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Centre-ville"
                    value={newEvenement.lieu}
                    onChange={(e) => setNewEvenement({ ...newEvenement, lieu: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Heure de début</label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newEvenement.heureDebut}
                    onChange={(e) => setNewEvenement({ ...newEvenement, heureDebut: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Heure de fin</label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newEvenement.heureFin}
                    onChange={(e) => setNewEvenement({ ...newEvenement, heureFin: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                  placeholder="Description de l'événement..."
                  value={newEvenement.description}
                  onChange={(e) => setNewEvenement({ ...newEvenement, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Agents (séparés par des virgules)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Jean Dupont, Marie Martin"
                  value={newEvenement.agents}
                  onChange={(e) => setNewEvenement({ ...newEvenement, agents: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="public"
                  checked={newEvenement.public}
                  onChange={(e) => setNewEvenement({ ...newEvenement, public: e.target.checked })}
                />
                <label htmlFor="public" className="text-sm text-gray-700">Événement public (visible par tous)</label>
              </div>
              <button onClick={handleCreateEvenement} className="btn-primary w-full">
                Créer l'événement
              </button>
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {evenements
            .filter(e => new Date(e.date).toDateString() === selectedDate.toDateString())
            .sort((a, b) => a.heureDebut.localeCompare(b.heureDebut))
            .map((evenement) => (
            <div key={evenement.id} className="p-6 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900">{evenement.nom}</h3>
                  <p className="text-sm text-gray-500">{formatDate(evenement.date)}</p>
                </div>
                {evenement.public && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                    Public
                  </span>
                )}
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">
                  {evenement.heureDebut} - {evenement.heureFin} · {evenement.lieu}
                </p>
                <p className="text-sm text-gray-700">{evenement.description}</p>
              </div>
              {evenement.agents.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">Agents affectés :</p>
                  <div className="flex flex-wrap gap-2">
                    {evenement.agents.map((agent, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                        {agent}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
