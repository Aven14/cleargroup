"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DPSidebar } from "@/components/cleardp/dp-sidebar";

interface Agent {
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
  vehicle: string | null;
  user: {
    id: string;
    firstname: string;
    lastname: string;
  };
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const usersResponse = await fetch('/api/users');
      if (usersResponse.ok) {
        const users = await usersResponse.json();
        const dpAgents = users.filter((u: Agent) => u.roles.includes('MECANICIEN'));
        setAgents(dpAgents);
      }

      const shiftsResponse = await fetch('/api/dp/shifts');
      if (shiftsResponse.ok) {
        const shiftsData = await shiftsResponse.json();
        setShifts(shiftsData);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAgentStatus = (agentId: string) => {
    const activeShift = shifts.find(s => s.userId === agentId && !s.endedAt);

    if (activeShift) return { statut: "En service", icon: "🟢" };
    return { statut: "Hors service", icon: "⚫" };
  };

  const getAgentShiftTime = (agentId: string) => {
    const shift = shifts.find(s => s.userId === agentId && !s.endedAt);
    if (!shift) return null;
    return new Date(shift.startedAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  };

  const getAgentVehicle = (agentId: string) => {
    const shift = shifts.find(s => s.userId === agentId && !s.endedAt);
    if (!shift) return null;
    return shift.vehicle;
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "En service":
        return "bg-green-100 text-green-700";
      case "Hors service":
        return "bg-gray-100 text-muted";
      default:
        return "bg-gray-100 text-muted";
    }
  };

  return (
    <div className="flex">
      <DPSidebar />
      <main className="flex-1 ml-56 p-6">
        <PageHeader
        brand="ClearDP"
        title="Agents"
        subtitle="Liste des mécaniciens et leur statut en temps réel"
      />

      <section className="mb-8">
        <h2 className="mb-4 text-lg font-bold text-ink">Mécaniciens</h2>
        {loading ? (
          <div className="panel-soft p-6 text-center text-muted">Chargement...</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => {
              const { statut, icon } = getAgentStatus(agent.id);
              const shiftTime = getAgentShiftTime(agent.id);
              const vehicle = getAgentVehicle(agent.id);
              return (
                <div key={agent.id} className="panel-soft p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-4xl">👷</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-ink">
                        {agent.firstname} {agent.lastname}
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
                    {vehicle && (
                      <div className="flex justify-between">
                        <p className="text-xs text-muted">Véhicule</p>
                        <p className="text-sm text-ink">{vehicle}</p>
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
        <div className="grid gap-4 md:grid-cols-2">
          <div className="panel-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">En service</p>
                <p className="mt-2 text-3xl font-extrabold text-ink">
                  {agents.filter(a => getAgentStatus(a.id).statut === "En service").length}
                </p>
              </div>
              <span className="text-2xl">🟢</span>
            </div>
          </div>
          <div className="panel-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Hors service</p>
                <p className="mt-2 text-3xl font-extrabold text-ink">
                  {agents.filter(a => getAgentStatus(a.id).statut === "Hors service").length}
                </p>
              </div>
              <span className="text-2xl">⚫</span>
            </div>
          </div>
        </div>
      </section>
      </main>
    </div>
  );
}
