import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "outline" | "ghost" | "destructive";
type Size = "default" | "sm" | "lg" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  default:
    "border border-transparent bg-primary text-primary-foreground hover:bg-accent shadow-[0_10px_30px_-14px_var(--color-primary)]",
  outline: "border border-border bg-transparent text-foreground hover:bg-secondary hover:border-faint",
  ghost: "border border-transparent bg-transparent text-muted-foreground hover:bg-secondary hover:text-foreground",
  destructive: "border border-transparent bg-destructive text-destructive-foreground hover:opacity-90",
};

const sizes: Record<Size, string> = {
  default: "h-11 px-5 text-base rounded-full",
  sm: "h-9 px-4 text-sm rounded-full",
  lg: "h-14 px-8 text-lg rounded-full",
  icon: "h-11 w-11 rounded-full",
};

/**
 * Stackgrid pill button: rounded-full, soft border, warm glow on the primary
 * variant, and the signature scale-on-active micro-interaction.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold",
        "transition-[transform,background-color,color,border-color,box-shadow] duration-150 ease-out",
        "active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";
