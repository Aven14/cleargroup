"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";

export default function PlanningPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [evenements, setEvenements] = useState([
    {
      id: 1,
      nom: "Formation sécurité",
      date: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0],
      heureDebut: "09:00",
      heureFin: "17:00",
      description: "Formation obligatoire pour tous les agents",
      lieu: "Centre de formation",
      agents: ["Jean Dupont", "Marie Martin", "Pierre Bernard"],
      public: true,
    },
    {
      id: 2,
      nom: "Événement Centre-ville",
      date: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
      heureDebut: "18:00",
      heureFin: "23:00",
      description: "Surveillance événement public",
      lieu: "Centre-ville",
      agents: ["Sophie Petit"],
      public: true,
    },
  ]);

  const [newEvenement, setNewEvenement] = useState({
    nom: "",
    date: selectedDate ? selectedDate.toISOString().split('T')[0] : "",
    heureDebut: "",
    heureFin: "",
    description: "",
    lieu: "",
    agents: "",
    public: true,
  });

  useEffect(() => {
    if (selectedDate) {
      setNewEvenement(prev => ({ ...prev, date: selectedDate.toISOString().split('T')[0] }));
    }
  }, [selectedDate]);

  const handleCreateEvenement = () => {
    const evenement = {
      id: evenements.length + 1,
      nom: newEvenement.nom,
      date: newEvenement.date,
      heureDebut: newEvenement.heureDebut,
      heureFin: newEvenement.heureFin,
      description: newEvenement.description,
      lieu: newEvenement.lieu,
      agents: newEvenement.agents.split(',').map(a => a.trim()).filter(a => a),
      public: newEvenement.public,
    };
    setEvenements([...evenements, evenement]);
    setNewEvenement({
      nom: "",
      date: "",
      heureDebut: "",
      heureFin: "",
      description: "",
      lieu: "",
      agents: "",
      public: true,
    });
    setShowCreateForm(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startDayOfWeek };
  };

  const getEvenementsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return evenements.filter(e => e.date === dateStr);
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowCreateForm(true);
  };

  return (
    <div className="page-enter compact-layout">
      <PageHeader
        title="Planning"
        subtitle="Calendrier des événements et affectations des agents"
      />

      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={goToPreviousMonth}
              className="p-2 rounded-md bg-surface text-muted hover:bg-primary-light/40 transition"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-xl font-bold text-ink">
              {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </h2>
            <button
              onClick={goToNextMonth}
              className="p-2 rounded-md bg-surface text-muted hover:bg-primary-light/40 transition"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-1 rounded-md bg-surface text-sm text-muted hover:bg-primary-light/40 transition"
            >
              Aujourd&#39;hui
            </button>
          </div>
          <button
            onClick={() => {
              setSelectedDate(new Date());
              setShowCreateForm(true);
            }}
            className="btn-primary"
          >
            Nouvel événement
          </button>
        </div>

        {/* Calendrier */}
        <div className="panel-soft p-6">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day) => (
              <div key={day} className="text-center text-sm font-semibold text-muted">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {(() => {
              const { daysInMonth, startDayOfWeek } = getDaysInMonth(currentDate);
              const days = [];
              
              // Jours vides avant le premier jour du mois
              for (let i = 0; i < startDayOfWeek; i++) {
                days.push(<div key={`empty-${i}`} className="h-24" />);
              }
              
              // Jours du mois
              for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                const dayEvenements = getEvenementsForDate(date);
                const isToday = date.toDateString() === new Date().toDateString();
                const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
                
                days.push(
                  <div
                    key={day}
                    onClick={() => handleDateClick(date)}
                    className={`h-24 p-2 rounded-md cursor-pointer transition ${
                      isToday ? 'bg-primary/20 border-2 border-primary' : 
                      isSelected ? 'bg-accent/20 border-2 border-accent' : 
                      'bg-surface hover:bg-primary-light/20'
                    }`}
                  >
                    <div className="text-sm font-semibold text-ink mb-1">
                      {day}
                    </div>
                    <div className="space-y-1">
                      {dayEvenements.slice(0, 2).map((evenement) => (
                        <div
                          key={evenement.id}
                          className={`text-xs px-1 py-0.5 rounded truncate ${
                            evenement.public ? 'bg-accent/80 text-white' : 'bg-primary/80 text-white'
                          }`}
                        >
                          {evenement.nom}
                        </div>
                      ))}
                      {dayEvenements.length > 2 && (
                        <div className="text-xs text-muted">
                          +{dayEvenements.length - 2} autre{dayEvenements.length - 2 > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
              
              return days;
            })()}
          </div>
        </div>

        {showCreateForm && (
          <div className="panel-soft p-6 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-ink">
                {selectedDate ? `Nouvel événement - ${formatDate(selectedDate.toISOString().split('T')[0])}` : 'Nouvel événement'}
              </h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-muted hover:text-ink"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label-caps block mb-2">Nom de l&apos;événement</label>
                <input
                  type="text"
                  className="input-field w-full"
                  placeholder="Ex: Formation sécurité"
                  value={newEvenement.nom}
                  onChange={(e) => setNewEvenement({ ...newEvenement, nom: e.target.value })}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="label-caps block mb-2">Date</label>
                  <input
                    type="date"
                    className="input-field w-full"
                    value={newEvenement.date}
                    onChange={(e) => setNewEvenement({ ...newEvenement, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label-caps block mb-2">Lieu</label>
                  <input
                    type="text"
                    className="input-field w-full"
                    placeholder="Ex: Centre de formation"
                    value={newEvenement.lieu}
                    onChange={(e) => setNewEvenement({ ...newEvenement, lieu: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="label-caps block mb-2">Heure de début</label>
                  <input
                    type="time"
                    className="input-field w-full"
                    value={newEvenement.heureDebut}
                    onChange={(e) => setNewEvenement({ ...newEvenement, heureDebut: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label-caps block mb-2">Heure de fin</label>
                  <input
                    type="time"
                    className="input-field w-full"
                    value={newEvenement.heureFin}
                    onChange={(e) => setNewEvenement({ ...newEvenement, heureFin: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="label-caps block mb-2">Description</label>
                <textarea
                  className="input-field w-full min-h-[80px]"
                  placeholder="Description de l&apos;événement..."
                  value={newEvenement.description}
                  onChange={(e) => setNewEvenement({ ...newEvenement, description: e.target.value })}
                />
              </div>
              <div>
                <label className="label-caps block mb-2">Agents affectés (séparés par des virgules)</label>
                <input
                  type="text"
                  className="input-field w-full"
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
                <label htmlFor="public" className="text-sm text-ink">Événement public (visible par tous)</label>
              </div>
              <button onClick={handleCreateEvenement} className="btn-primary w-full">
                Créer l&apos;événement
              </button>
            </div>
          </div>
        )}

        <section>
          <h2 className="mb-6 text-xl font-bold text-ink">Événements à venir</h2>
          <div className="space-y-4">
            {evenements
              .filter(e => new Date(e.date) >= new Date(new Date().setHours(0,0,0,0)))
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map((evenement) => (
              <div key={evenement.id} className="panel-soft p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-ink">{evenement.nom}</h3>
                    <p className="text-sm text-muted">{formatDate(evenement.date)}</p>
                  </div>
                  {evenement.public && (
                    <span className="px-2 py-1 bg-accent/20 text-accent rounded text-xs font-semibold">
                      Public
                    </span>
                  )}
                </div>
                <div className="mb-4">
                  <p className="text-sm text-muted mb-2">
                    {evenement.heureDebut} - {evenement.heureFin} · {evenement.lieu}
                  </p>
                  <p className="text-sm text-ink">{evenement.description}</p>
                </div>
                {evenement.agents.length > 0 && (
                  <div>
                    <p className="text-xs text-muted mb-2">Agents affectés :</p>
                    <div className="flex flex-wrap gap-2">
                      {evenement.agents.map((agent, idx) => (
                        <span key={idx} className="px-2 py-1 bg-primary/20 text-primary rounded text-xs">
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
      </section>
    </div>
  );
}
