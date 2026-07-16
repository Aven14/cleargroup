import { PageHeader } from "@/components/ui/page-header";

export default function SecurityDashboardPage() {
  return (
    <div className="page-enter mx-auto max-w-6xl px-4">
      <PageHeader
        title="Tableau de bord"
        subtitle="Vue d&apos;ensemble des opérations de sécurité en temps réel"
      />

      {/* Statistiques en temps réel */}
      <section className="mb-12">
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          <div className="panel-soft bg-gradient-to-br from-primary/10 to-primary/5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Agents en service</p>
                <p className="mt-2 text-3xl font-extrabold text-ink">3</p>
              </div>
              <span className="text-2xl">👥</span>
            </div>
          </div>

          <div className="panel-soft bg-gradient-to-br from-accent-light to-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Patrouilles actives</p>
                <p className="mt-2 text-3xl font-extrabold text-ink">2</p>
              </div>
              <span className="text-2xl">🚔</span>
            </div>
          </div>

          <div className="panel-soft bg-gradient-to-br from-primary-light/80 to-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Alertes actives</p>
                <p className="mt-2 text-3xl font-extrabold text-ink">1</p>
              </div>
              <span className="text-2xl">🚨</span>
            </div>
          </div>

          <div className="panel-soft bg-gradient-to-br from-success/10 to-success/5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Débriefings aujourd&apos;hui</p>
                <p className="mt-2 text-3xl font-extrabold text-ink">5</p>
              </div>
              <span className="text-2xl">📋</span>
            </div>
          </div>

          <div className="panel-soft bg-gradient-to-br from-warning/10 to-warning/5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Personnes détenues</p>
                <p className="mt-2 text-3xl font-extrabold text-ink">2</p>
              </div>
              <span className="text-2xl">🔒</span>
            </div>
          </div>

          <div className="panel-soft bg-gradient-to-br from-primary/10 to-primary/5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Activité récente</p>
                <p className="mt-2 text-3xl font-extrabold text-ink">12</p>
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
            <div className="flex items-center gap-4 p-4 rounded-md bg-accent/10 border border-accent/20">
              <span className="text-2xl">🚨</span>
              <div className="flex-1">
                <p className="font-semibold text-ink">Manque d&apos;effectif</p>
                <p className="text-sm text-muted">Centre-ville · 3 agents demandés</p>
              </div>
              <span className="text-xs text-muted">Il y a 5 min</span>
            </div>
          </div>
        </div>
      </section>

      {/* Derniers services commencés */}
      <section className="mb-12">
        <h2 className="mb-6 text-xl font-bold text-ink">Derniers services commencés</h2>
        <div className="panel-soft p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-md bg-primary/10 border border-primary/20">
              <span className="text-2xl">👤</span>
              <div className="flex-1">
                <p className="font-semibold text-ink">Jean Dupont</p>
                <p className="text-sm text-muted">Prise de service · Véhicule: SEC-001</p>
              </div>
              <span className="text-xs text-muted">Il y a 10 min</span>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-md bg-primary/10 border border-primary/20">
              <span className="text-2xl">👤</span>
              <div className="flex-1">
                <p className="font-semibold text-ink">Marie Martin</p>
                <p className="text-sm text-muted">Prise de service · Véhicule: SEC-002</p>
              </div>
              <span className="text-xs text-muted">Il y a 15 min</span>
            </div>
          </div>
        </div>
      </section>

      {/* Dernières patrouilles créées */}
      <section>
        <h2 className="mb-6 text-xl font-bold text-ink">Dernières patrouilles créées</h2>
        <div className="panel-soft p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-md bg-accent-light border border-accent/20">
              <span className="text-2xl">🚔</span>
              <div className="flex-1">
                <p className="font-semibold text-ink">Patrouille Centre-ville</p>
                <p className="text-sm text-muted">Jean Dupont · Patrouille mobile</p>
              </div>
              <span className="text-xs text-muted">Il y a 20 min</span>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-md bg-accent-light border border-accent/20">
              <span className="text-2xl">🚔</span>
              <div className="flex-1">
                <p className="font-semibold text-ink">Patrouille Quartier Nord</p>
                <p className="text-sm text-muted">Marie Martin · Intervention</p>
              </div>
              <span className="text-xs text-muted">Il y a 30 min</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
