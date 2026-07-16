import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

const cannedResponses = [
  "Great choice! Let me think about that... ☕",
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
  "Have you tried our cold brew?",
];

export function AIBarista() {
  const [isOpen, setIsOpen] = useState(false);
  const [bubbleText, setBubbleText] = useState<string | null>(null);
  const [isBouncing, setIsBouncing] = useState(false);
  
  const [messages, setMessages] = useState<{id: number, text: string, sender: 'user' | 'barista'}[]>([
    { id: 1, text: "Hello! What can I brew for you today?", sender: 'barista' }
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Bubble logic
  useEffect(() => {
    if (isOpen) {
      setBubbleText(null);
      return;
    }

    const interval = setInterval(() => {
      // 20% chance to show a bubble every 5 seconds if not open
      if (Math.random() < 0.2) {
        const randomMsg = promptMessages[Math.floor(Math.random() * promptMessages.length)];
        setBubbleText(randomMsg);
        
        // Hide after 4 seconds
        setTimeout(() => {
          setBubbleText(null);
        }, 4000);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleMugClick = () => {
    setIsBouncing(true);
    setBubbleText(null);
    setTimeout(() => {
      setIsBouncing(false);
      setIsOpen(true);
    }, 400); // Wait for bounce animation
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMsg = { id: Date.now(), text: inputValue, sender: 'user' as const };
    setMessages(prev => [...prev, newMsg]);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      const response = cannedResponses[Math.floor(Math.random() * cannedResponses.length)];
      setMessages(prev => [...prev, { id: Date.now(), text: response, sender: 'barista' }]);
    }, 1000);
  };

  return (
    <>
      {/* The Mug Character */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center">
        <AnimatePresence>
          {bubbleText && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="bg-[#FCF8F3] dark:bg-[#332723] text-foreground px-4 py-2 rounded-2xl rounded-br-sm shadow-[0_4px_20px_rgba(50,35,25,0.10)] mb-4 text-sm font-medium border border-primary/40 max-w-[200px] text-center"
            >
              {bubbleText}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={handleMugClick}
          className={cn(
            "relative w-16 h-16 cursor-pointer focus:outline-none transition-transform hover:scale-105",
            isBouncing ? "animate-bounce-sm" : "animate-float",
            isOpen && "opacity-0 pointer-events-none" // Hide when chat is open
          )}
          aria-label="Open AI Barista Chat"
        >
          {/* Steam — soft cream wisps */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-1">
            <div className="w-[3px] h-4 bg-[#F5EFE6]/70 dark:bg-[#DCCFC2]/50 rounded-full animate-steam"></div>
            <div className="w-[3px] h-5 bg-[#F5EFE6]/70 dark:bg-[#DCCFC2]/50 rounded-full animate-steam-delay"></div>
            <div className="w-[3px] h-3 bg-[#F5EFE6]/70 dark:bg-[#DCCFC2]/50 rounded-full animate-steam" style={{ animationDelay: '0.5s' }}></div>
          </div>

          {/* Mug Body — soft ivory cup */}
          <div className="w-14 h-12 bg-[#FCF8F3] dark:bg-[#332723] border-2 border-primary rounded-b-xl rounded-t-sm absolute bottom-0 left-0 shadow-[0_4px_16px_rgba(50,35,25,0.12)]">
            {/* Coffee fill — dark maroon top strip */}
            <div className="absolute top-0 left-0 right-0 h-[6px] bg-primary/80 rounded-t-sm" />
            {/* Face */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-3">
              <div className="flex gap-3 mb-1">
                <div className="w-1.5 h-1.5 bg-[#2B2623] dark:bg-[#F5EFE6] rounded-full animate-blink"></div>
                <div className="w-1.5 h-1.5 bg-[#2B2623] dark:bg-[#F5EFE6] rounded-full animate-blink"></div>
              </div>
              <div className="w-4 h-2 border-b-2 border-[#2B2623] dark:border-[#F5EFE6] rounded-full"></div>
            </div>
          </div>
          {/* Handle */}
          <div className="w-4 h-6 border-2 border-l-0 border-primary rounded-r-lg absolute bottom-2 -right-2 z-[-1]"></div>
        </button>
      </div>

      {/* Slide-in Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:hidden"
            />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full md:w-[380px] bg-card border-l border-border shadow-2xl z-50 flex flex-col"
            >
              <div className="p-4 border-b border-border flex justify-between items-center bg-secondary/30">
                <div className="flex items-center gap-2">
                  <span className="text-xl">☕</span>
                  <h3 className="font-serif font-semibold text-lg text-foreground">The Barista</h3>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors"
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
                      msg.sender === 'user' 
                        ? "bg-primary text-primary-foreground self-end rounded-br-sm" 
                        : "bg-secondary text-foreground self-start rounded-bl-sm"
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
                    className="flex-1 bg-secondary border border-border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                  <button 
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
