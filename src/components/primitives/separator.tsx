import { cn } from "@/lib/utils";

interface SeparatorProps extends React.HTMLAttributes<HTMLHRElement> {
  className?: string;
  orientation?: "horizontal" | "vertical";
  variant?: "default";
}

export const Separator = React.forwardRef<HTMLHRElement, SeparatorProps>(
  ({ className, orientation = "horizontal", variant = "default", ...props }, ref) => {
    const horizontalClass = "h-0.5 flex-1 bg-border";
    const verticalClass = "w-0.5 flex-none bg-border";

    return (
      <hr
        ref={ref}
        className={cn(
          (orientation === "horizontal" ? horizontalClass : verticalClass),
          className
        )}
        {...props}
      />
    );
  }
);
Separator.displayName = "Separator";