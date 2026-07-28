"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";

interface Mechanic {
  id: string;
  firstname: string;
  lastname: string;
  roles: string[];
}

interface Shift {
  id: string;
  startedAt: string;
  endedAt: string | null;
  userId: string;
  user: {
    id: string;
    firstname: string;
    lastname: string;
  };
}

interface Intervention {
  id: string;
  mechanicId: string;
  sector: string;
  startedAt: string;
  endedAt: string | null;
  mechanic: {
    firstname: string;
    lastname: string;
  };
}

export default function AgentsPage() {
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const usersResponse = await fetch('/api/users');
      if (usersResponse.ok) {
        const users = await usersResponse.json();
        const dpMechanics = users.filter((u: Mechanic) => u.roles.includes('MECANICIEN'));
        setMechanics(dpMechanics);
      }

      const shiftsResponse = await fetch('/api/dp/shifts');
      if (shiftsResponse.ok) {
        const shiftsData = await shiftsResponse.json();
        setShifts(shiftsData);
      }

      const interventionsResponse = await fetch('/api/dp/interventions');
      if (interventionsResponse.ok) {
        const interventionsData = await interventionsResponse.json();
        setInterventions(interventionsData);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des mécaniciens:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMechanicStatus = (mechanicId: string) => {
    const activeShift = shifts.find(s => s.userId === mechanicId && !s.endedAt);
    const activeIntervention = interventions.find(i => i.mechanicId === mechanicId && !i.endedAt);

    if (activeIntervention) return { statut: "En intervention", icon: "🔵" };
    if (activeShift) return { statut: "Disponible", icon: "🟢" };
    return { statut: "Hors service", icon: "⚫" };
  };

  const getMechanicShiftTime = (mechanicId: string) => {
    const shift = shifts.find(s => s.userId === mechanicId && !s.endedAt);
    if (!shift) return null;
    return new Date(shift.startedAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  };

  const getMechanicIntervention = (mechanicId: string) => {
    const intervention = interventions.find(i => i.mechanicId === mechanicId && !i.endedAt);
    if (!intervention) return null;
    return `Intervention ${intervention.sector}`;
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "Disponible":
        return "bg-green-100 text-green-700";
      case "En intervention":
        return "bg-blue-100 text-blue-700";
      case "Hors service":
        return "bg-gray-100 text-muted";
      default:
        return "bg-gray-100 text-muted";
    }
  };

  return (
    <div className="page-enter">
      <PageHeader
        brand="ClearDP"
        title="Mécaniciens"
        subtitle="Liste des mécaniciens et leur statut en temps réel"
      />

      <section className="mb-8">
        <h2 className="mb-4 text-lg font-bold text-ink">Mécaniciens ClearDP</h2>
        {loading ? (
          <div className="panel-soft p-6 text-center text-muted">Chargement...</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mechanics.map((mechanic) => {
              const { statut, icon } = getMechanicStatus(mechanic.id);
              const shiftTime = getMechanicShiftTime(mechanic.id);
              const intervention = getMechanicIntervention(mechanic.id);
              return (
                <div key={mechanic.id} className="panel-soft p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-4xl">🔧</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-ink">
                        {mechanic.firstname} {mechanic.lastname}
                      </h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getStatutColor(statut)}`}>
                        <span>{icon}</span>
                        {statut}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-xs text-muted">Prise de service</p>
                      <p className="text-sm text-ink">{shiftTime || "--:--"}</p>
                    </div>
                    {intervention && (
                      <div className="flex justify-between">
                        <p className="text-xs text-muted">Intervention active</p>
                        <p className="text-sm text-ink">{intervention}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-bold text-ink">Statistiques</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="panel-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Disponibles</p>
                <p className="mt-2 text-3xl font-extrabold text-ink">
                  {mechanics.filter(m => getMechanicStatus(m.id).statut === "Disponible").length}
                </p>
              </div>
              <span className="text-2xl">🟢</span>
            </div>
          </div>
          <div className="panel-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">En intervention</p>
                <p className="mt-2 text-3xl font-extrabold text-ink">
                  {mechanics.filter(m => getMechanicStatus(m.id).statut === "En intervention").length}
                </p>
              </div>
              <span className="text-2xl">🔵</span>
            </div>
          </div>
          <div className="panel-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Hors service</p>
                <p className="mt-2 text-3xl font-extrabold text-ink">
                  {mechanics.filter(m => getMechanicStatus(m.id).statut === "Hors service").length}
                </p>
              </div>
              <span className="text-2xl">⚫</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
