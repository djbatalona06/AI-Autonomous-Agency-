import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Renders markdown with brutalist typography. Replaces the Manus `Streamdown`. */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="space-y-3 text-sm leading-relaxed text-foreground">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="text-xl font-extrabold text-foreground">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-bold text-foreground">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base font-bold text-foreground">{children}</h3>,
          p: ({ children }) => <p className="text-foreground/90">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-5 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1">{children}</ol>,
          a: ({ children, href }) => (
            <a href={href} className="text-primary underline font-semibold" target="_blank" rel="noreferrer">
              {children}
            </a>
          ),
          code: ({ children }) => (
            <code className="bg-secondary px-1 py-0.5 text-foreground">{children}</code>
          ),
          strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

/**
 * Long-form markdown for policy / legal documents. Same renderer + plugins as
 * {@link Markdown}, but with spacing, heading scale, tables, blockquotes and
 * code blocks tuned for readable full-page documents in the brutalist theme.
 */
export function PolicyMarkdown({ children }: { children: string }) {
  return (
    <div className="space-y-4 text-base leading-relaxed text-foreground">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mt-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground mt-8 border-b-2 border-border pb-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-bold text-foreground mt-6">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-bold text-foreground mt-4">{children}</h4>
          ),
          p: ({ children }) => <p className="text-foreground/90">{children}</p>,
          ul: ({ children }) => (
            <ul className="list-disc pl-6 space-y-1.5 text-foreground/90">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-6 space-y-1.5 text-foreground/90">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          a: ({ children, href }) => (
            <a
              href={href}
              className="text-primary underline font-semibold break-words"
              target="_blank"
              rel="noreferrer"
            >
              {children}
            </a>
          ),
          em: ({ children }) => <em className="text-muted-foreground not-italic">{children}</em>,
          strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary bg-secondary/40 pl-4 py-2 text-foreground/90 italic">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="border-t-2 border-border my-8" />,
          code: ({ children, className }) => {
            // Fenced code blocks get a className like `language-…`; inline does not.
            const isBlock = typeof className === "string" && className.includes("language-");
            if (isBlock) {
              return (
                <code className={`block w-full text-sm font-mono ${className ?? ""}`}>{children}</code>
              );
            }
            return (
              <code className="bg-secondary px-1.5 py-0.5 text-sm font-mono text-foreground">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="border-2 border-border bg-card p-4 overflow-x-auto text-sm">{children}</pre>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto border-2 border-border">
              <table className="w-full border-collapse text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-secondary">{children}</thead>,
          th: ({ children }) => (
            <th className="border-2 border-border px-3 py-2 text-left font-extrabold uppercase tracking-wide text-xs">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-2 border-border px-3 py-2 align-top text-foreground/90">{children}</td>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
