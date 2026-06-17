import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

interface Msg {
  role: "user" | "assistant";
  text: string;
}

const GREETING: Msg = {
  role: "assistant",
  text: "Hey, I'm Yawn's assistant. Ask me about image generation, web crawling, or automating your marketing.",
};

/** Site-wide floating AI chat agent. */
export function ChatAgent() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();

  const send = trpc.chat.send.useMutation({
    onSuccess: (data) => setMessages((m) => [...m, { role: "assistant", text: data.reply }]),
    onError: () =>
      setMessages((m) => [...m, { role: "assistant", text: "Sorry — I couldn't answer that just now." }]),
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, send.isPending]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || send.isPending) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    send.mutate({ message: text });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close assistant" : "Open assistant"}
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 border-2 border-border bg-primary text-primary-foreground text-2xl font-bold shadow-[4px_4px_0_0_#2d1b3d] active:scale-[0.97] transition-transform"
      >
        <span aria-hidden>{open ? "✕" : "💬"}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-24 right-5 z-50 w-[min(92vw,360px)] h-[480px] flex flex-col border-2 border-border bg-card shadow-[6px_6px_0_0_#2d1b3d]"
            initial={reduce ? false : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            role="dialog"
            aria-label="Yawn assistant"
          >
            <div className="border-b-2 border-border bg-primary text-primary-foreground px-4 py-3">
              <p className="font-extrabold">Yawn Assistant</p>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={
                    m.role === "user"
                      ? "ml-auto max-w-[85%] border-2 border-border bg-primary text-primary-foreground px-3 py-2 text-sm font-medium"
                      : "mr-auto max-w-[85%] border-2 border-border bg-secondary text-secondary-foreground px-3 py-2 text-sm"
                  }
                >
                  {m.text}
                </div>
              ))}
              {send.isPending && (
                <div className="mr-auto border-2 border-border bg-secondary px-3 py-2">
                  <Spinner className="text-foreground" />
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="border-t-2 border-border p-3 flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything…"
                aria-label="Message"
                disabled={send.isPending}
              />
              <Button type="submit" size="sm" disabled={send.isPending || !input.trim()}>
                Send
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
