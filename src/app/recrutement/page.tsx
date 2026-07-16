import Link from "next/link";

const opportunities = [
  {
    division: "ClearBus",
    title: "Chauffeur de bus",
    desc: "Conduire les lignes de bus de Vice City et assurer le transport des passagers en toute sécurité.",
    href: "/clearbus/inscription",
    color: "from-primary/10 to-primary/5",
  },
  {
    division: "ClearSecurity",
    title: "Agent de sécurité",
    desc: "Surveiller des sites, effectuer des patrouilles et assurer la sécurité événementielle.",
    href: "/clearsecurity/recrutement",
    color: "from-accent-light to-white",
  },
];

export default function RecrutementPage() {
  return (
    <div className="page-enter mx-auto max-w-6xl px-4">
      <section className="panel-highlight relative mb-12 overflow-hidden p-8 md:p-12">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-md bg-primary-light px-3 py-1 text-xs font-semibold text-primary">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            Recrutement en cours
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-ink md:text-5xl lg:text-6xl">
            Rejoignez
            <span className="text-gradient-brand"> ClearGroup</span>
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
            Découvrez les opportunités de carrière au sein de nos différentes divisions et contribuez au développement de Vice City.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-xl font-bold text-ink">Opportunités par division</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {opportunities.map((opp) => (
            <div
              key={opp.title}
              className={`panel-soft bg-gradient-to-br p-6 ${opp.color}`}
            >
              <p className="text-xs font-semibold text-muted uppercase tracking-wider">{opp.division}</p>
              <h3 className="mt-2 font-bold text-ink">{opp.title}</h3>
              <p className="mt-2 text-sm text-muted">{opp.desc}</p>
              <Link
                href={opp.href}
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition"
              >
                Postuler
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-xl font-bold text-ink">Pourquoi nous rejoindre</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="panel-soft p-6">
            <h3 className="font-bold text-ink">Formation complète</h3>
            <p className="mt-2 text-sm text-muted">
              Programmes de formation adaptés à chaque métier pour garantir votre réussite.
            </p>
          </div>

          <div className="panel-soft p-6">
            <h3 className="font-bold text-ink">Évolution de carrière</h3>
            <p className="mt-2 text-sm text-muted">
              Perspectives d'évolution au sein de ClearGroup et de ses divisions.
            </p>
          </div>

          <div className="panel-soft p-6">
            <h3 className="font-bold text-ink">Cadre stimulant</h3>
            <p className="mt-2 text-sm text-muted">
              Environnement de travail dynamique au cœur de Vice City.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-xl font-bold text-ink">Notre processus de recrutement</h2>
        <div className="panel-soft p-6">
          <ol className="space-y-4">
            <li className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white font-bold text-sm">
                1
              </span>
              <div>
                <h4 className="font-semibold text-ink">Candidature</h4>
                <p className="text-sm text-muted">Envoyez votre candidature via le formulaire de la division concernée.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white font-bold text-sm">
                2
              </span>
              <div>
                <h4 className="font-semibold text-ink">Entretien</h4>
                <p className="text-sm text-muted">Premier échange pour évaluer votre motivation et vos compétences.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white font-bold text-sm">
                3
              </span>
              <div>
                <h4 className="font-semibold text-ink">Intégration</h4>
                <p className="text-sm text-muted">Formation d'intégration et prise de poste au sein de votre division.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section>
        <div className="flex flex-wrap gap-3">
          <Link href="/clearbus/inscription" className="btn-primary">
            Postuler chez ClearBus
          </Link>
          <Link href="/clearsecurity/recrutement" className="btn-secondary">
            Postuler chez ClearSecurity
          </Link>
        </div>
      </section>
    </div>
  );
}
