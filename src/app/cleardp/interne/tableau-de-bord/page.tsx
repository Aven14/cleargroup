"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DPSidebar } from "@/components/cleardp/dp-sidebar";

interface Stats {
  totalClients: number;
  activeMechanics: number;
  totalRepairs: number;
  clientsWithDiscount: number;
  pendingRepairs: number;
}

export default function TableauDeBordPage() {
  const [stats, setStats] = useState<Stats>({
    totalClients: 0,
    activeMechanics: 0,
    totalRepairs: 0,
    clientsWithDiscount: 0,
    pendingRepairs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [clientsRes, shiftsRes] = await Promise.all([
        fetch('/api/dp/clients'),
        fetch('/api/dp/shifts'),
      ]);

      if (clientsRes.ok && shiftsRes.ok) {
        const clients = await clientsRes.json();
        const shifts = await shiftsRes.json();
        
        const activeMechanics = shifts.filter((s: { endedAt: string | null }) => !s.endedAt).length;
        const totalRepairs = clients.reduce((sum: number, c: { repairs?: unknown[] }) => sum + (c.repairs?.length || 0), 0);
        const clientsWithDiscount = clients.filter((c: { hasDiscount: boolean }) => c.hasDiscount).length;
        const pendingRepairs = clients.reduce((sum: number, c: { repairs?: { status: string }[] }) => 
          sum + (c.repairs?.filter((r: { status: string }) => r.status === "En cours").length || 0), 0);

        setStats({
          totalClients: clients.length,
          activeMechanics,
          totalRepairs,
          clientsWithDiscount,
          pendingRepairs,
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <DPSidebar />
      <main className="flex-1 ml-56 p-6">
        <PageHeader
          brand="ClearDP"
          title="Tableau de bord"
          subtitle="Statistiques et vue d'ensemble de l'activité"
        />

      <section className="mb-8">
        <h2 className="mb-4 text-lg font-bold text-ink">Statistiques générales</h2>
        {loading ? (
          <div className="panel-soft p-6 text-center text-muted">Chargement...</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="panel-soft p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">Total clients</p>
                  <p className="mt-2 text-3xl font-extrabold text-ink">{stats.totalClients}</p>
                </div>
                <span className="text-2xl">👥</span>
              </div>
            </div>

            <div className="panel-soft p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">Mécaniciens en service</p>
                  <p className="mt-2 text-3xl font-extrabold text-ink">{stats.activeMechanics}</p>
                </div>
                <span className="text-2xl">👷</span>
              </div>
            </div>

            <div className="panel-soft p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">Total réparations</p>
                  <p className="mt-2 text-3xl font-extrabold text-ink">{stats.totalRepairs}</p>
                </div>
                <span className="text-2xl">🔧</span>
              </div>
            </div>

            <div className="panel-soft p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">Clients avec -50%</p>
                  <p className="mt-2 text-3xl font-extrabold text-green-600">{stats.clientsWithDiscount}</p>
                </div>
                <span className="text-2xl">🎉</span>
              </div>
            </div>

            <div className="panel-soft p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">Réparations en cours</p>
                  <p className="mt-2 text-3xl font-extrabold text-blue-600">{stats.pendingRepairs}</p>
                </div>
                <span className="text-2xl">⚙️</span>
              </div>
            </div>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-bold text-ink">Informations</h2>
        <div className="panel-soft p-6 space-y-4">
          <div className="flex items-start gap-4">
            <span className="text-2xl">💡</span>
            <div>
              <h3 className="font-bold text-ink">Programme fidélité</h3>
              <p className="text-sm text-muted">
                Les clients bénéficient d&apos;une réduction de 50% après 5 réparations.
                Le compteur de réparation est automatiquement incrémenté à chaque intervention.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-2xl">📋</span>
            <div>
              <h3 className="font-bold text-ink">Gestion des fiches</h3>
              <p className="text-sm text-muted">
                Chaque client dispose d&apos;une fiche individuelle avec son historique de réparations,
                ses informations de contact et les détails de son véhicule.
              </p>
            </div>
          </div>
        </div>
      </section>
      </main>
    </div>
  );
}
