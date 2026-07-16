import { cn } from "@/lib/utils";

function LogoMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-primary to-primary-dark shadow-elevated",
        className
      )}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="h-[55%] w-[55%] max-h-6 max-w-6" fill="none">
        {/* Logo ClearGroup - bâtiment stylisé */}
        <path
          d="M3 21h18V9l-9-7-9 7v12z"
          fill="white"
        />
        {/* Fenêtres */}
        <rect x="6" y="11" width="3" height="3" rx="0.5" fill="#194A78" />
        <rect x="10.5" y="11" width="3" height="3" rx="0.5" fill="#194A78" />
        <rect x="15" y="11" width="3" height="3" rx="0.5" fill="#194A78" />
        <rect x="6" y="15" width="3" height="3" rx="0.5" fill="#194A78" />
        <rect x="10.5" y="15" width="3" height="3" rx="0.5" fill="#194A78" />
        <rect x="15" y="15" width="3" height="3" rx="0.5" fill="#194A78" />
        {/* Porte */}
        <rect x="10.5" y="19" width="3" height="2" rx="0.5" fill="#26BBDC" />
      </svg>
    </div>
  );
}

export function BrandLogo({
  compact = false,
  light = false,
  variant = "default",
  className,
}: {
  compact?: boolean;
  light?: boolean;
  variant?: "default" | "navbarCenter";
  className?: string;
}) {
  if (variant === "navbarCenter") {
    return (
      <div className={cn("flex items-center gap-2.5 sm:gap-3", className)}>
        <LogoMark className={compact ? "h-9 w-9" : "h-10 w-10"} />
        <div className="min-w-0 leading-tight">
          <span
            className={cn(
              "block text-[0.8125rem] font-extrabold tracking-tight sm:text-base",
              light ? "text-white" : "text-ink"
            )}
          >
            Clear
            <span className={light ? "text-white" : "text-gradient-brand"}>Group</span>
          </span>
          <span
            className={cn(
              "mt-0.5 block text-[9px] font-semibold uppercase tracking-widest sm:text-[10px]",
              light ? "text-white/75" : "text-muted"
            )}
          >
            Services urbains
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <LogoMark className={compact ? "h-9 w-9" : "h-11 w-11"} />
      <div className="leading-tight">
        <span
          className={cn(
            "block text-sm font-bold tracking-tight",
            light ? "text-white" : "text-ink"
          )}
        >
          Clear
        </span>
        <span
          className={cn(
            "block text-base font-extrabold tracking-tight",
            light ? "text-white" : "text-gradient-brand"
          )}
        >
          Group
        </span>
        {!compact && (
          <span
            className={cn(
              "mt-0.5 block text-[10px] font-medium uppercase tracking-wider",
              light ? "text-white/70" : "text-muted"
            )}
          >
            Services urbains
          </span>
        )}
      </div>
    </div>
  );
}
