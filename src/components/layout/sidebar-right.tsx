"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { hasRole } from "@/lib/roles";
import type { UserRole } from "@prisma/client";
import { useMemo } from "react";

type NavUser = {
  firstname: string;
  lastname: string;
  roles: UserRole[];
};

type NavItem = {
  href: string;
  label: string;
  matchPrefix?: string;
};

function linksForRoles(roles: UserRole[], isInClearBus: boolean, isInClearSecurity: boolean, isInClearRescue: boolean): NavItem[] {
  const links: NavItem[] = [];

  if (isInClearBus) {
    if (hasRole(roles, "DRIVER") || hasRole(roles, "ADMIN")) {
      links.push(
        { href: "/clearbus/chauffeur", label: "Mon service" },
        { href: "/clearbus/chauffeur/annonces", label: "Annonces" },
        { href: "/clearbus/chauffeur/bannis", label: "Personnes bannies" }
      );
    }
    if (hasRole(roles, "CONTROLLER") || hasRole(roles, "ADMIN")) {
      links.push({ href: "/clearbus/controleur", label: "Contrôle" });
    }
  }
  if (isInClearSecurity) {
    if (hasRole(roles, "SECURITY") || hasRole(roles, "ADMIN")) {
      links.push(
        { href: "/clearsecurity/interne/tableau-de-bord", label: "Tableau de bord" },
        { href: "/clearsecurity/interne/prise-service", label: "Prise de service" },
        { href: "/clearsecurity/interne/patrouilles", label: "Patrouilles" },
        { href: "/clearsecurity/interne/alertes", label: "Alertes" },
        { href: "/clearsecurity/interne/detenus", label: "Personnes détenues" },
        { href: "/clearsecurity/interne/debriefings", label: "Débriefings" },
        { href: "/clearsecurity/interne/agents", label: "Agents" },
        { href: "/clearsecurity/interne/planning", label: "Planning" }
      );
    }
  }
  if (isInClearRescue) {
    if (hasRole(roles, "AMBULANCIER") || hasRole(roles, "ADMIN")) {
      links.push(
        { href: "/clearrescue/interne/tableau-de-bord", label: "Tableau de bord" },
        { href: "/clearrescue/interne/prise-service", label: "Prise de service" },
        { href: "/clearrescue/interne/patrouilles", label: "Interventions" },
        { href: "/clearrescue/interne/alertes", label: "Alertes" },
        { href: "/clearrescue/interne/dossiers", label: "Dossiers" },
        { href: "/clearrescue/interne/debriefings", label: "Débriefings" },
        { href: "/clearrescue/interne/agents", label: "Ambulanciers" },
        { href: "/clearrescue/interne/planning", label: "Planning" }
      );
    }
  }

  return links;
}

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      prefetch={true}
      className={cn(
        "block rounded-md px-3 py-2.5 text-sm font-medium transition",
        active
          ? "bg-primary text-white shadow-card"
          : "text-muted hover:bg-primary-light/40 hover:text-primary"
      )}
    >
      {label}
    </Link>
  );
}

export function SidebarRight({ user }: { user: NavUser | null }) {
  const pathname = usePathname();

  const sidebarLinks = useMemo<NavItem[]>(() => {
    const isInClearBus = pathname.startsWith('/clearbus');
    const isInClearSecurity = pathname.startsWith('/clearsecurity');
    const isInClearRescue = pathname.startsWith('/clearrescue');
    
    if (!user || (!isInClearBus && !isInClearSecurity && !isInClearRescue)) {
      return [];
    }
    
    return linksForRoles(user.roles, isInClearBus, isInClearSecurity, isInClearRescue);
  }, [user, pathname]);

  const isInClearBus = pathname.startsWith('/clearbus');
  const isInClearSecurity = pathname.startsWith('/clearsecurity');
  const isInClearRescue = pathname.startsWith('/clearrescue');

  if (!user || (!isInClearBus && !isInClearSecurity && !isInClearRescue) || sidebarLinks.length === 0) {
    return null;
  }

  return (
    <aside className="fixed right-0 top-0 z-50 flex h-screen w-56 flex-col border-l border-line/70 bg-surface/85 shadow-elevated backdrop-blur-md">
      <div className="border-b border-line/70 px-4 py-4">
        <h2 className="text-sm font-bold text-ink">
          {isInClearBus ? "ClearBus" : isInClearSecurity ? "ClearSecurity" : "ClearRescue"}
        </h2>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {sidebarLinks.map((link) => (
          <NavLink
            key={link.href}
            href={link.href}
            label={link.label}
            active={
              link.matchPrefix
                ? pathname === link.href ||
                  pathname.startsWith(`${link.matchPrefix}/`)
                : pathname === link.href
            }
          />
        ))}
      </nav>

      <div className="space-y-2 border-t border-line/70 px-3 py-4">
        <p className="truncate px-3 text-xs text-muted">
          {user.firstname} {user.lastname}
        </p>
      </div>
    </aside>
  );
}
