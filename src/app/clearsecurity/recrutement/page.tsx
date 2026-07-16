import Link from "next/link";

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
            <span className="text-gradient-brand"> ClearSecurity</span>
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
            Devenez agent de sécurité et rejoignez une équipe dynamique au service de Vice City.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-xl font-bold text-ink">Nos critères de recrutement</h2>
        <div className="panel-soft p-6">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-accent flex-shrink-0" />
              <span className="text-muted">Âge minimum : 21 ans</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-accent flex-shrink-0" />
              <span className="text-muted">Casier judiciaire vierge</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-accent flex-shrink-0" />
              <span className="text-muted">Bonne condition physique</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-accent flex-shrink-0" />
              <span className="text-muted">Savoir-faire relationnel et sang-froid</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-accent flex-shrink-0" />
              <span className="text-muted">Disponibilité pour travailler en horaires décalés</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-xl font-bold text-ink">Ce que nous offrons</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="panel-soft bg-gradient-to-br from-primary/10 to-primary/5 p-6">
            <h3 className="font-bold text-ink">Formation complète</h3>
            <p className="mt-2 text-sm text-muted">
              Formation professionnelle aux techniques de sécurité et aux protocoles d&apos;intervention.
            </p>
          </div>

          <div className="panel-soft bg-gradient-to-br from-accent-light to-white p-6">
            <h3 className="font-bold text-ink">Salaires compétitifs</h3>
            <p className="mt-2 text-sm text-muted">
              Rémunération attractive selon l&apos;expérience et les qualifications.
            </p>
          </div>

          <div className="panel-soft bg-gradient-to-br from-primary-light/80 to-white p-6">
            <h3 className="font-bold text-ink">Évolution de carrière</h3>
            <p className="mt-2 text-sm text-muted">
              Perspectives d&apos;évolution vers des postes d&apos;encadrement et de spécialisation.
            </p>
          </div>

          <div className="panel-soft bg-gradient-to-br from-primary/10 to-primary/5 p-6">
            <h3 className="font-bold text-ink">Équipements fournis</h3>
            <p className="mt-2 text-sm text-muted">
              Uniformes et équipements de sécurité mis à disposition par l&apos;entreprise.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-xl font-bold text-ink">Processus de recrutement</h2>
        <div className="panel-soft p-6">
          <ol className="space-y-4">
            <li className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white font-bold text-sm">
                1
              </span>
              <div>
                <h4 className="font-semibold text-ink">Candidature</h4>
                <p className="text-sm text-muted">Envoyez votre CV et lettre de motivation via notre formulaire de contact.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white font-bold text-sm">
                2
              </span>
              <div>
                <h4 className="font-semibold text-ink">Entretien</h4>
                <p className="text-sm text-muted">Premier entretien pour évaluer votre motivation et vos compétences.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white font-bold text-sm">
                3
              </span>
              <div>
                <h4 className="font-semibold text-ink">Vérifications</h4>
                <p className="text-sm text-muted">Vérification du casier judiciaire et des références.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white font-bold text-sm">
                4
              </span>
              <div>
                <h4 className="font-semibold text-ink">Intégration</h4>
                <p className="text-sm text-muted">Formation d&apos;intégration et prise de poste.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section>
        <div className="flex flex-wrap gap-3">
          <Link href="/clearsecurity/contact" className="btn-primary">
            Postuler maintenant
          </Link>
          <Link href="/clearsecurity/presentation" className="btn-secondary">
            En savoir plus sur nous
          </Link>
        </div>
      </section>
    </div>
  );
}
