import Link from "next/link";

const services = [
  {
    title: "Surveillance",
    desc: "Protection et surveillance de sites sensibles, commerciaux et résidentiels.",
    icon: (
      <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    color: "from-primary/10 to-primary/5",
  },
  {
    title: "Sécurité événementielle",
    desc: "Gestion complète de la sécurité lors d'événements publics, concerts et manifestations privées.",
    icon: (
      <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    color: "from-accent-light to-white",
  },
  {
    title: "Patrouilles",
    desc: "Rondes de surveillance régulières et patrouilles mobiles sur l'ensemble du territoire de Vice City.",
    icon: (
      <svg className="h-6 w-6 text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    color: "from-primary-light/80 to-white",
  },
  {
    title: "Contrôle d'accès",
    desc: "Gestion des entrées et sorties, vérification d'identité et filtrage des accès aux sites sécurisés.",
    icon: (
      <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
      </svg>
    ),
    color: "from-primary/10 to-primary/5",
  },
  {
    title: "Protection de sites",
    desc: "Sécurisation d'infrastructures critiques, entrepôts et zones industrielles.",
    icon: (
      <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    color: "from-accent-light to-white",
  },
];

export default function ServicesPage() {
  return (
    <div className="page-enter mx-auto max-w-6xl px-4">
      <section className="panel-highlight relative mb-12 overflow-hidden p-8 md:p-12">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-ink md:text-5xl lg:text-6xl">
            Nos
            <span className="text-gradient-brand"> services</span>
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
            Une gamme complète de solutions de sécurité pour répondre à tous vos besoins à Vice City.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <div className="grid gap-4 md:grid-cols-2">
          {services.map((service) => (
            <div
              key={service.title}
              className={`panel-soft bg-gradient-to-br p-6 ${service.color}`}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-surface shadow-card">
                {service.icon}
              </div>
              <h3 className="font-bold text-ink">{service.title}</h3>
              <p className="mt-2 text-sm text-muted">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-xl font-bold text-ink">Nos garanties</h2>
        <div className="panel-soft p-6">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-accent flex-shrink-0" />
              <span className="text-muted">Agents certifiés et régulièrement formés</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-accent flex-shrink-0" />
              <span className="text-muted">Disponibilité 24h/24 et 7j/7</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-accent flex-shrink-0" />
              <span className="text-muted">Équipements de surveillance modernes</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-accent flex-shrink-0" />
              <span className="text-muted">Protocoles d&apos;intervention éprouvés</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-accent flex-shrink-0" />
              <span className="text-muted">Partenaire de confiance de ClearGroup</span>
            </li>
          </ul>
        </div>
      </section>

      <section>
        <div className="flex flex-wrap gap-3">
          <Link href="/clearsecurity/contact" className="btn-primary">
            Demander un devis
          </Link>
          <Link href="/clearsecurity/recrutement" className="btn-secondary">
            Rejoindre notre équipe
          </Link>
        </div>
      </section>
    </div>
  );
}
