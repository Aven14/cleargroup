import { cn } from "@/lib/utils";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive" | "success" | "warning";
  className?: string;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-background text-muted-foreground",
      destructive: "border-destructive/50 text-destructive",
      success: "border-success/50 text-success",
      warning: "border-warning/50 text-warning",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full rounded-lg border p-4 text-sm [&>svg~*]:pl-3 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:h-4 [&>svg]:w-4",
          variants[variant],
          className
        )}
        role="alert"
        {...props}
      />
    );
  }
);
Alert.displayName = "Alert";

// Sous- composants pour le titre et la description
Alert.Title = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <h4
      ref={ref}
      className={cn("mb-2 font-medium leading-none", className)}
      {...props}
    />
  )
);
Alert.Title.displayName = "Alert.Title";

Alert.Description = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm", className)}
      {...props}
    />
  )
);
Alert.Description.displayName = "Alert.Description";