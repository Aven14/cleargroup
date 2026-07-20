"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";

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
  user: {
    id: string;
    firstname: string;
    lastname: string;
  };
}

interface Patrol {
  id: string;
  agentId: string;
  sector: string;
  startedAt: string;
  endedAt: string | null;
  agent: {
    firstname: string;
    lastname: string;
  };
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [patrols, setPatrols] = useState<Patrol[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Fetch users with SECURITY role
      const usersResponse = await fetch('/api/users');
      if (usersResponse.ok) {
        const users = await usersResponse.json();
        const securityAgents = users.filter((u: Agent) => u.roles.includes('SECURITY'));
        setAgents(securityAgents);
      }

      // Fetch active shifts
      const shiftsResponse = await fetch('/api/security/shifts');
      if (shiftsResponse.ok) {
        const shiftsData = await shiftsResponse.json();
        setShifts(shiftsData);
      }

      // Fetch active patrols
      const patrolsResponse = await fetch('/api/security/patrols');
      if (patrolsResponse.ok) {
        const patrolsData = await patrolsResponse.json();
        setPatrols(patrolsData);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAgentStatus = (agentId: string) => {
    const activeShift = shifts.find(s => s.userId === agentId && !s.endedAt);
    const activePatrol = patrols.find(p => p.agentId === agentId && !p.endedAt);

    if (activePatrol) return { statut: "En mission", icon: "🔵" };
    if (activeShift) return { statut: "Disponible", icon: "🟢" };
    return { statut: "Hors service", icon: "⚫" };
  };

  const getAgentShiftTime = (agentId: string) => {
    const shift = shifts.find(s => s.userId === agentId && !s.endedAt);
    if (!shift) return null;
    return new Date(shift.startedAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  };

  const getAgentPatrol = (agentId: string) => {
    const patrol = patrols.find(p => p.agentId === agentId && !p.endedAt);
    if (!patrol) return null;
    return `Patrouille ${patrol.sector}`;
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "Disponible":
        return "bg-success/20 text-success";
      case "En mission":
        return "bg-primary/20 text-primary";
      case "Hors service":
        return "bg-muted text-muted";
      default:
        return "bg-muted text-muted";
    }
  };

  return (
    <div className="page-enter">
      <PageHeader
        title="Agents"
        subtitle="Liste des agents de sécurité et leur statut en temps réel"
      />

      <section className="mb-12">
        <h2 className="mb-6 text-xl font-bold text-gray-900">Agents de sécurité</h2>
        {loading ? (
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-muted">Chargement...</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => {
              const { statut, icon } = getAgentStatus(agent.id);
              const shiftTime = getAgentShiftTime(agent.id);
              const patrol = getAgentPatrol(agent.id);
              return (
                <div key={agent.id} className="bg-white border-2 border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                      👤
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-base">{agent.firstname} {agent.lastname}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        statut === "Disponible" ? "bg-green-100 text-green-700" :
                        statut === "En mission" ? "bg-blue-100 text-blue-700" :
                        "bg-gray-100 text-gray-600"
                      }`}>
                        <span>{icon}</span>
                        {statut}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Prise de service</span>
                      <span className="font-medium text-gray-900">{shiftTime || "--:--"}</span>
                    </div>
                    {patrol && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Patrouille active</span>
                        <span className="font-medium text-gray-900">{patrol}</span>
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
        <h2 className="mb-6 text-xl font-bold text-gray-900">Statistiques</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Disponibles</p>
                <p className="mt-2 text-3xl font-extrabold text-gray-900">
                  {agents.filter(a => getAgentStatus(a.id).statut === "Disponible").length}
                </p>
              </div>
              <span className="text-2xl">🟢</span>
            </div>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">En mission</p>
                <p className="mt-2 text-3xl font-extrabold text-gray-900">
                  {agents.filter(a => getAgentStatus(a.id).statut === "En mission").length}
                </p>
              </div>
              <span className="text-2xl">🔵</span>
            </div>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Hors service</p>
                <p className="mt-2 text-3xl font-extrabold text-gray-900">
                  {agents.filter(a => getAgentStatus(a.id).statut === "Hors service").length}
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
