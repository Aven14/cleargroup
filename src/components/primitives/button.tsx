import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, ...props }, ref) => {
    const Component = asChild ? React.Fragment : "button";

    const variants = {
      primary: "bg-primary-600 text-primary-50 hover:bg-primary-700",
      secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200",
      tertiary: "border border-neutral-200 bg-neutral-50 text-neutral-900 hover:bg-neutral-100",
      ghost: "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50",
      link: "text-primary-600 hover:text-primary-700 underline underline-offset-4",
    };

    const sizes = {
      sm: "h-9 px-3 text-sm",
      md: "h-10 px-4 py-2 text-sm font-medium",
      lg: "h-11 px-5 py-2.5 text-base font-medium",
    };

    return (
      <Component
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";