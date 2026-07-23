"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";

interface DashboardStats {
  activeShifts: number;
  activePatrols: number;
  activeAlerts: number;
  activePatients: number;
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

export default function RescueDashboardPage() {
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
      const response = await fetch('/api/rescue/dashboard');
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


  return (
    <div className="page-enter">
      <PageHeader
        brand="ClearRescue"
        title="Tableau de bord"
        subtitle="Vue d&apos;ensemble des opérations de secours en temps réel"
      />

      <section className="mb-8">
        <h2 className="mb-4 text-lg font-bold text-ink">Statistiques en temps réel</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="panel-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Ambulanciers en service</p>
                <p className="mt-2 text-3xl font-extrabold text-ink">{loading ? '-' : stats?.activeShifts || 0}</p>
              </div>
              <span className="text-2xl">👥</span>
            </div>
          </div>

          <div className="panel-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Interventions actives</p>
                <p className="mt-2 text-3xl font-extrabold text-ink">{loading ? '-' : stats?.activePatrols || 0}</p>
              </div>
              <span className="text-2xl">🚑</span>
            </div>
          </div>

          <div className="panel-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Alertes actives</p>
                <p className="mt-2 text-3xl font-extrabold text-ink">{loading ? '-' : stats?.activeAlerts || 0}</p>
              </div>
              <span className="text-2xl">🚨</span>
            </div>
          </div>

          <div className="panel-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Débriefings aujourd&apos;hui</p>
                <p className="mt-2 text-3xl font-extrabold text-ink">{loading ? '-' : stats?.todayDebriefings || 0}</p>
              </div>
              <span className="text-2xl">📋</span>
            </div>
          </div>

          <div className="panel-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Patients en cours</p>
                <p className="mt-2 text-3xl font-extrabold text-ink">{loading ? '-' : stats?.activePatients || 0}</p>
              </div>
              <span className="text-2xl">🏥</span>
            </div>
          </div>

          <div className="panel-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Activité totale</p>
                <p className="mt-2 text-3xl font-extrabold text-ink">{loading ? '-' : (stats?.activeShifts || 0) + (stats?.activePatrols || 0) + (stats?.activeAlerts || 0)}</p>
              </div>
              <span className="text-2xl">⚡</span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-bold text-ink">Activité récente</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="panel-soft p-6">
            <h3 className="mb-4 font-bold text-ink">Alertes</h3>
            <div className="space-y-3">
              {loading ? (
                <p className="text-muted text-center">Chargement...</p>
              ) : recentAlerts.length === 0 ? (
                <p className="text-muted text-center">Aucune alerte</p>
              ) : (
                recentAlerts.slice(0, 3).map((alert) => (
                  <div key={alert.createdAt} className="flex items-center gap-3 p-3 bg-red-50 border border-red-100 rounded">
                    <span className="text-xl">🚨</span>
                    <div className="flex-1">
                      <p className="font-semibold text-ink text-sm">{alert.type}</p>
                      <p className="text-xs text-muted">{alert.location}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="panel-soft p-6">
            <h3 className="mb-4 font-bold text-ink">Services</h3>
            <div className="space-y-3">
              {loading ? (
                <p className="text-muted text-center">Chargement...</p>
              ) : recentShifts.length === 0 ? (
                <p className="text-muted text-center">Aucun service</p>
              ) : (
                recentShifts.slice(0, 3).map((shift) => (
                  <div key={shift.startedAt} className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded">
                    <span className="text-xl">👤</span>
                    <div className="flex-1">
                      <p className="font-semibold text-ink text-sm">{shift.user?.firstname} {shift.user?.lastname}</p>
                      <p className="text-xs text-muted">{shift.vehicle || 'N/A'}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="panel-soft p-6 md:col-span-2">
            <h3 className="mb-4 font-bold text-ink">Interventions</h3>
            <div className="grid gap-3 md:grid-cols-2">
              {loading ? (
                <p className="text-muted text-center col-span-full">Chargement...</p>
              ) : recentPatrols.length === 0 ? (
                <p className="text-muted text-center col-span-full">Aucune intervention</p>
              ) : (
                recentPatrols.slice(0, 4).map((patrol) => (
                  <div key={patrol.startedAt} className="flex items-center gap-3 p-3 bg-green-50 border border-green-100 rounded">
                    <span className="text-xl">🚑</span>
                    <div className="flex-1">
                      <p className="font-semibold text-ink text-sm">{patrol.sector}</p>
                      <p className="text-xs text-muted">{patrol.agent?.firstname} {patrol.agent?.lastname}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
