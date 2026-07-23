"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface ActiveStaff {
  id: string;
  firstname: string;
  lastname: string;
  roles: string[];
  type: 'AMBULANCIER' | 'DRIVER' | 'SECURITY';
  startedAt: string;
  line: { number: number; name: string } | null;
}

export default function ClearRescuePage() {
  const [activeStaff, setActiveStaff] = useState<ActiveStaff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActiveStaff = async () => {
      try {
        const response = await fetch('/api/active-staff');
        if (response.ok) {
          const data = await response.json();
          const rescueStaff = data.filter((staff: ActiveStaff) => staff.type === 'AMBULANCIER');
          setActiveStaff(rescueStaff);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des ambulanciers en service:', error);
      } finally {
        setLoading(false);
      }
    };
    loadActiveStaff();
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
            Services médicaux d&apos;urgence · Vice City
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-ink md:text-5xl lg:text-6xl">
            Clear
            <span className="text-gradient-brand">Rescue</span>
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
            Service d&apos;ambulance et de secours médicaux intervenant sur Vice City. Urgences, transport sanitaire et interventions médicales.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/clearrescue/services" className="btn-primary">
              Nos services
            </Link>
            <Link href="/clearrescue/recrutement" className="btn-secondary">
              Recrutement
            </Link>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-xl font-bold text-ink">Nos domaines d&apos;intervention</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="panel-soft bg-gradient-to-br from-primary/10 to-primary/5 p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-surface shadow-card">
              <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-ink">Urgences médicales</h3>
            <p className="mt-2 text-sm text-muted">Intervention rapide sur les urgences médicales et accidents.</p>
          </div>

          <div className="panel-soft bg-gradient-to-br from-accent-light to-white p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-surface shadow-card">
              <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h3 className="font-bold text-ink">Transport sanitaire</h3>
            <p className="mt-2 text-sm text-muted">Transport de patients vers les structures de soins.</p>
          </div>

          <div className="panel-soft bg-gradient-to-br from-primary-light/80 to-white p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-surface shadow-card">
              <svg className="h-6 w-6 text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-ink">Événements</h3>
            <p className="mt-2 text-sm text-muted">Couverture médicale lors d&apos;événements publics.</p>
          </div>

          <div className="panel-soft bg-gradient-to-br from-primary/10 to-primary/5 p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-surface shadow-card">
              <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="font-bold text-ink">Premiers secours</h3>
            <p className="mt-2 text-sm text-muted">Administration de premiers secours et stabilisation.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-xl font-bold text-ink">Ambulanciers en service</h2>
        {loading ? (
          <div className="panel-soft p-6 text-center text-muted">Chargement des ambulanciers...</div>
        ) : activeStaff.length === 0 ? (
          <div className="panel-soft p-6 text-center text-muted">Aucun ambulancier en service pour le moment</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeStaff.map((agent) => (
              <div key={agent.id} className="panel-soft p-8">
                <div className="mb-3">
                  <p className="font-bold text-ink">
                    {agent.firstname} {agent.lastname}
                  </p>
                  <p className="text-xs text-muted">ClearRescue</p>
                </div>
                <div className="mb-3">
                  <p className="text-xs text-muted mb-1">Début du service</p>
                  <p className="text-sm font-medium text-ink">{formatHeure(agent.startedAt)}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {agent.roles.map((role) => (
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
