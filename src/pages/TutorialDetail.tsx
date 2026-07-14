import { Link, useLocation, useParams } from "wouter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft } from "lucide-react";
import { getTutorial } from "@/lib/tutorials";
import { getVertical } from "@/data/verticals";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";
import { Seo } from "@/components/Seo";
import { BRAND } from "@/data/brand";

/** Internal links (starting with "/") route client-side via wouter; everything else is a normal anchor. */
function MarkdownLink({ href, children }: { href?: string; children?: React.ReactNode }) {
  const [, navigate] = useLocation();
  if (href?.startsWith("/")) {
    return (
      <a
        href={href}
        className="text-primary underline font-semibold"
        onClick={(e) => {
          e.preventDefault();
          navigate(href);
        }}
      >
        {children}
      </a>
    );
  }
  return (
    <a href={href} className="text-primary underline font-semibold" target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

export default function TutorialDetail() {
  const { slug = "" } = useParams();
  const tutorial = getTutorial(slug);

  if (!tutorial) {
    return (
      <div className="min-h-screen bg-background">
        <SiteNav />
        <main className="pt-16 max-w-6xl mx-auto px-4 sm:px-6 py-24 text-center">
          <h1 className="font-serif text-4xl font-semibold mb-4">Tutorial not found.</h1>
          <p className="text-muted-foreground mb-8">That guide doesn't exist.</p>
          <Link href="/tutorials"><Button>Back to tutorials</Button></Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const vertical = getVertical(tutorial.vertical);
  const path = `/tutorials/${tutorial.slug}`;
  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: tutorial.title,
    description: tutorial.description,
    url: `${BRAND.url}${path}`,
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo title={tutorial.title} description={tutorial.description} path={path} jsonLd={[howToJsonLd]} />
      <SiteNav />
      <main className="pt-16">
        <article className="max-w-2xl mx-auto px-4 sm:px-6 pt-14 sm:pt-20 pb-24">
          <Link
            href="/tutorials"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft size={16} /> All tutorials
          </Link>

          {vertical && (
            <span className="font-mono text-xs text-muted-foreground border border-border rounded-full px-3 py-1.5">
              {vertical.name} · {tutorial.persona}
            </span>
          )}
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold tracking-tight mt-4 leading-tight">
            {tutorial.title}
          </h1>

          <div className="prose-tutorial mt-8 space-y-4 text-base leading-relaxed text-foreground/90">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => <h1 className="text-2xl font-bold mt-8 mb-2">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl font-bold mt-8 mb-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-lg font-bold mt-6 mb-2">{children}</h3>,
                p: ({ children }) => <p>{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-5 space-y-1.5">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1.5">{children}</ol>,
                a: MarkdownLink,
                strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
              }}
            >
              {tutorial.body}
            </ReactMarkdown>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
