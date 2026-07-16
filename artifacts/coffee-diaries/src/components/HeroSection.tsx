import React from 'react';
import { Link } from 'wouter';

interface HeroSectionProps {
  imagePath?: string;
}

export function HeroSection({ imagePath }: HeroSectionProps) {
  return (
    <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {imagePath ? (
          <img 
            src={imagePath} 
            alt="Perfect coffee overhead" 
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="w-full h-full bg-secondary/80" />
        )}
        {/* Subtle gradient overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent dark:from-background dark:via-background/80" />
        <div className="absolute inset-0 bg-black/10 dark:bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mt-20">
        <h1 className="font-serif text-5xl md:text-7xl font-bold text-white drop-shadow-lg mb-6 leading-tight">
          Coffee Diaries
        </h1>
        <p className="text-xl md:text-2xl text-white/90 font-light mb-10 drop-shadow-md">
          Every cup tells a story.
        </p>
        <Link 
          href="/explore"
          className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-medium rounded-full hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg"
        >
          Explore Coffees
        </Link>
      </div>
    </section>
  );
}
