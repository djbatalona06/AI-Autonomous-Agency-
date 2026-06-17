import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 text-center">
      <div>
        <p className="text-8xl font-extrabold text-primary">404</p>
        <h1 className="text-3xl font-extrabold mt-4">Page not found</h1>
        <p className="text-muted-foreground mt-2 mb-8">That page doesn't exist (yet).</p>
        <Link href="/">
          <Button size="lg">← Back home</Button>
        </Link>
      </div>
    </div>
  );
}
