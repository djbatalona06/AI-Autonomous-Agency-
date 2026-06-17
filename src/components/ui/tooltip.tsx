import type { ReactNode } from "react";

/**
 * Minimal passthrough provider — keeps the same API surface as a full tooltip
 * library without the dependency. Swap for a Radix tooltip if you need rich
 * hover cards later.
 */
export function TooltipProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
