import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block w-4 h-4 border-2 border-current border-t-transparent animate-spin",
        className,
      )}
    />
  );
}
