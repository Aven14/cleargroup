import Link from "next/link";

export default function AProposPage() {
  return (
    <div className="page-enter mx-auto max-w-6xl px-4">
      <section className="panel-highlight relative mb-12 overflow-hidden p-8 md:p-12">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-ink md:text-5xl lg:text-6xl">
            À propos de
            <span className="text-gradient-brand"> ClearGroup</span>
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
            Découvrez l&apos;histoire, la mission et les valeurs de ClearGroup, groupe de services urbains de Vice City.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-xl font-bold text-ink">Notre histoire</h2>
        <div className="panel-soft p-6">
          <p className="text-muted leading-relaxed">
            Fondé en 2024, ClearGroup est né de la volonté de créer une structure cohérente pour regrouper 
            les différents services urbains essentiels à Vice City. Initialement centré autour de ClearBus, 
            le réseau de transport en commun de la ville, le groupe s&apos;est rapidement développé pour intégrer 
            ClearSecurity, notre division de sécurité privée.
          </p>
          <p className="mt-4 text-muted leading-relaxed">
            Cette approche intégrée nous permet d&apos;offrir des services de qualité cohérente dans tous les 
            domaines critiques de la vie urbaine, tout en bénéficiant de synergies entre nos différentes divisions.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-xl font-bold text-ink">Notre mission</h2>
        <div className="panel-soft p-6">
          <p className="text-muted leading-relaxed">
            La mission de ClearGroup est de fournir aux habitants de Vice City des services urbains de 
            premier plan, fiables et accessibles. Nous nous engageons à améliorer la qualité de vie 
            dans la ville en assurant le transport en commun, la sécurité et bientôt d&apos;autres services 
            essentiels.
          </p>
          <p className="mt-4 text-muted leading-relaxed">
            Notre approche se veut préventive et proactive, anticipant les besoins de la communauté 
            pour y répondre de manière efficace et innovante.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-xl font-bold text-ink">Nos valeurs</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="panel-soft bg-gradient-to-br from-primary/10 to-primary/5 p-6">
            <h3 className="font-bold text-ink">Excellence</h3>
            <p className="mt-2 text-sm text-muted">
              Nous nous engageons à fournir des services de la plus haute qualité dans toutes nos divisions.
            </p>
          </div>

          <div className="panel-soft bg-gradient-to-br from-accent-light to-white p-6">
            <h3 className="font-bold text-ink">Innovation</h3>
            <p className="mt-2 text-sm text-muted">
              Nous cherchons constamment de nouvelles façons d&apos;améliorer nos services et d&apos;innover.
            </p>
          </div>

          <div className="panel-soft bg-gradient-to-br from-primary-light/80 to-white p-6">
            <h3 className="font-bold text-ink">Intégrité</h3>
            <p className="mt-2 text-sm text-muted">
              Nous agissons avec honnêteté, transparence et respect envers nos clients et nos employés.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-xl font-bold text-ink">Nos divisions</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/clearbus" className="panel-soft flex items-center gap-4 p-4 transition hover:shadow-card-hover">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-primary to-primary-dark text-white shadow-elevated">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" d="M4 7h16c0.55 0 1 0.45 1 1v8c0 0.55-0.45 1-1 1h-1c-0.55 0-1-0.45-1-1v-1H6v1c0 0.55-0.45 1-1 1H4c-0.55 0-1-0.45-1-1V8c0-0.55 0.45-1 1-1z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-ink">ClearBus</p>
              <p className="text-sm text-muted">Transport en commun de Vice City</p>
            </div>
          </Link>

          <Link href="/clearsecurity" className="panel-soft flex items-center gap-4 p-4 transition hover:shadow-card-hover">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-primary to-primary-dark text-white shadow-elevated">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-ink">ClearSecurity</p>
              <p className="text-sm text-muted">Sécurité privée à Vice City</p>
            </div>
          </Link>
        </div>
      </section>

      <section>
        <div className="flex flex-wrap gap-3">
          <Link href="/nos-entreprises" className="btn-primary">
            Découvrir nos entreprises
          </Link>
          <Link href="/recrutement" className="btn-secondary">
            Nous rejoindre
          </Link>
        </div>
      </section>
    </div>
  );
}
