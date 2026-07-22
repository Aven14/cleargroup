"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface Stop {
  id: string;
  name: string;
  slug: string;
  order: number;
}

interface TransportLine {
  id: string;
  number: number;
  name: string;
  color: string;
  stops: Stop[];
}

interface Driver {
  id: string;
  firstname: string;
  lastname: string;
}

interface ActiveLine {
  id: string;
  userId: string;
  lineId: string;
  currentStopId: string | null;
  destinationStopId: string | null;
  startedAt: string;
  endedAt: string | null;
  line: TransportLine;
  user: Driver;
}

export default function ClearBusPage() {
  const [activeLines, setActiveLines] = useState<ActiveLine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActiveLines = async () => {
      try {
        const response = await fetch('/api/transport/lines');
        if (response.ok) {
          const data = await response.json();
          setActiveLines(data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des lignes actives:', error);
      } finally {
        setLoading(false);
      }
    };
    loadActiveLines();
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
            Transport en commun · Vice City
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-ink md:text-5xl lg:text-6xl">
            Clear
            <span className="text-gradient-brand">Bus</span>
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
            Entreprise de transport en commun de Vice City. Lignes de bus, tickets, publicités et informations voyageurs.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/clearbus/lignes" className="btn-primary">
              Nos lignes
            </Link>
            <Link href="/clearbus/inscription" className="btn-secondary">
              S&apos;inscrire
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="font-bold text-ink">Lignes de bus</h3>
            <p className="mt-2 text-sm text-muted">Réseau de lignes couvrant toute la ville de Vice City.</p>
          </div>

          <div className="panel-soft bg-gradient-to-br from-accent-light to-white p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-surface shadow-card">
              <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <h3 className="font-bold text-ink">Billetterie</h3>
            <p className="mt-2 text-sm text-muted">Achat de tickets et abonnements en ligne et en station.</p>
          </div>

          <div className="panel-soft bg-gradient-to-br from-primary-light/80 to-white p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-surface shadow-card">
              <svg className="h-6 w-6 text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="font-bold text-ink">Publicités</h3>
            <p className="mt-2 text-sm text-muted">Espaces publicitaires sur nos bus et dans nos stations.</p>
          </div>

          <div className="panel-soft bg-gradient-to-br from-primary/10 to-primary/5 p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-surface shadow-card">
              <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-ink">Informations voyageurs</h3>
            <p className="mt-2 text-sm text-muted">Horaires, itinéraires et informations en temps réel.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-xl font-bold text-ink">Lignes actives</h2>
        {loading ? (
          <div className="panel-soft p-6 text-center text-muted">Chargement des lignes actives...</div>
        ) : activeLines.length === 0 ? (
          <div className="panel-soft p-6 text-center text-muted">Aucune ligne active pour le moment</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeLines.map((activeLine) => (
              <Link
                key={activeLine.id}
                href={`/clearbus/lignes/${activeLine.line.number}`}
                className="panel-soft p-8 transition hover:shadow-card"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white shadow-card"
                    style={{ backgroundColor: activeLine.line.color }}
                  >
                    {activeLine.line.number}
                  </div>
                  <div>
                    <h3 className="font-bold text-ink">{activeLine.line.name}</h3>
                    <p className="text-xs text-muted">{activeLine.line.stops.length} arrêts</p>
                  </div>
                </div>
                <div className="mb-3">
                  <p className="text-xs text-muted mb-1">Chauffeur</p>
                  <p className="text-sm font-medium text-ink">
                    {activeLine.user.firstname} {activeLine.user.lastname}
                  </p>
                </div>
                <div className="mb-3">
                  <p className="text-xs text-muted mb-1">Début du service</p>
                  <p className="text-sm font-medium text-ink">{formatHeure(activeLine.startedAt)}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {activeLine.line.stops.slice(0, 3).map((stop) => (
                    <span key={stop.id} className="px-2 py-1 bg-primary-light/50 rounded text-xs text-muted">
                      {stop.name}
                    </span>
                  ))}
                  {activeLine.line.stops.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs text-muted">
                      +{activeLine.line.stops.length - 3}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
