import { Toaster as Sonner } from "sonner";

/** Brutalist-styled toast host. */
export function Toaster() {
  return (
    <Sonner
      position="bottom-right"
      toastOptions={{
        style: {
          borderRadius: "0px",
          border: "2px solid #2d1b3d",
          background: "#f5f1f8",
          color: "#2d1b3d",
          fontWeight: 600,
        },
      }}
    />
  );
}
