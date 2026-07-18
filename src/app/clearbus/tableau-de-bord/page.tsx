"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";

interface DashboardStats {
  activeLines: number;
  activeDrivers: number;
  ticketsIssuedToday: number;
  totalPassengers: number;
  activeControllers: number;
  recentActivity: number;
}

interface Line {
  id: string;
  number: number;
  name: string;
  color: string;
  driver: string | null;
  active: boolean;
}

interface Ticket {
  id: string;
  passengerName: string;
  lineName: string;
  issuedAt: string;
}

export default function ClearBusDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentLines, setRecentLines] = useState<Line[]>([]);
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Simuler des données pour l'instant
      setStats({
        activeLines: 5,
        activeDrivers: 3,
        ticketsIssuedToday: 47,
        totalPassengers: 234,
        activeControllers: 2,
        recentActivity: 52,
      });
      setRecentLines([
        { id: "1", number: 1, name: "Ligne Centre-Ville", color: "#194A78", driver: "Jean Dupont", active: true },
        { id: "2", number: 2, name: "Ligne Nord", color: "#E63946", driver: "Marie Martin", active: true },
        { id: "3", number: 3, name: "Ligne Est", color: "#2A9D8F", driver: null, active: false },
      ]);
      setRecentTickets([
        { id: "1", passengerName: "Pierre Bernard", lineName: "Ligne Centre-Ville", issuedAt: new Date(Date.now() - 300000).toISOString() },
        { id: "2", passengerName: "Sophie Durand", lineName: "Ligne Nord", issuedAt: new Date(Date.now() - 600000).toISOString() },
        { id: "3", passengerName: "Lucas Petit", lineName: "Ligne Centre-Ville", issuedAt: new Date(Date.now() - 900000).toISOString() },
      ]);
    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'À l&apos;instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    return `Il y a ${Math.floor(diffHours / 24)} j`;
  };

  return (
    <div className="page-enter">
      <PageHeader
        title="Tableau de bord"
        subtitle="Vue d&apos;ensemble des opérations ClearBus en temps réel"
      />

      {/* Statistiques en temps réel */}
      <section className="mb-12">
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          <div className="panel-soft bg-gradient-to-br from-primary/10 to-primary/5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Lignes actives</p>
                <p className="mt-2 text-3xl font-extrabold text-ink">{loading ? '-' : stats?.activeLines || 0}</p>
              </div>
              <span className="text-2xl">🚌</span>
            </div>
          </div>

          <div className="panel-soft bg-gradient-to-br from-accent-light to-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Chauffeurs en service</p>
                <p className="mt-2 text-3xl font-extrabold text-ink">{loading ? '-' : stats?.activeDrivers || 0}</p>
              </div>
              <span className="text-2xl">🚗</span>
            </div>
          </div>

          <div className="panel-soft bg-gradient-to-br from-primary-light/80 to-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Billets aujourd&apos;hui</p>
                <p className="mt-2 text-3xl font-extrabold text-ink">{loading ? '-' : stats?.ticketsIssuedToday || 0}</p>
              </div>
              <span className="text-2xl">🎫</span>
            </div>
          </div>

          <div className="panel-soft bg-gradient-to-br from-success/10 to-success/5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Passagers</p>
                <p className="mt-2 text-3xl font-extrabold text-ink">{loading ? '-' : stats?.totalPassengers || 0}</p>
              </div>
              <span className="text-2xl">👥</span>
            </div>
          </div>

          <div className="panel-soft bg-gradient-to-br from-warning/10 to-warning/5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Contrôleurs actifs</p>
                <p className="mt-2 text-3xl font-extrabold text-ink">{loading ? '-' : stats?.activeControllers || 0}</p>
              </div>
              <span className="text-2xl">📋</span>
            </div>
          </div>

          <div className="panel-soft bg-gradient-to-br from-primary/10 to-primary/5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Activité récente</p>
                <p className="mt-2 text-3xl font-extrabold text-ink">{loading ? '-' : stats?.recentActivity || 0}</p>
              </div>
              <span className="text-2xl">⚡</span>
            </div>
          </div>
        </div>
      </section>

      {/* Dernières lignes actives */}
      <section className="mb-12">
        <h2 className="mb-6 text-xl font-bold text-ink">Lignes actives</h2>
        <div className="panel-soft p-6">
          <div className="space-y-4">
            {loading ? (
              <p className="text-muted text-center">Chargement...</p>
            ) : recentLines.length === 0 ? (
              <p className="text-muted text-center">Aucune ligne active</p>
            ) : (
              recentLines.map((line) => (
                <div key={line.id} className={`flex items-center gap-4 p-4 rounded-md ${line.active ? 'bg-primary/10 border border-primary/20' : 'bg-muted/30'}`}>
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md text-lg font-bold text-white shadow-elevated"
                    style={{ backgroundColor: line.color }}
                  >
                    {line.number}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-ink">{line.name}</p>
                    <p className="text-sm text-muted">Conducteur: {line.driver || 'Non assigné'}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${line.active ? 'bg-success/20 text-success' : 'bg-muted text-muted'}`}>
                    {line.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Derniers billets émis */}
      <section>
        <h2 className="mb-6 text-xl font-bold text-ink">Derniers billets émis</h2>
        <div className="panel-soft p-6">
          <div className="space-y-4">
            {loading ? (
              <p className="text-muted text-center">Chargement...</p>
            ) : recentTickets.length === 0 ? (
              <p className="text-muted text-center">Aucun billet émis</p>
            ) : (
              recentTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center gap-4 p-4 rounded-md bg-accent/10 border border-accent/20">
                  <span className="text-2xl">🎫</span>
                  <div className="flex-1">
                    <p className="font-semibold text-ink">{ticket.passengerName}</p>
                    <p className="text-sm text-muted">{ticket.lineName}</p>
                  </div>
                  <span className="text-xs text-muted">{formatRelativeTime(ticket.issuedAt)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
