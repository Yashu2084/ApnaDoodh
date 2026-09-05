"use client";

import { FormEvent, ReactNode, useEffect, useRef, useState, KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Bot, MapPin, X, Send, MessageCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";
import { actionPaths, AssistantAction, AssistantResponse, pageGreeting } from "@/lib/aiKnowledge";
import { useLocation } from "@/components/LocationProvider";

type Message = AssistantResponse & { id: string; role: "assistant" | "user"; failed?: boolean };
const storageKey = "apnadoodh-assistant-chat";

const premiumWelcomeMessage = "Hello! 👋 Welcome to ApnaDoodh. I can help you explore our dairy products and navigate the website. How can I help you today?";

const premiumQuickActions = [
  { label: "Explore Milk", prompt: "Show me milk products" },
  { label: "Track Order", prompt: "How do I track my order?" },
  { label: "Contact Us", prompt: "How do I contact support?" },
];

export default function ChatWindow({ trigger }: { trigger?: ReactNode }) {
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
  }, [messages, sending, open]);

  // Adjust textarea height automatically
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`;
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
        action: "OPEN_WHATSAPP", actionLabel: "Contact Support",
      }]);
    } finally {
      setSending(false);
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

  const formatMessage = (msg: string) => {
    return msg.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        {i !== msg.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="fixed bottom-[calc(1.5rem+3.5rem+1.25rem)] right-6 z-[60] flex flex-col items-end">
      <AnimatePresence>
        {open && (
          <motion.section 
            initial={{ opacity: 0, y: 12, scale: 0.97 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 12, scale: 0.97, transition: { duration: 0.15 } }} 
            className="absolute bottom-[calc(100%+16px)] right-0 flex flex-col overflow-hidden bg-white rounded-[1.25rem] border border-slate-200/80 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.15)] 
                       w-[calc(100vw-48px)] sm:w-[320px] md:w-[350px] lg:w-[360px] 
                       h-[calc(100dvh-150px)] sm:h-[420px] md:h-[480px] lg:h-[520px] max-h-[min(600px,calc(100dvh-120px))]"
          >
            {/* Minimal Corporate Header */}
            <header className="flex items-center justify-between bg-white border-b border-slate-100 px-4 py-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-blue-50/50 border border-slate-100">
                  <img src="/assets/ai-mascot.png" alt="ApnaDoodh AI" className="h-full w-full object-cover scale-110" />
                </div>
                <div>
                  <h2 className="text-[13px] font-bold text-slate-800">ApnaDoodh Assistant</h2>
                  <p className="text-[11px] font-medium text-slate-500">Your dairy & website guide</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors" aria-label="Close chat">
                <X className="h-4 w-4" />
              </button>
            </header>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto bg-slate-50/50 p-4 scroll-smooth">
              <div className="space-y-4 pb-2">
                {messages.map((item) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={item.id} 
                    className={item.role === "user" ? "flex justify-end" : "flex justify-start"}
                  >
                    <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] sm:text-[14px] leading-[1.5] shadow-sm ${
                      item.role === "user" 
                        ? "rounded-br-sm bg-slate-800 text-white" 
                        : "rounded-bl-sm border border-slate-200/60 bg-white text-slate-700"
                    }`}>
                      <p className="whitespace-pre-wrap font-medium">{formatMessage(item.message)}</p>
                      
                      {item.action && (
                        <button 
                          onClick={() => runAction(item.action)} 
                          className="mt-2.5 w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors active:scale-95"
                        >
                          {item.action === "CHANGE_LOCATION" && <MapPin className="h-3 w-3" />}
                          {item.actionLabel || "Take Action"}
                          <ArrowUp className="h-3 w-3 ml-0.5 rotate-45 opacity-60" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
                
                {/* Typing Indicator */}
                {sending && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex">
                    <div className="rounded-2xl rounded-bl-sm border border-slate-100 bg-white px-3.5 py-3 shadow-sm">
                      <span className="flex items-center gap-1">
                        <i className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-300" />
                        <i className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-300 [animation-delay:150ms]" />
                        <i className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-300 [animation-delay:300ms]" />
                      </span>
                    </div>
                  </motion.div>
                )}
                <div ref={endRef} className="h-1" />
              </div>
            </div>

            {/* Input Area */}
            <div className="shrink-0 border-t border-slate-100 bg-white p-3">
              {messages.length < 3 && (
                <div className="mb-2.5 flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
                  {premiumQuickActions.map((quick) => (
                    <button 
                      key={quick.label} 
                      onClick={() => void send(quick.prompt)} 
                      disabled={sending} 
                      className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-colors disabled:opacity-40 whitespace-nowrap"
                    >
                      {quick.label}
                    </button>
                  ))}
                </div>
              )}
              
              <form onSubmit={submit} className="relative flex items-end gap-2 rounded-xl border border-slate-200 bg-slate-50/50 p-1 focus-within:border-slate-300 focus-within:bg-white transition-all">
                <textarea 
                  ref={textareaRef}
                  value={input} 
                  onChange={(event) => setInput(event.target.value)} 
                  onKeyDown={handleKeyDown}
                  maxLength={600} 
                  rows={1}
                  placeholder="Type a message..." 
                  className="min-w-0 flex-1 resize-none bg-transparent px-3 py-2 text-[13px] font-medium text-slate-800 placeholder-slate-400 outline-none" 
                  disabled={sending}
                />
                <button 
                  type="submit" 
                  disabled={!input.trim() || sending} 
                  className="mb-0.5 mr-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-white transition-all hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 active:scale-95" 
                  aria-label="Send message"
                >
                  <Send className="h-3.5 w-3.5 ml-0.5" />
                </button>
              </form>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Floating Mascot Button */}
      <motion.button 
        onClick={() => { setOpen((current) => !current); addGreeting(); }} 
        whileHover={{ scale: 1.05 }} 
        whileTap={{ scale: 0.95 }} 
        className="flex h-[44px] w-[44px] sm:h-[48px] sm:w-[48px] md:h-[52px] md:w-[52px] items-center justify-center rounded-full bg-white shadow-lg border border-slate-200 hover:shadow-xl transition-all z-50 overflow-hidden"
        aria-label="Open ApnaDoodh Assistant"
      >
        {open ? (
          <X className="h-5 w-5 sm:h-6 sm:w-6 text-slate-500" />
        ) : (
          <img src="/assets/ai-mascot.png" alt="ApnaDoodh Assistant" className="h-[135%] w-[135%] object-cover object-center mt-2.5" />
        )}
      </motion.button>
    </div>
  );
}
