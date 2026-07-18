"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { getCurrentUser } from "@/lib/session";

export default function PriseServicePage() {
  const [isInService, setIsInService] = useState(false);
  const [vehicle, setVehicle] = useState("");
  const [serviceStartTime, setServiceStartTime] = useState<Date | null>(null);

  const handleStartService = () => {
    setIsInService(true);
    setServiceStartTime(new Date());
    // TODO: Enregistrer dans la base de données
  };

  const handleEndService = () => {
    setIsInService(false);
    setServiceStartTime(null);
    setVehicle("");
    // TODO: Enregistrer dans la base de données
  };

  const formatTime = (date: Date | null) => {
    if (!date) return "--:--";
    return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="page-enter">
      <PageHeader
        title="Prise de service"
        subtitle="Gérez votre statut de service et vos informations de prise de poste"
      />

      <section className="mb-12">
        <div className="panel-soft p-6">
          <h2 className="mb-6 text-lg font-bold text-ink">Informations de service</h2>
          
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="label-caps block mb-2">Nom</label>
                <input 
                  type="text" 
                  className="input-field w-full" 
                  defaultValue="Dupont"
                  disabled
                />
              </div>
              <div>
                <label className="label-caps block mb-2">Prénom</label>
                <input 
                  type="text" 
                  className="input-field w-full" 
                  defaultValue="Jean"
                  disabled
                />
              </div>
            </div>

            <div>
              <label className="label-caps block mb-2">Véhicule utilisé (optionnel)</label>
              <input 
                type="text" 
                className="input-field w-full" 
                placeholder="Ex: SEC-001"
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
                  className="w-full flex items-center justify-center gap-2 rounded-md bg-red-600/90 px-3 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-red-700"
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
          <div className="panel-soft bg-gradient-to-br from-success/10 to-success/5 p-6">
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
