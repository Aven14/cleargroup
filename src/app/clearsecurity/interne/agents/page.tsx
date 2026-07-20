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
        <h2 className="mb-6 text-xl font-bold text-ink">Agents de sécurité</h2>
        {loading ? (
          <div className="panel-soft p-6 text-center text-muted">Chargement...</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => {
              const { statut, icon } = getAgentStatus(agent.id);
              const shiftTime = getAgentShiftTime(agent.id);
              const patrol = getAgentPatrol(agent.id);
              return (
                <div key={agent.id} className="panel-soft p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-4xl">👤</span>
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
                    {patrol && (
                      <div className="flex justify-between">
                        <p className="text-xs text-muted">Patrouille active</p>
                        <p className="text-sm text-ink">{patrol}</p>
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
        <h2 className="mb-6 text-xl font-bold text-ink">Statistiques</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="panel-soft bg-gradient-to-br from-success/10 to-success/5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Disponibles</p>
                <p className="mt-2 text-3xl font-extrabold text-ink">
                  {agents.filter(a => getAgentStatus(a.id).statut === "Disponible").length}
                </p>
              </div>
              <span className="text-2xl">🟢</span>
            </div>
          </div>
          <div className="panel-soft bg-gradient-to-br from-primary/10 to-primary/5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">En mission</p>
                <p className="mt-2 text-3xl font-extrabold text-ink">
                  {agents.filter(a => getAgentStatus(a.id).statut === "En mission").length}
                </p>
              </div>
              <span className="text-2xl">�</span>
            </div>
          </div>
          <div className="panel-soft bg-gradient-to-br from-muted/50 to-muted/30 p-6">
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
    </div>
  );
}
