"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type SecurityNavItem = {
  href: string;
  label: string;
  icon: string;
  matchPrefix?: string;
  isInternal?: boolean;
};

const securityNavItems: SecurityNavItem[] = [
  { href: "/clearsecurity", label: "Accueil", icon: "🏠", matchPrefix: "/clearsecurity", isInternal: false },
  { href: "/clearsecurity/services", label: "Services", icon: "🛡️", matchPrefix: "/clearsecurity/services", isInternal: false },
  { href: "/clearsecurity/recrutement", label: "Recrutement", icon: "📝", matchPrefix: "/clearsecurity/recrutement", isInternal: false },
  { href: "/clearsecurity/contact", label: "Contact", icon: "📞", matchPrefix: "/clearsecurity/contact", isInternal: false },
  { href: "/clearsecurity/interne", label: "Tableau de bord", icon: "📊", matchPrefix: "/clearsecurity/interne", isInternal: true },
  { href: "/clearsecurity/interne/prise-service", label: "Prise de service", icon: "👤", matchPrefix: "/clearsecurity/interne/prise-service", isInternal: true },
  { href: "/clearsecurity/interne/patrouilles", label: "Patrouilles", icon: "🚔", matchPrefix: "/clearsecurity/interne/patrouilles", isInternal: true },
  { href: "/clearsecurity/interne/debriefings", label: "Débriefings", icon: "📋", matchPrefix: "/clearsecurity/interne/debriefings", isInternal: true },
  { href: "/clearsecurity/interne/alertes", label: "Alertes", icon: "🚨", matchPrefix: "/clearsecurity/interne/alertes", isInternal: true },
  { href: "/clearsecurity/interne/detenus", label: "Personnes détenues", icon: "🔒", matchPrefix: "/clearsecurity/interne/detenus", isInternal: true },
  { href: "/clearsecurity/interne/agents", label: "Agents", icon: "👥", matchPrefix: "/clearsecurity/interne/agents", isInternal: true },
  { href: "/clearsecurity/interne/planning", label: "Planning", icon: "📅", matchPrefix: "/clearsecurity/interne/planning", isInternal: true },
  { href: "/clearsecurity/interne/parametres", label: "Paramètres", icon: "⚙️", matchPrefix: "/clearsecurity/interne/parametres", isInternal: true },
];

function SecurityNavLink({
  href,
  label,
  icon,
  active,
  isInternal,
}: {
  href: string;
  label: string;
  icon: string;
  active: boolean;
  isInternal?: boolean;
}) {
  return (
    <Link
      href={href}
      prefetch={true}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition",
        active
          ? "bg-primary text-white shadow-card"
          : "text-muted hover:bg-primary-light/40 hover:text-primary"
      )}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </Link>
  );
}

export function SecuritySidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleBack = () => {
    router.push("/");
  };

  const publicItems = securityNavItems.filter((item) => !item.isInternal);
  const internalItems = securityNavItems.filter((item) => item.isInternal);

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-56 flex-col border-r border-line/70 bg-surface/85 shadow-elevated backdrop-blur-md">
      <div className="border-b border-line/70 px-4 py-4">
        <button
          onClick={handleBack}
          className="mb-3 flex items-center gap-2 text-sm font-medium text-muted hover:text-primary transition"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour à ClearGroup
        </button>
        <h2 className="text-lg font-bold text-ink">ClearSecurity</h2>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <div className="mb-2">
          <p className="px-3 py-1 text-xs font-semibold text-muted uppercase tracking-wider">
            Public
          </p>
        </div>
        {publicItems.map((item) => (
          <SecurityNavLink
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            active={
              item.matchPrefix
                ? pathname === item.href ||
                  pathname.startsWith(`${item.matchPrefix}/`)
                : pathname === item.href
            }
            isInternal={item.isInternal}
          />
        ))}

        {internalItems.length > 0 && (
          <>
            <div className="my-4 border-t border-line/70" />
            <div className="mb-2">
              <p className="px-3 py-1 text-xs font-semibold text-accent uppercase tracking-wider">
                Interne
              </p>
            </div>
            {internalItems.map((item) => (
              <SecurityNavLink
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={
                  item.matchPrefix
                    ? pathname === item.href ||
                      pathname.startsWith(`${item.matchPrefix}/`)
                    : pathname === item.href
                }
                isInternal={item.isInternal}
              />
            ))}
          </>
        )}
      </nav>

      <div className="border-t border-line/70 px-3 py-4">
        <Link
          href="/"
          className="block rounded-md px-3 py-2.5 text-sm font-medium text-muted hover:bg-primary-light/40 hover:text-primary transition"
        >
          Quitter ClearSecurity
        </Link>
      </div>
    </aside>
  );
}
