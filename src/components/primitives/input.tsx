import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: "default" | "bordered" | "underlined" | "filled";
  size?: "sm" | "md" | "lg";
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", variant = "default", size = "md", ...props }, ref) => {
    const variants = {
      default: "border-border-input bg-background placeholder:text-muted-foreground",
      bordered: "border border-input bg-background",
      underlined: "border-b border-input bg-transparent",
      filled: "bg-muted",
    };

    const sizes = {
      sm: "h-9 px-3 text-sm",
      md: "h-10 px-4 text-sm",
      lg: "h-11 px-5 text-base",
    };

    return (
      <input
        ref={ref}
        className={cn(
          "flex h-auto w-full rounded-md border-border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        type={type}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";