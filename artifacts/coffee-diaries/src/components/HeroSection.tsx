import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  imagePath?: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export function HeroSection({ imagePath }: HeroSectionProps) {
  return (
    <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
      {/* Background — fades in and breathes from 0.98 → 1 */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: EASE }}
      >
        {imagePath ? (
          <img
            src={imagePath}
            alt="Perfect coffee overhead"
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="w-full h-full bg-secondary/80" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent dark:from-background dark:via-background/80" />
        <div className="absolute inset-0 bg-black/10 dark:bg-black/40" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mt-20">
        <motion.h1
          className="font-serif text-5xl md:text-7xl font-bold text-white drop-shadow-lg mb-6 leading-tight"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
        >
          Coffee Diaries
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-white/90 font-light mb-10 drop-shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
        >
          Every cup tells a story.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.72, ease: EASE }}
        >
          <Link
            href="/explore"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-medium rounded-full shadow-md"
            style={{
              transition: 'background-color 300ms cubic-bezier(0.22,1,0.36,1), transform 300ms cubic-bezier(0.22,1,0.36,1), box-shadow 300ms cubic-bezier(0.22,1,0.36,1)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1.01)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 28px rgba(50,35,25,0.18)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
              (e.currentTarget as HTMLElement).style.boxShadow = '';
            }}
          >
            Explore Coffees
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
