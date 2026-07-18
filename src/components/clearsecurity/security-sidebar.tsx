"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type SecurityNavItem = {
  href: string;
  label: string;
  icon: string;
  matchPrefix?: string;
};

const securityNavItems: SecurityNavItem[] = [
  { href: "/clearsecurity/interne", label: "Tableau de bord", icon: "🏠", matchPrefix: "/clearsecurity/interne" },
  { href: "/clearsecurity/interne/prise-service", label: "Prise de service", icon: "👤", matchPrefix: "/clearsecurity/interne/prise-service" },
  { href: "/clearsecurity/interne/patrouilles", label: "Patrouilles", icon: "🚔", matchPrefix: "/clearsecurity/interne/patrouilles" },
  { href: "/clearsecurity/interne/debriefings", label: "Débriefings", icon: "📋", matchPrefix: "/clearsecurity/interne/debriefings" },
  { href: "/clearsecurity/interne/alertes", label: "Alertes", icon: "🚨", matchPrefix: "/clearsecurity/interne/alertes" },
  { href: "/clearsecurity/interne/detenus", label: "Personnes détenues", icon: "🔒", matchPrefix: "/clearsecurity/interne/detenus" },
  { href: "/clearsecurity/interne/agents", label: "Agents", icon: "👥", matchPrefix: "/clearsecurity/interne/agents" },
  { href: "/clearsecurity/interne/planning", label: "Planning", icon: "📅", matchPrefix: "/clearsecurity/interne/planning" },
  { href: "/clearsecurity/interne/parametres", label: "Paramètres", icon: "⚙️", matchPrefix: "/clearsecurity/interne/parametres" },
];

function SecurityNavLink({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: string;
  active: boolean;
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
    router.push("/clearsecurity");
  };

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
          Retour à ClearSecurity
        </button>
        <h2 className="text-lg font-bold text-ink">Module Interne</h2>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {securityNavItems.map((item) => (
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
          />
        ))}
      </nav>

      <div className="border-t border-line/70 px-3 py-4">
        <Link
          href="/clearsecurity"
          className="block rounded-md px-3 py-2.5 text-sm font-medium text-muted hover:bg-primary-light/40 hover:text-primary transition"
        >
          Quitter le module
        </Link>
      </div>
    </aside>
  );
}
