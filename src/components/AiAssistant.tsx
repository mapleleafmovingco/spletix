import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ReactMarkdown from "react-markdown";
import { Cpu, Send, X } from "lucide-react";

export function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
    if (open && !busy) inputRef.current?.focus();
  }, [messages, open, busy]);

  const submit = () => {
    const text = input.trim();
    if (!text || busy) return;
    sendMessage({ text });
    setInput("");
  };

  return (
    <>
      <button
        aria-label="Open AI assistant"
        onClick={() => setOpen((o) => !o)}
        className="glow-ring fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
      >
        {open ? <X className="size-6" /> : <Cpu className="size-6" />}
      </button>
      {open && (
        <div className="glass-panel fixed bottom-24 right-6 z-50 flex h-[32rem] w-[min(24rem,calc(100vw-3rem))] flex-col overflow-hidden rounded-2xl">
          <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Cpu className="size-4" />
            </span>
            <div>
              <p className="text-sm font-semibold">Forge</p>
              <p className="text-xs text-muted-foreground">Stackforge AI assistant</p>
            </div>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto p-4 text-sm">
            {messages.length === 0 && (
              <p className="text-muted-foreground">
                Hi! Ask me about building web apps, AI automation, cloud, or how we'd approach your project.
              </p>
            )}
            {messages.map((m) => (
              <div key={m.id} className={m.role === "user" ? "flex justify-end" : ""}>
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[85%] rounded-2xl bg-primary px-3 py-2 text-primary-foreground"
                      : "prose prose-sm prose-invert max-w-none"
                  }
                >
                  {m.parts.map((p, i) =>
                    p.type === "text" ? <ReactMarkdown key={i}>{p.text}</ReactMarkdown> : null,
                  )}
                </div>
              </div>
            ))}
            {status === "submitted" && <p className="animate-pulse text-muted-foreground">Thinking…</p>}
            {error && <p className="text-destructive">The assistant is unavailable right now. Please try again shortly.</p>}
            <div ref={endRef} />
          </div>
          <div className="flex items-end gap-2 border-t border-border/60 p-3">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              placeholder="Ask about your project…"
              className="max-h-28 flex-1 resize-none rounded-xl bg-secondary px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={submit}
              disabled={busy || !input.trim()}
              aria-label="Send"
              className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-50"
            >
              <Send className="size-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
