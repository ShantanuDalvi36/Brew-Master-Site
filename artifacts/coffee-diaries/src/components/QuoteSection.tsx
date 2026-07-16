import React from 'react';
import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;

export function QuoteSection() {
  return (
    <motion.section
      className="py-32 px-6 flex justify-center items-center bg-secondary/20 dark:bg-secondary/5"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className="max-w-4xl text-center">
        <span className="block text-primary/40 dark:text-primary/20 text-6xl font-serif mb-6">"</span>
        <blockquote className="font-serif text-3xl md:text-5xl italic leading-relaxed text-foreground/90">
          Coffee is best enjoyed slowly.
        </blockquote>
      </div>
    </motion.section>
  );
}
