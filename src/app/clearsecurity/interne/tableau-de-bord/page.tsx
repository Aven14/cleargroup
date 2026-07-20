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
    <div className="page-enter">
      <PageHeader
        title="Tableau de bord"
        subtitle="Vue d&apos;ensemble des opérations de sécurité en temps réel"
      />

      {/* Statistiques en temps réel */}
      <section className="mb-12">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Agents en service</p>
                <p className="mt-2 text-3xl font-extrabold text-gray-900">{loading ? '-' : stats?.activeShifts || 0}</p>
              </div>
              <span className="text-2xl">👥</span>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Patrouilles actives</p>
                <p className="mt-2 text-3xl font-extrabold text-gray-900">{loading ? '-' : stats?.activePatrols || 0}</p>
              </div>
              <span className="text-2xl">🚔</span>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Alertes actives</p>
                <p className="mt-2 text-3xl font-extrabold text-gray-900">{loading ? '-' : stats?.activeAlerts || 0}</p>
              </div>
              <span className="text-2xl">🚨</span>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Débriefings aujourd&apos;hui</p>
                <p className="mt-2 text-3xl font-extrabold text-gray-900">{loading ? '-' : stats?.todayDebriefings || 0}</p>
              </div>
              <span className="text-2xl">📋</span>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Personnes détenues</p>
                <p className="mt-2 text-3xl font-extrabold text-gray-900">{loading ? '-' : stats?.activeDetainees || 0}</p>
              </div>
              <span className="text-2xl">🔒</span>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Activité totale</p>
                <p className="mt-2 text-3xl font-extrabold text-gray-900">{loading ? '-' : (stats?.activeShifts || 0) + (stats?.activePatrols || 0) + (stats?.activeAlerts || 0)}</p>
              </div>
              <span className="text-2xl">⚡</span>
            </div>
          </div>
        </div>
      </section>

      {/* Activité récente */}
      <section>
        <h2 className="mb-6 text-xl font-bold text-gray-900">Activité récente</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <h3 className="mb-4 font-bold text-gray-900">Alertes</h3>
            <div className="space-y-3">
              {loading ? (
                <p className="text-gray-500 text-center">Chargement...</p>
              ) : recentAlerts.length === 0 ? (
                <p className="text-gray-500 text-center">Aucune alerte</p>
              ) : (
                recentAlerts.slice(0, 3).map((alert) => (
                  <div key={alert.createdAt} className="flex items-center gap-3 p-3 rounded-md bg-red-50 border border-red-100">
                    <span className="text-xl">🚨</span>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{alert.type}</p>
                      <p className="text-xs text-gray-500">{alert.location}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <h3 className="mb-4 font-bold text-gray-900">Services</h3>
            <div className="space-y-3">
              {loading ? (
                <p className="text-gray-500 text-center">Chargement...</p>
              ) : recentShifts.length === 0 ? (
                <p className="text-gray-500 text-center">Aucun service</p>
              ) : (
                recentShifts.slice(0, 3).map((shift) => (
                  <div key={shift.startedAt} className="flex items-center gap-3 p-3 rounded-md bg-blue-50 border border-blue-100">
                    <span className="text-xl">👤</span>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{shift.user?.firstname} {shift.user?.lastname}</p>
                      <p className="text-xs text-gray-500">{shift.vehicle || 'N/A'}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-lg p-6 md:col-span-2">
            <h3 className="mb-4 font-bold text-gray-900">Patrouilles</h3>
            <div className="grid gap-3 md:grid-cols-2">
              {loading ? (
                <p className="text-gray-500 text-center col-span-full">Chargement...</p>
              ) : recentPatrols.length === 0 ? (
                <p className="text-gray-500 text-center col-span-full">Aucune patrouille</p>
              ) : (
                recentPatrols.slice(0, 4).map((patrol) => (
                  <div key={patrol.startedAt} className="flex items-center gap-3 p-3 rounded-md bg-green-50 border border-green-100">
                    <span className="text-xl">🚔</span>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{patrol.sector}</p>
                      <p className="text-xs text-gray-500">{patrol.agent?.firstname} {patrol.agent?.lastname}</p>
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
