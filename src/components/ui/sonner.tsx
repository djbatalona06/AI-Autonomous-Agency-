import { Toaster as Sonner } from "sonner";

/** Dark Yawn toast host. */
export function Toaster() {
  return (
    <Sonner
      position="bottom-right"
      toastOptions={{
        style: {
          borderRadius: "14px",
          border: "1px solid #23272f",
          background: "#14171c",
          color: "#f4f5f7",
          fontWeight: 500,
        },
      }}
    />
  );
}
