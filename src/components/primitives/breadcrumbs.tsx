import Link from "next/link";
import { cn } from "@/lib/utils";
import { Separator } from "./separator";

interface BreadcrumbItem {
  href?: string;
  label: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs = ({ items, className }: BreadcrumbsProps) => {
  return (
    <nav
      className={cn("flex items-center flex-wrap gap-1 text-sm text-muted-foreground", className)}
      aria-label="breadcrumb"
    >
      <ol className="flex items-center flex-wrap gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {!isLast && (
                <Link href={item.href!} className="text-muted-foreground hover:text-neutral-900/80">
                  {item.label}
                </Link>
              )}
              {isLast && (
                <span className="text-neutral-900/80">{item.label}</span>
              )}
              {!isLast && (
                <Separator orientation="vertical" className="h-4" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};