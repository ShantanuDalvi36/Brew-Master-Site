import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

const cannedResponses = [
  "Great choice! Let me think about that… ☕",
  "A classic! You can never go wrong with that one.",
  "Have you tried pairing it with a butter croissant?",
  "Ah, the origin of that bean is fascinating.",
  "If you like that, you should definitely try our cold brew next.",
  "That's one of my personal favorites. Enjoy the rich notes!",
];

const promptMessages = [
  "Need a recommendation?",
  "Looking for something sweet?",
  "Fresh beans make all the difference.",
  "Still deciding?",
  "What are we brewing today?",
  "Have you tried our cold brew?",
  "Every cup tells a story.",
];

export function AIBarista() {
  const [isOpen, setIsOpen] = useState(false);
  const [bubbleText, setBubbleText] = useState<string | null>(null);
  const [isTapping, setIsTapping] = useState(false);
  const blinkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const eyeLeftRef = useRef<HTMLDivElement>(null);
  const eyeRightRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<
    { id: number; text: string; sender: "user" | "barista" }[]
  >([
    { id: 1, text: "Hello! What can I brew for you today?", sender: "barista" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Random blink every 10–15 seconds — adds a class, removes it after animation ends
  useEffect(() => {
    const scheduleBlink = () => {
      const delay = 10000 + Math.random() * 5000; // 10–15s
      blinkTimerRef.current = setTimeout(() => {
        [eyeLeftRef, eyeRightRef].forEach((ref) => {
          ref.current?.classList.add("animate-blink-once");
          ref.current?.addEventListener(
            "animationend",
            () => {
              ref.current?.classList.remove("animate-blink-once");
            },
            { once: true },
          );
        });
        scheduleBlink();
      }, delay);
    };

    scheduleBlink();
    return () => {
      if (blinkTimerRef.current) clearTimeout(blinkTimerRef.current);
    };
  }, []);

  // Idle speech bubble — fades in, pauses, fades out. Never pops.
  useEffect(() => {
    if (isOpen) {
      setBubbleText(null);
      return;
    }

    const showBubble = () => {
      const msg =
        promptMessages[Math.floor(Math.random() * promptMessages.length)];
      setBubbleText(msg);
      setTimeout(() => setBubbleText(null), 4500);
    };

    // First bubble after 7s, then randomly
    const firstTimer = setTimeout(showBubble, 7000);
    const interval = setInterval(() => {
      if (Math.random() < 0.4) showBubble();
    }, 13000);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
    };
  }, [isOpen]);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleMugClick = () => {
    if (isOpen) return;
    setIsTapping(true);
    setBubbleText(null);
    // Wait for the gentle tap animation then open panel
    setTimeout(() => {
      setIsTapping(false);
      setIsOpen(true);
    }, 560);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMsg = {
      id: Date.now(),
      text: inputValue,
      sender: "user" as const,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputValue("");

    setTimeout(() => {
      const response =
        cannedResponses[Math.floor(Math.random() * cannedResponses.length)];
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), text: response, sender: "barista" },
      ]);
    }, 1000);
  };

  return (
    <>
      {/* The Mug Character */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center">
        {/* Speech bubble — fades in/out, never pops */}
        <AnimatePresence>
          {bubbleText && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.55, ease: EASE }}
              className="bg-[#FCF8F3] dark:bg-[#332723] text-foreground px-4 py-2 rounded-2xl rounded-br-sm shadow-[0_4px_20px_rgba(50,35,25,0.08)] mb-4 text-sm font-medium border border-primary/30 max-w-[200px] text-center"
            >
              {bubbleText}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={handleMugClick}
          className={cn(
            "relative w-16 h-16 cursor-pointer focus:outline-none",
            isTapping ? "animate-mug-tap" : "animate-float-sm",
            isOpen && "opacity-0 pointer-events-none",
          )}
          style={{ transition: "opacity 400ms cubic-bezier(0.22,1,0.36,1)" }}
          aria-label="Open AI Barista Chat"
        >
          {/* Steam — rises continuously, slow */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-1">
            <div className="w-[3px] h-4 bg-[#F5EFE6]/65 dark:bg-[#DCCFC2]/45 rounded-full animate-steam" />
            <div className="w-[3px] h-5 bg-[#F5EFE6]/65 dark:bg-[#DCCFC2]/45 rounded-full animate-steam-delay" />
            <div
              className="w-[3px] h-3 bg-[#F5EFE6]/65 dark:bg-[#DCCFC2]/45 rounded-full animate-steam"
              style={{ animationDelay: "0.6s" }}
            />
          </div>

          {/* Mug body */}
          <div className="w-14 h-12 bg-[#FCF8F3] dark:bg-[#332723] border-2 border-primary rounded-b-xl rounded-t-sm absolute bottom-0 left-0 shadow-[0_4px_18px_rgba(50,35,25,0.11)]">
            <div className="absolute top-0 left-0 right-0 h-[6px] bg-primary/75 rounded-t-sm" />
            {/* Face */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-3">
              <div className="flex gap-3 mb-1">
                <div
                  ref={eyeLeftRef}
                  className="w-1.5 h-1.5 bg-[#2B2623] dark:bg-[#F5EFE6] rounded-full"
                  style={{ transformOrigin: "center" }}
                />
                <div
                  ref={eyeRightRef}
                  className="w-1.5 h-1.5 bg-[#2B2623] dark:bg-[#F5EFE6] rounded-full"
                  style={{ transformOrigin: "center", animationDelay: "0.04s" }}
                />
              </div>
              <div className="w-4 h-2 border-b-2 border-[#2B2623] dark:border-[#F5EFE6] rounded-full" />
            </div>
          </div>
          {/* Handle */}
          <div className="w-4 h-6 border-2 border-l-0 border-primary rounded-r-lg absolute bottom-2 -right-2 z-[-1]" />
        </button>
      </div>

      {/* Slide-in Chat Panel — 650ms, luxury easing, no spring overshoot */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-background/70 backdrop-blur-sm z-50 md:hidden"
            />

            <motion.div
              initial={{ x: "100%", opacity: 0.6 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.6 }}
              transition={{ duration: 0.65, ease: EASE }}
              className="fixed top-0 right-0 bottom-0 w-full md:w-[380px] bg-card border-l border-border shadow-2xl z-50 flex flex-col"
            >
              <div className="p-4 border-b border-border flex justify-between items-center bg-secondary/30">
                <div className="flex items-center gap-2">
                  <span className="text-xl">☕</span>
                  <h3 className="font-serif font-semibold text-lg text-foreground">
                    The Barista
                  </h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-muted-foreground rounded-full"
                  style={{
                    transition:
                      "color 350ms cubic-bezier(0.22,1,0.36,1), background-color 350ms cubic-bezier(0.22,1,0.36,1)",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color =
                      "hsl(var(--foreground))")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = "")
                  }
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground self-end rounded-br-sm"
                        : "bg-secondary text-foreground self-start rounded-bl-sm",
                    )}
                  >
                    {msg.text}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-border bg-card">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about a coffee..."
                    className="flex-1 bg-secondary border border-border rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.10)]"
                    style={{
                      transition:
                        "border-color 350ms cubic-bezier(0.22,1,0.36,1), box-shadow 350ms cubic-bezier(0.22,1,0.36,1)",
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="p-2 bg-primary text-primary-foreground rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      transition:
                        "background-color 300ms cubic-bezier(0.22,1,0.36,1), transform 300ms cubic-bezier(0.22,1,0.36,1)",
                    }}
                    onMouseEnter={(e) => {
                      if (inputValue.trim())
                        (e.currentTarget as HTMLElement).style.transform =
                          "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.transform =
                        "scale(1)";
                    }}
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
