"use client";

import Link from "next/link";

export default function ClearDPInternePage() {
  return (
    <div className="page-enter">
      <div className="panel-highlight mb-8 p-8">
        <h1 className="text-3xl font-extrabold text-ink">
          Clear<span className="text-gradient-brand">DP</span> - Espace interne
        </h1>
        <p className="mt-2 text-muted">Gestion interne du service de dépannage</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/cleardp/interne/prise-service" className="panel-soft p-6 hover:shadow-lg transition-shadow">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-primary-light">
            <span className="text-2xl">🔧</span>
          </div>
          <h3 className="font-bold text-ink">Prise de service</h3>
          <p className="mt-2 text-sm text-muted">Démarrer ou terminer votre service</p>
        </Link>

        <Link href="/cleardp/interne/agents" className="panel-soft p-6 hover:shadow-lg transition-shadow">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-accent-light">
            <span className="text-2xl">👷</span>
          </div>
          <h3 className="font-bold text-ink">Agents</h3>
          <p className="mt-2 text-sm text-muted">Liste des mécaniciens et leur statut</p>
        </Link>

        <Link href="/cleardp/interne/fiches" className="panel-soft p-6 hover:shadow-lg transition-shadow">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
            <span className="text-2xl">📋</span>
          </div>
          <h3 className="font-bold text-ink">Fiches clients</h3>
          <p className="mt-2 text-sm text-muted">Gestion des dossiers clients et historique</p>
        </Link>

        <Link href="/cleardp/interne/tableau-de-bord" className="panel-soft p-6 hover:shadow-lg transition-shadow">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-accent/10">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="font-bold text-ink">Tableau de bord</h3>
          <p className="mt-2 text-sm text-muted">Statistiques et vue d&apos;ensemble</p>
        </Link>
      </div>
    </div>
  );
}
