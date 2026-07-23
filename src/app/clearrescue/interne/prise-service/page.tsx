"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";

interface Shift {
  id: string;
  userId: string;
  vehicle: string | null;
  startedAt: string;
  endedAt: string | null;
  user: {
    id: string;
    firstname: string;
    lastname: string;
  };
}

export default function PriseServicePage() {
  const [isInService, setIsInService] = useState(false);
  const [vehicle, setVehicle] = useState("");
  const [serviceStartTime, setServiceStartTime] = useState<Date | null>(null);
  const [currentShift, setCurrentShift] = useState<Shift | null>(null);
  const [currentUser, setCurrentUser] = useState<{ firstname: string; lastname: string } | null>(null);

  useEffect(() => {
    loadCurrentUser();
    loadCurrentShift();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const response = await fetch('/api/auth/user');
      if (response.ok) {
        const user = await response.json();
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'utilisateur:', error);
    }
  };

  const loadCurrentShift = async () => {
    try {
      const response = await fetch('/api/rescue/shifts');
      if (response.ok) {
        const shifts = await response.json();
        const activeShift = shifts.find((s: Shift) => !s.endedAt);
        if (activeShift) {
          setCurrentShift(activeShift);
          setIsInService(true);
          setServiceStartTime(new Date(activeShift.startedAt));
          setVehicle(activeShift.vehicle || "");
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement du shift:', error);
    }
  };

  const handleStartService = async () => {
    try {
      const response = await fetch('/api/rescue/shifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicle }),
      });
      if (response.ok) {
        const shift = await response.json();
        setCurrentShift(shift);
        setIsInService(true);
        setServiceStartTime(new Date(shift.startedAt));
      }
    } catch (error) {
      console.error('Erreur lors de la prise de service:', error);
    }
  };

  const handleEndService = async () => {
    if (!currentShift) return;
    try {
      const response = await fetch(`/api/rescue/shifts/${currentShift.id}`, {
        method: 'PATCH',
      });
      if (response.ok) {
        setIsInService(false);
        setServiceStartTime(null);
        setVehicle("");
        setCurrentShift(null);
      }
    } catch (error) {
      console.error('Erreur lors de la fin de service:', error);
    }
  };

  const formatTime = (date: Date | null) => {
    if (!date) return "--:--";
    return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="page-enter">
      <PageHeader
        brand="ClearRescue"
        title="Prise de service"
        subtitle="Gérez votre statut de service et vos informations de prise de poste"
      />

      <section className="mb-8">
        <div className="panel-soft p-6">
          <h2 className="mb-4 text-lg font-bold text-ink">Informations de service</h2>
          
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="label-caps block mb-2">Nom</label>
                <input 
                  type="text" 
                  className="input-field w-full"
                  value={currentUser?.lastname || ""}
                  disabled
                />
              </div>
              <div>
                <label className="label-caps block mb-2">Prénom</label>
                <input 
                  type="text" 
                  className="input-field w-full"
                  value={currentUser?.firstname || ""}
                  disabled
                />
              </div>
            </div>

            <div>
              <label className="label-caps block mb-2">Ambulance utilisée (optionnel)</label>
              <input 
                type="text" 
                className="input-field w-full"
                placeholder="Ex: AMB-001"
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
                disabled={isInService}
              />
            </div>

            <div>
              <label className="label-caps block mb-2">Heure de prise de service</label>
              <input 
                type="text" 
                className="input-field w-full"
                value={formatTime(serviceStartTime)}
                disabled
              />
            </div>

            <div className="pt-4">
              {!isInService ? (
                <button
                  onClick={handleStartService}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <span className="text-lg">🟢</span>
                  Prendre mon service
                </button>
              ) : (
                <button
                  onClick={handleEndService}
                  className="w-full rounded-md bg-red-600/90 px-4 py-2 text-sm font-semibold text-white shadow-card transition hover:bg-red-700 flex items-center justify-center gap-2"
                >
                  <span className="text-lg">🔴</span>
                  Fin de service
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {isInService && (
        <section>
          <div className="panel-soft border-accent/40 bg-accent-light/30 p-6">
            <div className="flex items-center gap-4">
              <span className="text-4xl">✅</span>
              <div>
                <h3 className="font-bold text-ink">Service en cours</h3>
                <p className="text-sm text-muted">
                  Vous êtes actuellement en service depuis {formatTime(serviceStartTime)}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
