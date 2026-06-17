import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "outline" | "ghost" | "destructive";
type Size = "default" | "sm" | "lg" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  default: "bg-primary text-primary-foreground hover:bg-accent",
  outline: "bg-transparent text-foreground hover:bg-secondary",
  ghost: "border-transparent bg-transparent text-foreground hover:bg-secondary",
  destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
};

const sizes: Record<Size, string> = {
  default: "h-11 px-5 text-base",
  sm: "h-9 px-3 text-sm",
  lg: "h-14 px-8 text-lg",
  icon: "h-11 w-11",
};

/**
 * Brutalist button: 2px hard border, 0 radius, and the signature
 * scale-on-active micro-interaction (the real `scale(0.97)`).
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 border-2 border-border font-bold",
        "transition-[transform,background-color,color] duration-150 ease-out",
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
