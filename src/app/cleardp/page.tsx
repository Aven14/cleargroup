"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface ActiveMechanic {
  id: string;
  firstname: string;
  lastname: string;
  roles: string[];
  startedAt: string;
  vehicle: string | null;
}

export default function ClearDPPage() {
  const [activeMechanics, setActiveMechanics] = useState<ActiveMechanic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActiveMechanics = async () => {
      try {
        const response = await fetch('/api/dp/shifts');
        if (response.ok) {
          const data = await response.json();
          const activeShifts = data.filter((shift: any) => !shift.endedAt);
          setActiveMechanics(activeShifts);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des mécaniciens en service:', error);
      } finally {
        setLoading(false);
      }
    };
    loadActiveMechanics();
  }, []);

  const formatHeure = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="page-enter mx-auto max-w-6xl px-4">
      <section className="panel-highlight relative mb-12 overflow-hidden p-8 md:p-12">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-md bg-primary-light px-3 py-1 text-xs font-semibold text-primary">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            Services de dépannage · Vice City
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-ink md:text-5xl lg:text-6xl">
            Clear
            <span className="text-gradient-brand">DP</span>
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
            Service de dépannage et réparation automobile. Intervention rapide, diagnostic complet et pièces de qualité.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/cleardp/interne" className="btn-primary">
              Espace interne
            </Link>
            <Link href="/cleardp/interne/fiches" className="btn-secondary">
              Fiches clients
            </Link>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-xl font-bold text-ink">Nos services</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="panel-soft bg-gradient-to-br from-primary/10 to-primary/5 p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-surface shadow-card">
              <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="font-bold text-ink">Réparation mécanique</h3>
            <p className="mt-2 text-sm text-muted">Diagnostic et réparation complète de tous types de véhicules.</p>
          </div>

          <div className="panel-soft bg-gradient-to-br from-accent-light to-white p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-surface shadow-card">
              <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-bold text-ink">Dépannage rapide</h3>
            <p className="mt-2 text-sm text-muted">Intervention d'urgence sur route et sur site.</p>
          </div>

          <div className="panel-soft bg-gradient-to-br from-primary-light/80 to-white p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-surface shadow-card">
              <svg className="h-6 w-6 text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="font-bold text-ink">Programme fidélité</h3>
            <p className="mt-2 text-sm text-muted">-50% après 5 réparations pour nos clients réguliers.</p>
          </div>

          <div className="panel-soft bg-gradient-to-br from-primary/10 to-primary/5 p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-surface shadow-card">
              <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-ink">Suivi client</h3>
            <p className="mt-2 text-sm text-muted">Historique complet des réparations et gestion des fiches.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-xl font-bold text-ink">Mécaniciens en service</h2>
        {loading ? (
          <div className="panel-soft p-6 text-center text-muted">Chargement des mécaniciens...</div>
        ) : activeMechanics.length === 0 ? (
          <div className="panel-soft p-6 text-center text-muted">Aucun mécanicien en service pour le moment</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeMechanics.map((mechanic) => (
              <div key={mechanic.id} className="panel-soft p-8">
                <div className="mb-3">
                  <p className="font-bold text-ink">
                    {mechanic.firstname} {mechanic.lastname}
                  </p>
                  <p className="text-xs text-muted">ClearDP</p>
                </div>
                <div className="mb-3">
                  <p className="text-xs text-muted mb-1">Début du service</p>
                  <p className="text-sm font-medium text-ink">{formatHeure(mechanic.startedAt)}</p>
                </div>
                {mechanic.vehicle && (
                  <div className="mb-3">
                    <p className="text-xs text-muted mb-1">Véhicule</p>
                    <p className="text-sm font-medium text-ink">{mechanic.vehicle}</p>
                  </div>
                )}
                <div className="flex flex-wrap gap-1">
                  {mechanic.roles.map((role) => (
                    <span key={role} className="px-2 py-1 bg-primary-light/50 rounded text-xs text-muted">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
