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
