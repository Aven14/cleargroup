import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="page-enter mx-auto max-w-6xl px-4">
      <section className="panel-highlight relative mb-12 overflow-hidden p-8 md:p-12">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-ink md:text-5xl lg:text-6xl">
            Contactez
            <span className="text-gradient-brand"> ClearSecurity</span>
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
            Pour toute demande de devis, information ou candidature, n&apos;hésitez pas à nous contacter.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="panel-soft p-6">
            <h2 className="mb-4 text-lg font-bold text-ink">Informations de contact</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-muted">Adresse</p>
                <p className="text-ink">123 Avenue de la Sécurité<br />Vice City, VC 10001</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted">Téléphone</p>
                <p className="text-ink">+1 (555) 123-4567</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted">Email</p>
                <p className="text-ink">contact@clearsecurity.vc</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted">Horaires</p>
                <p className="text-ink">24h/24 - 7j/7</p>
              </div>
            </div>
          </div>

          <div className="panel-soft p-6">
            <h2 className="mb-4 text-lg font-bold text-ink">Envoyez-nous un message</h2>
            <form className="space-y-4">
              <div>
                <label className="label-caps block mb-2">Nom complet</label>
                <input type="text" className="input-field w-full" placeholder="Votre nom" />
              </div>
              <div>
                <label className="label-caps block mb-2">Email</label>
                <input type="email" className="input-field w-full" placeholder="votre@email.com" />
              </div>
              <div>
                <label className="label-caps block mb-2">Sujet</label>
                <select className="input-field w-full">
                  <option>Demande de devis</option>
                  <option>Information sur les services</option>
                  <option>Candidature spontanée</option>
                  <option>Autre</option>
                </select>
              </div>
              <div>
                <label className="label-caps block mb-2">Message</label>
                <textarea className="input-field w-full min-h-[120px]" placeholder="Votre message..." />
              </div>
              <button type="submit" className="btn-primary w-full">
                Envoyer le message
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-xl font-bold text-ink">Nos autres divisions</h2>
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

          <Link href="/" className="panel-soft flex items-center gap-4 p-4 transition hover:shadow-card-hover">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-primary to-primary-dark text-white shadow-elevated">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-ink">ClearGroup</p>
              <p className="text-sm text-muted">Notre groupe et toutes nos divisions</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
