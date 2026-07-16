import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const coffeeFacts = [
  "Ethiopia is widely regarded as the birthplace of coffee.",
  "Arabica beans generally contain less caffeine than Robusta.",
  "Espresso is a brewing method, not a type of bean.",
  "Freshly ground coffee loses aroma within minutes of grinding.",
  "Water quality significantly affects coffee flavor.",
  "The crema on espresso comes from trapped gases and coffee oils.",
  "Finland consumes the most coffee per capita in the world.",
  "Coffee was originally chewed, not brewed, by early Ethiopian tribes.",
  "The word 'coffee' derives from the Arabic word 'qahwa'.",
  "A coffee plant can live for up to 200 years.",
  "It takes about 40 coffee beans to make a single espresso shot.",
  "The first webcam was invented to monitor a coffee pot at Cambridge University.",
  "Cold brew coffee can take 12 to 24 hours to steep properly.",
  "The Maillard reaction is responsible for coffee's rich, complex aroma.",
  "Light roast coffee has slightly more caffeine than dark roast by volume.",
  "Coffee is one of the most traded commodities in the world.",
  "Decaf coffee still contains small amounts of caffeine.",
  "The flat white originated in Australia or New Zealand in the 1980s.",
  "Single-origin coffees showcase the unique terroir of a specific region.",
  "The ideal brewing temperature for coffee is between 90°C and 96°C.",
  "Robusta beans have almost twice the caffeine content of Arabica.",
  "Brazil produces roughly one-third of the world's coffee supply.",
  "Café au lait and a latte are similar but use different milk ratios.",
  "Kopi luwak is one of the rarest and most expensive coffees in the world.",
  "The Americano was created to mimic drip coffee for American soldiers in WWII.",
  "Pour-over brewing preserves more subtle floral and fruity notes in the cup.",
  "Grinding coffee too fine causes over-extraction and bitterness.",
  "A cappuccino is traditionally equal parts espresso, steamed milk, and foam.",
  "Coffee cherries are a fruit — red or yellow when perfectly ripe.",
  "Caffeine works by blocking adenosine receptors in the brain.",
  "Dry-processed coffees tend to taste fruitier and more complex.",
  "French press coffee retains more natural oils than paper-filtered coffee.",
  "Altitude plays a major role in developing coffee bean complexity and acidity.",
  "Specialty coffee is graded on a 100-point sensory quality scale.",
  "The AeroPress was invented in 2005 by toy designer Alan Adler.",
  "Robusta is often preferred for espresso blends for its thick, persistent crema.",
  "Colombia is renowned for its consistently high-quality, mild Arabica coffee.",
  "Cascara is a tea brewed from dried coffee cherry husks.",
  "A ristretto is a shorter, more concentrated extraction than a standard espresso.",
  "Japan has a thriving specialty coffee scene built around meticulous pour-over craft.",
  "The drip coffee machine was popularized in the United States in the 1970s.",
  "Shade-grown coffee is considered more environmentally sustainable.",
  "Coffee beans are seeds found inside the coffee cherry fruit.",
  "Nitro cold brew is infused with nitrogen gas for a naturally creamy texture.",
  "Honey-processed coffee uses a fermentation method that adds fruity sweetness.",
];

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [fact] = useState(() => coffeeFacts[Math.floor(Math.random() * coffeeFacts.length)]);

  useEffect(() => {
    const duration = 1800;
    const interval = 16;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        const next = Math.min(prev + step, 100);
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 320);
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
    >
      {/* Animated mug */}
      <div className="relative w-24 h-20 mb-10">
        {/* Steam wisps */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-[6px]">
          <div className="w-[3px] h-6 bg-primary/25 rounded-full animate-steam" />
          <div className="w-[3px] h-8 bg-primary/25 rounded-full animate-steam-delay" />
          <div className="w-[3px] h-5 bg-primary/25 rounded-full animate-steam" style={{ animationDelay: '0.5s' }} />
        </div>

        {/* Mug body with fill */}
        <div className="w-20 h-16 border-2 border-primary rounded-b-2xl rounded-t-sm absolute bottom-0 left-0 overflow-hidden bg-[#FCF8F3] dark:bg-[#332723]">
          <div
            className="absolute bottom-0 left-0 right-0 bg-primary/65 rounded-b-2xl"
            style={{
              height: `${progress}%`,
              transition: 'height 80ms linear',
            }}
          />
        </div>
        {/* Handle */}
        <div className="w-5 h-8 border-2 border-l-0 border-primary rounded-r-xl absolute bottom-2 -right-3 z-[-1]" />
      </div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="font-serif text-3xl font-bold text-primary dark:text-primary-foreground mb-2"
      >
        Coffee Diaries
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-muted-foreground text-sm mb-10"
      >
        Preparing your next cup…
      </motion.p>

      {/* Progress bar */}
      <div className="w-48 h-[2px] bg-border rounded-full overflow-hidden mb-8">
        <div
          className="h-full bg-primary rounded-full"
          style={{ width: `${progress}%`, transition: 'width 80ms linear' }}
        />
      </div>

      {/* Coffee fact */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.7 }}
        className="text-xs text-muted-foreground/60 max-w-[260px] text-center italic leading-relaxed"
      >
        ☕ {fact}
      </motion.p>
    </motion.div>
  );
}
