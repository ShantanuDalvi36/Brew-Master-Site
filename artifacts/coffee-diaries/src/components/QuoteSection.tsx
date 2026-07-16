import React from 'react';

export function QuoteSection() {
  return (
    <section className="py-32 px-6 flex justify-center items-center bg-secondary/20 dark:bg-secondary/5">
      <div className="max-w-4xl text-center">
        <span className="block text-primary/40 dark:text-primary/20 text-6xl font-serif mb-6">"</span>
        <blockquote className="font-serif text-3xl md:text-5xl italic leading-relaxed text-foreground/90">
          Coffee is best enjoyed slowly.
        </blockquote>
      </div>
    </section>
  );
}
