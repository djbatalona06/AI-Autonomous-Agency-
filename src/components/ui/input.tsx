import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full h-11 px-3 bg-card text-foreground border-2 border-border",
        "placeholder:text-muted-foreground",
        "focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
        "disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
