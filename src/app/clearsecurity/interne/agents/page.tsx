import { PageHeader } from "@/components/ui/page-header";

export default function AgentsPage() {
  const agents = [
    {
      id: 1,
      nom: "Dupont",
      prenom: "Jean",
      statut: "Disponible",
      photo: "👤",
      heurePriseService: "14:30",
      derniereActivite: "Il y a 5 min",
      patrouilleActive: "Patrouille Centre-ville",
    },
    {
      id: 2,
      nom: "Martin",
      prenom: "Marie",
      statut: "En mission",
      photo: "👤",
      heurePriseService: "15:00",
      derniereActivite: "Il y a 2 min",
      patrouilleActive: "Patrouille Quartier Nord",
    },
    {
      id: 3,
      nom: "Bernard",
      prenom: "Pierre",
      statut: "En pause",
      photo: "👤",
      heurePriseService: "13:00",
      derniereActivite: "Il y a 15 min",
      patrouilleActive: null,
    },
    {
      id: 4,
      nom: "Petit",
      prenom: "Sophie",
      statut: "Hors service",
      photo: "👤",
      heurePriseService: null,
      derniereActivite: "Il y a 2h",
      patrouilleActive: null,
    },
  ];

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "Disponible":
        return "bg-success/20 text-success";
      case "En mission":
        return "bg-primary/20 text-primary";
      case "En pause":
        return "bg-warning/20 text-warning";
      case "Hors service":
        return "bg-muted text-muted";
      default:
        return "bg-muted text-muted";
    }
  };

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case "Disponible":
        return "🟢";
      case "En mission":
        return "🔵";
      case "En pause":
        return "🟠";
      case "Hors service":
        return "⚫";
      default:
        return "⚫";
    }
  };

  return (
    <div className="page-enter mx-auto max-w-6xl px-4">
      <PageHeader
        title="Agents"
        subtitle="Liste des agents de sécurité et leur statut en temps réel"
      />

      <section className="mb-12">
        <h2 className="mb-6 text-xl font-bold text-ink">Agents en service</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <div key={agent.id} className="panel-soft p-6">
              <div className="flex items-start gap-4 mb-4">
                <span className="text-4xl">{agent.photo}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-ink">
                    {agent.prenom} {agent.nom}
                  </h3>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getStatutColor(agent.statut)}`}>
                    <span>{getStatutIcon(agent.statut)}</span>
                    {agent.statut}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-xs text-muted">Prise de service</p>
                  <p className="text-sm text-ink">{agent.heurePriseService || "--:--"}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-xs text-muted">Dernière activité</p>
                  <p className="text-sm text-ink">{agent.derniereActivite}</p>
                </div>
                {agent.patrouilleActive && (
                  <div className="flex justify-between">
                    <p className="text-xs text-muted">Patrouille active</p>
                    <p className="text-sm text-ink">{agent.patrouilleActive}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-xl font-bold text-ink">Statistiques</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="panel-soft bg-gradient-to-br from-success/10 to-success/5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Disponibles</p>
                <p className="mt-2 text-3xl font-extrabold text-ink">1</p>
              </div>
              <span className="text-2xl">🟢</span>
            </div>
          </div>
          <div className="panel-soft bg-gradient-to-br from-primary/10 to-primary/5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">En mission</p>
                <p className="mt-2 text-3xl font-extrabold text-ink">1</p>
              </div>
              <span className="text-2xl">🔵</span>
            </div>
          </div>
          <div className="panel-soft bg-gradient-to-br from-warning/10 to-warning/5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">En pause</p>
                <p className="mt-2 text-3xl font-extrabold text-ink">1</p>
              </div>
              <span className="text-2xl">🟠</span>
            </div>
          </div>
          <div className="panel-soft bg-gradient-to-br from-muted/50 to-muted/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Hors service</p>
                <p className="mt-2 text-3xl font-extrabold text-ink">1</p>
              </div>
              <span className="text-2xl">⚫</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
