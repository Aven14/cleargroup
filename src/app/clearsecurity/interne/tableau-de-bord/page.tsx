"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";

interface DashboardStats {
  activeShifts: number;
  activePatrols: number;
  activeAlerts: number;
  activeDetainees: number;
  todayDebriefings: number;
}

interface Alert {
  type: string;
  location: string;
  createdBy: {
    firstname: string;
    lastname: string;
  };
  createdAt: string;
}

interface Shift {
  user: {
    firstname: string;
    lastname: string;
  };
  vehicle: string | null;
  startedAt: string;
}

interface Patrol {
  sector: string;
  missionType: string;
  agent: {
    firstname: string;
    lastname: string;
  };
  startedAt: string;
}

export default function SecurityDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);
  const [recentShifts, setRecentShifts] = useState<Shift[]>([]);
  const [recentPatrols, setRecentPatrols] = useState<Patrol[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await fetch('/api/security/dashboard');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setRecentAlerts(data.recentAlerts);
        setRecentShifts(data.recentShifts);
        setRecentPatrols(data.recentPatrols);
      }
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
    <div className="page-enter compact-layout">
      <PageHeader
        title="Tableau de bord"
        subtitle="Vue d&apos;ensemble des opérations de sécurité en temps réel"
      />

      {/* Statistiques en temps réel */}
      <section className="mb-12">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="panel-soft bg-gradient-to-br from-primary/10 to-primary/5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Agents en service</p>
                <p className="mt-2 text-3xl font-extrabold text-ink">{loading ? '-' : stats?.activeShifts || 0}</p>
              </div>
              <span className="text-2xl">👥</span>
            </div>
          </div>

          <div className="panel-soft bg-gradient-to-br from-accent-light to-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Patrouilles actives</p>
                <p className="mt-2 text-3xl font-extrabold text-ink">{loading ? '-' : stats?.activePatrols || 0}</p>
              </div>
              <span className="text-2xl">🚔</span>
            </div>
          </div>

          <div className="panel-soft bg-gradient-to-br from-primary-light/80 to-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Alertes actives</p>
                <p className="mt-2 text-3xl font-extrabold text-ink">{loading ? '-' : stats?.activeAlerts || 0}</p>
              </div>
              <span className="text-2xl">🚨</span>
            </div>
          </div>

          <div className="panel-soft bg-gradient-to-br from-success/10 to-success/5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Débriefings aujourd&apos;hui</p>
                <p className="mt-2 text-3xl font-extrabold text-ink">{loading ? '-' : stats?.todayDebriefings || 0}</p>
              </div>
              <span className="text-2xl">📋</span>
            </div>
          </div>

          <div className="panel-soft bg-gradient-to-br from-warning/10 to-warning/5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Personnes détenues</p>
                <p className="mt-2 text-3xl font-extrabold text-ink">{loading ? '-' : stats?.activeDetainees || 0}</p>
              </div>
              <span className="text-2xl">🔒</span>
            </div>
          </div>

          <div className="panel-soft bg-gradient-to-br from-primary/10 to-primary/5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Activité récente</p>
                <p className="mt-2 text-3xl font-extrabold text-ink">{loading ? '-' : (stats?.activeShifts || 0) + (stats?.activePatrols || 0) + (stats?.activeAlerts || 0)}</p>
              </div>
              <span className="text-2xl">⚡</span>
            </div>
          </div>
        </div>
      </section>

      {/* Dernières alertes */}
      <section className="mb-12">
        <h2 className="mb-6 text-xl font-bold text-ink">Dernières alertes</h2>
        <div className="panel-soft p-6">
          <div className="space-y-4">
            {loading ? (
              <p className="text-muted text-center">Chargement...</p>
            ) : recentAlerts.length === 0 ? (
              <p className="text-muted text-center">Aucune alerte active</p>
            ) : (
              recentAlerts.map((alert) => (
                <div key={alert.createdAt} className="flex items-center gap-4 p-4 rounded-md bg-accent/10 border border-accent/20">
                  <span className="text-2xl">🚨</span>
                  <div className="flex-1">
                    <p className="font-semibold text-ink">{alert.type}</p>
                    <p className="text-sm text-muted">{alert.location}</p>
                  </div>
                  <span className="text-xs text-muted">{formatRelativeTime(alert.createdAt)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Derniers services commencés */}
      <section className="mb-12">
        <h2 className="mb-6 text-xl font-bold text-ink">Derniers services commencés</h2>
        <div className="panel-soft p-6">
          <div className="space-y-4">
            {loading ? (
              <p className="text-muted text-center">Chargement...</p>
            ) : recentShifts.length === 0 ? (
              <p className="text-muted text-center">Aucun service en cours</p>
            ) : (
              recentShifts.map((shift) => (
                <div key={shift.startedAt} className="flex items-center gap-4 p-4 rounded-md bg-primary/10 border border-primary/20">
                  <span className="text-2xl">👤</span>
                  <div className="flex-1">
                    <p className="font-semibold text-ink">{shift.user?.firstname} {shift.user?.lastname}</p>
                    <p className="text-sm text-muted">Prise de service · Véhicule: {shift.vehicle || 'N/A'}</p>
                  </div>
                  <span className="text-xs text-muted">{formatRelativeTime(shift.startedAt)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Dernières patrouilles créées */}
      <section>
        <h2 className="mb-6 text-xl font-bold text-ink">Dernières patrouilles créées</h2>
        <div className="panel-soft p-6">
          <div className="space-y-4">
            {loading ? (
              <p className="text-muted text-center">Chargement...</p>
            ) : recentPatrols.length === 0 ? (
              <p className="text-muted text-center">Aucune patrouille active</p>
            ) : (
              recentPatrols.map((patrol) => (
                <div key={patrol.startedAt} className="flex items-center gap-4 p-4 rounded-md bg-accent-light border border-accent/20">
                  <span className="text-2xl">🚔</span>
                  <div className="flex-1">
                    <p className="font-semibold text-ink">Patrouille {patrol.sector}</p>
                    <p className="text-sm text-muted">{patrol.agent?.firstname} {patrol.agent?.lastname} · {patrol.missionType}</p>
                  </div>
                  <span className="text-xs text-muted">{formatRelativeTime(patrol.startedAt)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
