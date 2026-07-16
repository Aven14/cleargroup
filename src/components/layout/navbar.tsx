"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BrandLogo } from "@/components/layout/brand-logo";
import { logoutUser } from "@/actions/auth";
import { cn } from "@/lib/utils";
import { hasRole } from "@/lib/roles";
import type { UserRole } from "@prisma/client";
import { useMemo, useState } from "react";

type NavUser = {
  firstname: string;
  lastname: string;
  roles: UserRole[];
};

type NavItem = {
  href: string;
  label: string;
  matchPrefix?: string;
  children?: NavItem[];
};

function linksForRoles(roles: UserRole[]): NavItem[] {
  const links: NavItem[] = [];

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
  if (hasRole(roles, "ADMIN")) {
    links.push({ href: "/clearbus/admin", label: "Admin" });
  }

  return links;
}

function NavLink({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      prefetch={true}
      onClick={onClick}
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

export function Navbar({ user }: { user: NavUser | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [companiesOpen, setCompaniesOpen] = useState(false);

  const mainLinks = useMemo<NavItem[]>(() => {
    return [
      { href: "/", label: "Accueil" },
      {
        href: "/nos-entreprises",
        label: "Nos entreprises",
        children: [
          { href: "/clearbus", label: "ClearBus" },
          { href: "/clearsecurity", label: "ClearSecurity" },
        ],
      },
      { href: "/recrutement", label: "Recrutement" },
      { href: "/actualites", label: "Actualités" },
      { href: "/a-propos", label: "À propos" },
      { href: "/contact", label: "Contact" },
      ...(user ? linksForRoles(user.roles) : []),
    ];
  }, [user]);

  const handleLogout = async () => {
    await logoutUser();
    router.push("/");
    router.refresh();
  };

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-56 flex-col border-r border-line/70 bg-surface/85 shadow-elevated backdrop-blur-md">
      <div className="border-b border-line/70 px-4 py-4">
        <Link
          href="/"
          prefetch={true}
          className="block transition-opacity hover:opacity-90"
        >
          <BrandLogo compact />
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {mainLinks.map((link) => {
          if (link.children) {
            const isActive = link.matchPrefix
              ? pathname === link.href ||
                pathname.startsWith(`${link.matchPrefix}/`)
              : pathname === link.href;
            const isChildActive = link.children.some(
              (child) =>
                pathname === child.href ||
                (child.matchPrefix && pathname.startsWith(`${child.matchPrefix}/`))
            );

            return (
              <div key={link.href}>
                <button
                  onClick={() => setCompaniesOpen(!companiesOpen)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition",
                    isActive || isChildActive
                      ? "bg-primary text-white shadow-card"
                      : "text-muted hover:bg-primary-light/40 hover:text-primary"
                  )}
                >
                  {link.label}
                  <svg
                    className={cn(
                      "h-4 w-4 transition-transform",
                      companiesOpen ? "rotate-180" : ""
                    )}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {companiesOpen && (
                  <div className="mt-1 space-y-1 pl-4">
                    {link.children.map((child) => (
                      <NavLink
                        key={child.href}
                        href={child.href}
                        label={child.label}
                        active={
                          child.matchPrefix
                            ? pathname === child.href ||
                              pathname.startsWith(`${child.matchPrefix}/`)
                            : pathname === child.href
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
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
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-line/70 px-3 py-4">
        {!user ? (
          <>
            <Link
              href="/clearbus/connexion"
              prefetch={true}
              className="block rounded-md px-3 py-2.5 text-sm font-semibold text-primary hover:bg-primary-light/50"
            >
              Connexion
            </Link>
            <Link
              href="/clearbus/inscription"
              prefetch={true}
              className="btn-primary block px-3 py-2.5 text-center text-sm"
            >
              Inscription
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/clearbus/espace-personnel"
              prefetch={true}
              className={cn(
                "block rounded-md px-3 py-2.5 text-sm font-medium transition",
                pathname === "/clearbus/espace-personnel"
                  ? "bg-primary text-white shadow-card"
                  : "text-muted hover:bg-primary-light/40 hover:text-primary"
              )}
            >
              Mon espace
            </Link>
            <p className="truncate px-3 text-xs text-muted">
              {user.firstname} {user.lastname}
            </p>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-md bg-red-600/90 px-3 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-red-700"
            >
              Déconnexion
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
