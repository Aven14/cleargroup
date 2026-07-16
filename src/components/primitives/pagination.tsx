import Link from "next/link";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  siblingCount?: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination = ({
  page,
  totalPages,
  siblingCount = 1,
  onPageChange,
  className
}: PaginationProps) => {
  const range = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };

  const paginationRange = () => {
    const leftSiblingIndex = Math.max(0, page - siblingCount);
    const rightSiblingIndex = Math.min(totalPages + 1, page + siblingCount + 1);
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    if (!shouldShowLeftDots && !shouldShowRightDots) {
      return range(1, totalPages);
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);
      return [...leftRange, "...", totalPages];
    }

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [1, "...", ...rightRange];
    }

    const middleRange = range(leftSiblingIndex + 1, rightSiblingIndex - 1);
    return [1, "...", ...middleRange, "...", totalPages];
  };

  return (
    <nav className={cn("flex items-center justify-between pt-4", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className={cn(
              "inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
              page === 1 && "opacity-50"
            )}
          >
            Précédent
          </button>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-sm">
          <span className="text-muted-foreground">
            Page {page} of {totalPages}
          </span>
        </div>
      </div>
      <div className="flex justify-end items-center gap-1">
        <div className="flex items-center gap-1">
          {paginationRange().map((pageNumber, index) => {
            if (pageNumber === "...") {
              return (
                <span key="dots" className="flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium">
                  ...
                </span>
              );
            }

            const isActive = pageNumber === page;
            return (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={cn(
                  "flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  isActive && "bg-primary-100 text-primary-900"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className={cn(
              "inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
              page === totalPages && "opacity-50"
            )}
          >
            Suivant
          </button>
        </div>
      </div>
    </nav>
  );
};