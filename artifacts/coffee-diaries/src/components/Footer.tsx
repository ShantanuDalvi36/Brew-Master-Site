import React from 'react';
import { Link } from 'wouter';

export function Footer() {
  return (
    <footer className="bg-secondary/30 dark:bg-card border-t border-border py-16 mt-20">
      <div className="max-w-[1280px] mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="font-serif text-2xl font-bold text-primary dark:text-primary-foreground mb-4">
            Coffee Diaries
          </h2>
          <p className="text-muted-foreground max-w-sm">
            A quiet journal dedicated to the art, science, and ritual of exceptional coffee. Take your time, sip slowly.
          </p>
        </div>
        <div className="md:text-right flex flex-col gap-2">
          <div className="flex flex-col md:flex-row md:justify-end gap-6 mb-4">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">Home</Link>
            <Link href="/explore" className="text-foreground hover:text-primary transition-colors">Explore Collection</Link>
          </div>
          <p className="text-sm text-muted-foreground/70">
            &copy; {new Date().getFullYear()} Coffee Diaries. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
