"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Bot, Send, Sparkles, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AI_DISCLAIMER, SUGGESTED_QUESTIONS } from "@/lib/constants";
import { askHealthAI, localHealthAnswer, type AiMessage } from "@/lib/ai";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { cn } from "@/lib/utils";

interface ChatMessage extends AiMessage {
  id: string;
  created_at: string;
}

function buildInitialMessage(): ChatMessage {
  const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  return {
    id: "welcome",
    role: "assistant",
    content: `Hello! 👋 I'm your AI health assistant. Ask me about symptoms, health education, medical reports, or preventive care — I'll do my best to help clearly and safely.\n\nI can also suggest the right specialist for your concern. What's on your mind today? (${today})`,
    created_at: new Date().toISOString(),
  };
}

export function ChatInterface({ userId }: { userId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([buildInitialMessage()]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput("");

    const userMsg: ChatMessage = { id: `u${Date.now()}`, role: "user", content, created_at: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    const history: AiMessage[] = [...messages.slice(-8), { role: "user", content }];

    try {
      const reply = await askHealthAI(history);
      const aiMsg: ChatMessage = {
        id: `a${Date.now()}`,
        role: "assistant",
        content: reply,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      persistChat(userMsg, aiMsg);
    } catch {
      // If the API route failed (offline / no key), use the local knowledge base.
      const reply = localHealthAnswer(content);
      const aiMsg: ChatMessage = {
        id: `a${Date.now()}`,
        role: "assistant",
        content: reply,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      toast.info("Using offline knowledge base — add a Gemini API key for full AI answers.");
    } finally {
      setLoading(false);
    }
  }

  async function persistChat(user: ChatMessage, assistant: ChatMessage) {
    if (!isSupabaseConfigured()) return;
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = await createClient();
      await supabase.from("ai_chats").insert([
        { user_id: userId, role: "user", content: user.content },
        { user_id: userId, role: "assistant", content: assistant.content },
      ]);
    } catch {
      // ignore persistence errors
    }
  }

  return (
    <div className="flex h-[calc(100vh-8.5rem)] flex-col overflow-hidden rounded-2xl border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-gradient-to-r from-primary/10 to-teal/10 px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-teal text-white shadow-lg">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">AI Health Assistant</p>
            <p className="text-xs text-muted-foreground">Powered by Google Gemini · Online</p>
          </div>
        </div>
        <span className="hidden items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 sm:inline-flex dark:text-emerald-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          Available 24/7
        </span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="space-y-4 px-4 py-5 sm:px-6">
          <Alert variant="warning" className="mx-auto max-w-2xl">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Medical disclaimer</AlertTitle>
            <AlertDescription>{AI_DISCLAIMER}</AlertDescription>
          </Alert>

          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={cn("flex gap-3", m.role === "user" ? "justify-end" : "justify-start")}
            >
              {m.role === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[70%]",
                  m.role === "user"
                    ? "rounded-br-sm bg-primary text-primary-foreground"
                    : "rounded-bl-sm border bg-muted/40",
                )}
              >
                {m.content}
              </div>
              {m.role === "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal/15 text-teal">
                  <User className="h-4 w-4" />
                </div>
              )}
            </motion.div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex gap-1.5 rounded-2xl rounded-bl-sm border bg-muted/40 px-4 py-3">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="h-2 w-2 rounded-full bg-muted-foreground/50"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="border-t px-4 py-3">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Try asking
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="shrink-0 rounded-full border bg-muted/30 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex items-end gap-2"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Describe your symptoms, ask about a report, or get a specialist suggestion…"
            className="max-h-32 min-h-[48px] flex-1 resize-none"
            rows={1}
          />
          <Button type="submit" size="icon" disabled={loading || !input.trim()} aria-label="Send">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
