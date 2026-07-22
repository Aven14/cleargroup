"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface ActiveStaff {
  id: string;
  firstname: string;
  lastname: string;
  roles: string[];
  type: 'SECURITY' | 'DRIVER';
  startedAt: string;
  line: { number: number; name: string } | null;
}

export default function ClearSecurityPage() {
  const [activeStaff, setActiveStaff] = useState<ActiveStaff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActiveStaff = async () => {
      try {
        const response = await fetch('/api/active-staff');
        if (response.ok) {
          const data = await response.json();
          const securityStaff = data.filter((staff: ActiveStaff) => staff.type === 'SECURITY');
          setActiveStaff(securityStaff);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des agents en service:', error);
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
            Sécurité privée · Vice City
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-ink md:text-5xl lg:text-6xl">
            Clear
            <span className="text-gradient-brand">Security</span>
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
            Entreprise de sécurité privée intervenant sur Vice City. Surveillance, sécurité événementielle et protection de sites.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/clearsecurity/services" className="btn-primary">
              Nos services
            </Link>
            <Link href="/clearsecurity/recrutement" className="btn-secondary">
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="font-bold text-ink">Surveillance</h3>
            <p className="mt-2 text-sm text-muted">Protection et surveillance de sites sensibles et commerciaux.</p>
          </div>

          <div className="panel-soft bg-gradient-to-br from-accent-light to-white p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-surface shadow-card">
              <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-ink">Sécurité événementielle</h3>
            <p className="mt-2 text-sm text-muted">Gestion de la sécurité lors d&apos;événements publics et privés.</p>
          </div>

          <div className="panel-soft bg-gradient-to-br from-primary-light/80 to-white p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-surface shadow-card">
              <svg className="h-6 w-6 text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-bold text-ink">Patrouilles</h3>
            <p className="mt-2 text-sm text-muted">Rondes de surveillance et patrouilles mobiles sur le territoire.</p>
          </div>

          <div className="panel-soft bg-gradient-to-br from-primary/10 to-primary/5 p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-surface shadow-card">
              <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h3 className="font-bold text-ink">Contrôle d&apos;accès</h3>
            <p className="mt-2 text-sm text-muted">Gestion des entrées et sorties des sites sécurisés.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-xl font-bold text-ink">Agents en service</h2>
        {loading ? (
          <div className="panel-soft p-6 text-center text-muted">Chargement des agents...</div>
        ) : activeStaff.length === 0 ? (
          <div className="panel-soft p-6 text-center text-muted">Aucun agent en service pour le moment</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeStaff.map((agent) => (
              <div key={agent.id} className="panel-soft p-8">
                <div className="mb-3">
                  <p className="font-bold text-ink">
                    {agent.firstname} {agent.lastname}
                  </p>
                  <p className="text-xs text-muted">ClearSecurity</p>
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
