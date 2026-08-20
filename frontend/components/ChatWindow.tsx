"use client";

import { FormEvent, ReactNode, useEffect, useRef, useState, KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Bot, MapPin, RefreshCw, X, Sparkles, Send } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";
import { actionPaths, AssistantAction, AssistantResponse, pageGreeting } from "@/lib/aiKnowledge";
import { useLocation } from "@/components/LocationProvider";

type Message = AssistantResponse & { id: string; role: "assistant" | "user"; failed?: boolean };
const storageKey = "apnadoodh-ai-chat-v2";

const premiumWelcomeMessage = "Hello! 👋 I'm your ApnaDoodh Dairy Assistant.\n\nI can help you explore milk and dairy products, understand their benefits, find products, answer questions, and guide you around ApnaDoodh. 🥛";

const premiumQuickActions = [
  { label: "🥛 Explore Milk", prompt: "Show me milk products" },
  { label: "🧀 Dairy Products", prompt: "What dairy products can I explore?" },
  { label: "💪 Health Benefits", prompt: "What are the health benefits of milk?" },
  { label: "🛒 Find Products", prompt: "Help me find products" },
  { label: "🚚 Track My Order", prompt: "How do I track my order?" },
  { label: "🧭 Help Me Navigate", prompt: "Help me navigate the website" },
];

export default function ChatWindow({ trigger }: { trigger: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { openLocationModal } = useLocation();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) setMessages(JSON.parse(saved) as Message[]);
    } catch { /* Ignore */ }
  }, []);

  useEffect(() => {
    if (messages.length) sessionStorage.setItem(storageKey, JSON.stringify(messages));
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  // Adjust textarea height automatically
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const addGreeting = () => {
    if (messages.length) return;
    setMessages([{ id: crypto.randomUUID(), role: "assistant", message: pageGreeting(pathname) || premiumWelcomeMessage }]);
  };

  const runAction = (action?: AssistantAction) => {
    if (!action) return;
    if (action === "CHANGE_LOCATION") return openLocationModal();
    if (action === "OPEN_WHATSAPP" || action === "CONTACT_SUPPORT") {
      window.open("https://wa.me/918279579636?text=Hi%20ApnaDoodh%2C%20I%20need%20help.", "_blank", "noopener,noreferrer");
      return;
    }
    const path = actionPaths[action];
    if (path) router.push(path);
  };

  const send = async (text: string) => {
    const prompt = text.trim();
    if (!prompt || sending) return;
    const userMessage: Message = { id: crypto.randomUUID(), role: "user", message: prompt };
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setSending(true);
    try {
      const response = await fetch(`${API_URL}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt, page: pathname, history: messages.slice(-6).map(({ role, message }) => ({ role, message })) }),
      });
      const data = await response.json() as AssistantResponse;
      if (!response.ok || !data.message) throw new Error("Unable to get a response");
      setMessages((current) => [...current, { ...data, id: crypto.randomUUID(), role: "assistant" }]);
    } catch {
      setMessages((current) => [...current, {
        id: crypto.randomUUID(), role: "assistant", failed: true,
        message: "I couldn't connect just now. Please try again, or contact our support team on WhatsApp.",
        action: "OPEN_WHATSAPP", actionLabel: "Open WhatsApp",
      }]);
    } finally {
      setSending(false);
      // Focus back to input after sending on desktop
      if (window.innerWidth >= 640 && textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send(input);
    }
  };

  const submit = (event: FormEvent) => { event.preventDefault(); void send(input); };

  // Helper to format newlines in messages
  const formatMessage = (msg: string) => {
    return msg.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        {i !== msg.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="fixed bottom-[5.5rem] right-4 sm:right-6 z-[60] flex flex-col items-end sm:bottom-[6.5rem]">
      <AnimatePresence>
        {open && (
          <motion.section 
            initial={{ opacity: 0, y: 16, scale: 0.96 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 16, scale: 0.96, transition: { duration: 0.2 } }} 
            transition={{ type: "spring", damping: 25, stiffness: 300 }} 
            className="mb-4 flex flex-col overflow-hidden bg-white sm:rounded-[1.75rem] sm:border sm:border-slate-200/60 shadow-[0_30px_80px_rgba(0,0,0,0.15)] ring-1 ring-black/5 
                       fixed inset-0 sm:static sm:h-[min(650px,calc(100dvh-11rem))] sm:w-[26rem] w-full h-[100dvh]"
            style={{ 
              height: open && typeof window !== 'undefined' && window.innerWidth < 640 ? '100dvh' : undefined 
            }}
          >
            {/* Header */}
            <header className="flex items-center justify-between bg-gradient-to-r from-emerald-800 to-emerald-600 px-5 py-4 text-white shadow-sm shrink-0 safe-top">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 backdrop-blur-md shadow-inner border border-white/20">
                    <Sparkles className="h-5 w-5 text-emerald-50" />
                  </span>
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 border-2 border-emerald-700"></span>
                </div>
                <div>
                  <h2 className="text-sm font-bold tracking-wide">ApnaDoodh AI</h2>
                  <div className="flex items-center gap-1.5 opacity-90">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                    <p className="text-[11px] font-medium tracking-wide">Online • Dairy Assistant</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors" aria-label="Close chat">
                <X className="h-4.5 w-4.5" />
              </button>
            </header>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto bg-slate-50/50 p-4 sm:p-5 scroll-smooth">
              <div className="space-y-4 pb-2">
                {messages.map((item) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={item.id} 
                    className={item.role === "user" ? "flex justify-end" : "flex justify-start"}
                  >
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed shadow-sm ${
                      item.role === "user" 
                        ? "rounded-br-sm bg-emerald-600 text-white shadow-emerald-600/20" 
                        : "rounded-bl-sm border border-slate-100 bg-white text-slate-700"
                    }`}>
                      <p className="whitespace-pre-wrap font-medium">{formatMessage(item.message)}</p>
                      
                      {item.action && (
                        <button 
                          onClick={() => runAction(item.action)} 
                          className="mt-3 w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-colors active:scale-95"
                        >
                          {item.action === "CHANGE_LOCATION" && <MapPin className="h-3.5 w-3.5" />}
                          {item.failed && <RefreshCw className="h-3.5 w-3.5" />}
                          {item.actionLabel || "Take Action"}
                          <ArrowUp className="h-3.5 w-3.5 ml-0.5 rotate-45 opacity-60" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
                
                {/* Typing Indicator */}
                {sending && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex">
                    <div className="rounded-2xl rounded-bl-sm border border-slate-100 bg-white px-4 py-3.5 shadow-sm">
                      <span className="inline-flex items-center gap-1.5">
                        <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-400" />
                        <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-400 [animation-delay:150ms]" />
                        <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-400 [animation-delay:300ms]" />
                      </span>
                    </div>
                  </motion.div>
                )}
                <div ref={endRef} className="h-1" />
              </div>
            </div>

            {/* Input Area */}
            <div className="shrink-0 border-t border-slate-200/60 bg-white p-3 sm:p-4 pb-[max(env(safe-area-inset-bottom),1rem)]">
              {/* Quick Actions (only show if no messages yet or few messages to keep UI clean) */}
              {messages.length < 3 && (
                <div className="mb-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
                  {premiumQuickActions.map((quick) => (
                    <button 
                      key={quick.label} 
                      onClick={() => void send(quick.prompt)} 
                      disabled={sending} 
                      className="shrink-0 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[11px] font-semibold text-slate-600 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50 transition-colors disabled:opacity-40 whitespace-nowrap shadow-sm"
                    >
                      {quick.label}
                    </button>
                  ))}
                </div>
              )}
              
              <form onSubmit={submit} className="relative flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50/50 p-1.5 focus-within:border-emerald-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all">
                <textarea 
                  ref={textareaRef}
                  value={input} 
                  onChange={(event) => setInput(event.target.value)} 
                  onKeyDown={handleKeyDown}
                  maxLength={600} 
                  rows={1}
                  placeholder="Ask me anything..." 
                  className="min-w-0 flex-1 resize-none bg-transparent px-3 py-2.5 text-[13px] font-medium text-slate-800 placeholder-slate-400 outline-none" 
                  disabled={sending}
                />
                <button 
                  type="submit" 
                  disabled={!input.trim() || sending} 
                  className="mb-0.5 mr-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm transition-all hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600 active:scale-95" 
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4 ml-0.5" />
                </button>
              </form>
              <div className="mt-2 text-center">
                <p className="text-[9px] font-medium text-slate-400">AI can make mistakes. Please verify important information.</p>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button 
        onClick={() => { setOpen((current) => !current); addGreeting(); }} 
        whileHover={{ scale: 1.05 }} 
        whileTap={{ scale: 0.95 }} 
        animate={!open ? { y: [0, -4, 0] } : { y: 0 }} 
        transition={!open ? { repeat: Infinity, duration: 4, ease: "easeInOut" } : {}} 
        className={`relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border border-emerald-400/30 bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-[0_12px_36px_rgba(16,185,129,0.35)] hover:shadow-[0_16px_48px_rgba(16,185,129,0.45)] transition-shadow z-50 ${open && typeof window !== 'undefined' && window.innerWidth < 640 ? 'hidden' : ''}`} 
        aria-label="Open ApnaDoodh AI Assistant"
      >
        {!open && (
          <span className="absolute inset-0 rounded-full animate-ping bg-emerald-400/30 duration-1000" style={{ animationDuration: '3s' }}></span>
        )}
        
        {open ? <X className="h-6 w-6 sm:h-7 sm:w-7" /> : <Sparkles className="h-6 w-6 sm:h-7 sm:w-7" />}
        
        {!open && (
          <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full border-2 border-white bg-red-500 shadow-sm" />
        )}
      </motion.button>
    </div>
  );
}
