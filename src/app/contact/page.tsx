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
            <span className="text-gradient-brand"> ClearGroup</span>
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
            Pour toute question sur nos services ou nos divisions, n&apos;hésitez pas à nous contacter.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="panel-soft p-6">
            <h2 className="mb-4 text-lg font-bold text-ink">Informations générales</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-muted">Adresse</p>
                <p className="text-ink">Siège social<br />123 Avenue des Services<br />Vice City, VC 10001</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted">Email général</p>
                <p className="text-ink">contact@cleargroup.vc</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted">Horaires</p>
                <p className="text-ink">Lun - Ven : 9h - 18h</p>
              </div>
            </div>
          </div>

          <div className="panel-soft p-6">
            <h2 className="mb-4 text-lg font-bold text-ink">Contactez nos divisions</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-muted">ClearBus</p>
                <p className="text-ink">support@clearbus.vc</p>
                <Link href="/clearbus" className="text-sm text-primary hover:text-primary-dark">
                  Visiter le site ClearBus →
                </Link>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted">ClearSecurity</p>
                <p className="text-ink">contact@clearsecurity.vc</p>
                <Link href="/clearsecurity" className="text-sm text-primary hover:text-primary-dark">
                  Visiter le site ClearSecurity →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-xl font-bold text-ink">Envoyez-nous un message</h2>
        <div className="panel-soft p-6">
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
              <label className="label-caps block mb-2">Division concernée</label>
              <select className="input-field w-full">
                <option value="">Sélectionnez une division</option>
                <option value="cleargroup">ClearGroup (général)</option>
                <option value="clearbus">ClearBus</option>
                <option value="clearsecurity">ClearSecurity</option>
              </select>
            </div>
            <div>
              <label className="label-caps block mb-2">Sujet</label>
              <input type="text" className="input-field w-full" placeholder="Sujet de votre message" />
            </div>
            <div>
              <label className="label-caps block mb-2">Message</label>
              <textarea className="input-field w-full min-h-[120px]" placeholder="Votre message..." />
            </div>
            <button type="submit" className="btn-primary">
              Envoyer le message
            </button>
          </form>
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-xl font-bold text-ink">Liens rapides</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/nos-entreprises" className="panel-soft flex items-center gap-4 p-4 transition hover:shadow-card-hover">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-primary to-primary-dark text-white shadow-elevated">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-ink">Nos entreprises</p>
              <p className="text-sm text-muted">Découvrir nos divisions</p>
            </div>
          </Link>

          <Link href="/recrutement" className="panel-soft flex items-center gap-4 p-4 transition hover:shadow-card-hover">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-primary to-primary-dark text-white shadow-elevated">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-ink">Recrutement</p>
              <p className="text-sm text-muted">Nous rejoindre</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
