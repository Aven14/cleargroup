"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type ClearBusNavItem = {
  href: string;
  label: string;
  icon: string;
  matchPrefix?: string;
  isInternal?: boolean;
};

const clearBusNavItems: ClearBusNavItem[] = [
  { href: "/clearbus", label: "Accueil", icon: "🏠", matchPrefix: "/clearbus", isInternal: false },
  { href: "/clearbus/tableau-de-bord", label: "Tableau de bord", icon: "📊", matchPrefix: "/clearbus/tableau-de-bord", isInternal: false },
  { href: "/clearbus/lignes", label: "Lignes", icon: "🚌", matchPrefix: "/clearbus/lignes", isInternal: false },
  { href: "/clearbus/espace-personnel", label: "Espace personnel", icon: "👤", matchPrefix: "/clearbus/espace-personnel", isInternal: false },
  { href: "/clearbus/chauffeur", label: "Espace chauffeur", icon: "🚗", matchPrefix: "/clearbus/chauffeur", isInternal: true },
  { href: "/clearbus/controleur", label: "Contrôle billets", icon: "🎫", matchPrefix: "/clearbus/controleur", isInternal: true },
];

function ClearBusNavLink({
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

export function ClearBusSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleBack = () => {
    router.push("/");
  };

  const publicItems = clearBusNavItems.filter((item) => !item.isInternal);
  const internalItems = clearBusNavItems.filter((item) => item.isInternal);

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
        <h2 className="text-lg font-bold text-ink">ClearBus</h2>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <div className="mb-2">
          <p className="px-3 py-1 text-xs font-semibold text-muted uppercase tracking-wider">
            Public
          </p>
        </div>
        {publicItems.map((item) => (
          <ClearBusNavLink
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
            <div className="mt-6 mb-2">
              <p className="px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider">
                Interne
              </p>
            </div>
            {internalItems.map((item) => (
              <ClearBusNavLink
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
          Quitter ClearBus
        </Link>
      </div>
    </aside>
  );
}
