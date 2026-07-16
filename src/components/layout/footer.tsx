import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200/10 mt-20 pt-10 text-center text-sm text-muted">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-6 flex flex-wrap justify-center gap-6">
          <Link href="/" className="hover:text-primary transition">
            Accueil
          </Link>
          <Link href="/clearbus" className="hover:text-primary transition">
            ClearBus
          </Link>
          <Link href="/clearsecurity" className="hover:text-primary transition">
            ClearSecurity
          </Link>
          <Link href="/recrutement" className="hover:text-primary transition">
            Recrutement
          </Link>
          <Link href="/a-propos" className="hover:text-primary transition">
            À propos
          </Link>
          <Link href="/contact" className="hover:text-primary transition">
            Contact
          </Link>
        </div>
        <p>© {new Date().getFullYear()} ClearGroup. Tous droits réservés.</p>
      </div>
    </footer>
  );
}