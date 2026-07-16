import Link from "next/link";

export default function PresentationPage() {
  return (
    <div className="page-enter mx-auto max-w-6xl px-4">
      <section className="panel-highlight relative mb-12 overflow-hidden p-8 md:p-12">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-ink md:text-5xl lg:text-6xl">
            À propos de
            <span className="text-gradient-brand"> ClearSecurity</span>
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
            Découvrez notre histoire, nos valeurs et notre engagement envers la sécurité de Vice City.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-xl font-bold text-ink">Notre histoire</h2>
        <div className="panel-soft p-6">
          <p className="text-muted leading-relaxed">
            Fondée en 2024, ClearSecurity est née de la volonté d'offrir à Vice City un service de sécurité privée de premier plan. 
            Filiale de ClearGroup, nous bénéficions du soutien et de l'expertise d'un leader dans les services urbains.
          </p>
          <p className="mt-4 text-muted leading-relaxed">
            Depuis notre création, nous n'avons cessé de développer nos compétences et nos moyens pour répondre aux besoins 
            croissants en matière de sécurité sur le territoire. Notre équipe d'agents professionnels intervient dans divers 
            domaines : surveillance de sites, sécurité événementielle, patrouilles et contrôle d'accès.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-xl font-bold text-ink">Nos valeurs</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="panel-soft bg-gradient-to-br from-primary/10 to-primary/5 p-6">
            <h3 className="font-bold text-ink">Professionnalisme</h3>
            <p className="mt-2 text-sm text-muted">
              Nos agents sont formés aux meilleures pratiques et interviennent avec rigueur et discernement.
            </p>
          </div>

          <div className="panel-soft bg-gradient-to-br from-accent-light to-white p-6">
            <h3 className="font-bold text-ink">Réactivité</h3>
            <p className="mt-2 text-sm text-muted">
              Intervention rapide 24h/24 pour répondre à toutes les situations d'urgence.
            </p>
          </div>

          <div className="panel-soft bg-gradient-to-br from-primary-light/80 to-white p-6">
            <h3 className="font-bold text-ink">Intégrité</h3>
            <p className="mt-2 text-sm text-muted">
              Respect strict des règles déontologiques et de la confidentialité des missions.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-xl font-bold text-ink">Notre engagement</h2>
        <div className="panel-soft p-6">
          <p className="text-muted leading-relaxed">
            Chez ClearSecurity, nous nous engageons à garantir la sécurité de nos clients tout en respectant 
            les droits et libertés de chacun. Notre approche se veut préventive et dissuasive, privilégiant 
            le dialogue et la médiation lorsque cela est possible.
          </p>
          <p className="mt-4 text-muted leading-relaxed">
            En tant que membre de ClearGroup, nous partageons la même vision d'excellence et d'innovation 
            au service de la communauté de Vice City.
          </p>
        </div>
      </section>

      <section>
        <div className="flex flex-wrap gap-3">
          <Link href="/clearsecurity/services" className="btn-primary">
            Découvrir nos services
          </Link>
          <Link href="/clearsecurity/recrutement" className="btn-secondary">
            Nous rejoindre
          </Link>
        </div>
      </section>
    </div>
  );
}
