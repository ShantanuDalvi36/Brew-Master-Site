import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  imagePath?: string;
}

const ease = [0.22, 1, 0.36, 1] as const;

export function HeroSection({ imagePath }: HeroSectionProps) {
  return (
    <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
      {/* Background Image — fades in and scales from 0.98 → 1 */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease }}
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
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent dark:from-background dark:via-background/80" />
        <div className="absolute inset-0 bg-black/10 dark:bg-black/40" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mt-20">
        {/* Heading fades upward */}
        <motion.h1
          className="font-serif text-5xl md:text-7xl font-bold text-white drop-shadow-lg mb-6 leading-tight"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease }}
        >
          Coffee Diaries
        </motion.h1>

        {/* Paragraph fades upward with slight delay */}
        <motion.p
          className="text-xl md:text-2xl text-white/90 font-light mb-10 drop-shadow-md"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease }}
        >
          Every cup tells a story.
        </motion.p>

        {/* Button fades in last */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65, ease }}
        >
          <Link
            href="/explore"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-medium rounded-full hover:bg-primary/85 hover:scale-[1.02] hover:shadow-lg active:scale-95 transition-all duration-300 shadow-md"
          >
            Explore Coffees
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
