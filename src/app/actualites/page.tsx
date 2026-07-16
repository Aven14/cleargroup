export default function ActualitesPage() {
  return (
    <div className="page-enter mx-auto max-w-6xl px-4">
      <section className="panel-highlight relative mb-12 overflow-hidden p-8 md:p-12">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-ink md:text-5xl lg:text-6xl">
            Nos
            <span className="text-gradient-brand"> actualités</span>
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
            Suivez les dernières nouvelles de ClearGroup et de ses divisions ClearBus et ClearSecurity.
          </p>
        </div>
      </section>

      <section>
        <div className="panel-soft p-8 text-center text-muted">
          <p className="text-lg">Aucune actualité pour le moment</p>
          <p className="mt-2 text-sm">Revenez bientôt pour découvrir les dernières nouvelles de ClearGroup.</p>
        </div>
      </section>
    </div>
  );
}
