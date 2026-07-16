import Link from "next/link";

const divisions = [
  {
    title: "ClearBus",
    desc: "Entreprise de transport en commun de Vice City. Radio FM, lignes, tickets, publicités et informations voyageurs.",
    services: [
      "Radio FM",
      "Lignes de bus",
      "Tickets et abonnements",
      "Publicités",
      "Informations voyageurs",
    ],
    color: "from-primary/10 to-primary/5",
    icon: (
      <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" d="M4 7h16c0.55 0 1 0.45 1 1v8c0 0.55-0.45 1-1 1h-1c-0.55 0-1-0.45-1-1v-1H6v1c0 0.55-0.45 1-1 1H4c-0.55 0-1-0.45-1-1V8c0-0.55 0.45-1 1-1z" />
        <rect x="6" y="9" width="3" height="2" rx="0.5" fill="#194A78" />
        <rect x="10.5" y="9" width="3" height="2" rx="0.5" fill="#194A78" />
        <rect x="15" y="9" width="3" height="2" rx="0.5" fill="#194A78" />
      </svg>
    ),
    href: "/clearbus",
  },
  {
    title: "ClearSecurity",
    desc: "Entreprise de sécurité privée intervenant sur Vice City. Surveillance, sécurité événementielle, patrouilles et contrôle d'accès.",
    services: [
      "Surveillance",
      "Sécurité événementielle",
      "Patrouilles",
      "Contrôle d'accès",
      "Protection de sites",
    ],
    color: "from-accent-light to-white",
    icon: (
      <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    href: "/clearsecurity",
  },
];

export default function NosEntreprisesPage() {
  return (
    <div className="page-enter mx-auto max-w-6xl px-4">
      <section className="panel-highlight relative mb-12 overflow-hidden p-8 md:p-12">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-ink md:text-5xl lg:text-6xl">
            Nos
            <span className="text-gradient-brand"> entreprises</span>
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
            Découvrez les différentes divisions de ClearGroup, chacune spécialisée dans un domaine essentiel des services urbains de Vice City.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <div className="grid gap-8 md:grid-cols-2">
          {divisions.map((division) => (
            <div
              key={division.title}
              className={`panel-soft bg-gradient-to-br p-6 ${division.color}`}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-surface shadow-card">
                {division.icon}
              </div>
              <h3 className="text-xl font-bold text-ink">{division.title}</h3>
              <p className="mt-2 text-sm text-muted">{division.desc}</p>
              
              <div className="mt-4">
                <p className="mb-2 text-xs font-semibold text-muted uppercase tracking-wider">Services</p>
                <ul className="space-y-1">
                  {division.services.map((service) => (
                    <li key={service} className="flex items-center gap-2 text-sm text-muted">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      {service}
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={division.href}
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition"
              >
                Découvrir
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-xl font-bold text-ink">Notre vision</h2>
        <div className="panel-soft p-6">
          <p className="text-muted leading-relaxed">
            ClearGroup ambitionne de devenir le référence en matière de services urbains à Vice City. 
            En regroupant des entreprises complémentaires sous une même bannière, nous offrons une qualité 
            de service cohérente et professionnelle dans tous les domaines essentiels à la vie urbaine.
          </p>
          <p className="mt-4 text-muted leading-relaxed">
            Notre structure modulaire nous permet d&apos;intégrer facilement de nouvelles divisions pour répondre 
            aux besoins évolutifs de la ville et de ses habitants.
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-xl font-bold text-ink">Projets futurs</h2>
        <div className="panel-soft p-6">
          <p className="text-muted leading-relaxed">
            ClearGroup étudie régulièrement de nouvelles opportunités pour étendre ses services. 
            Parmi les projets envisagés : ClearTaxi (transport individuel), ClearLogistics (logistique urbaine), 
            ClearMedical (services médicaux d&apos;urgence) et ClearEvents (organisation d&apos;événements).
          </p>
        </div>
      </section>
    </div>
  );
}
