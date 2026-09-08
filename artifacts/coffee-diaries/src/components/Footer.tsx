import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;

export function Footer() {
  return (
    <motion.footer
      className="bg-secondary/30 dark:bg-card border-t border-border py-16 mt-20"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, ease: EASE }}
    >
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
            <Link
              href="/"
              className="text-foreground/75"
              style={{ transition: 'color 350ms cubic-bezier(0.22,1,0.36,1)' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'hsl(var(--primary))')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '')}
            >
              Home
            </Link>
            <Link
              href="/explore"
              className="text-foreground/75"
              style={{ transition: 'color 350ms cubic-bezier(0.22,1,0.36,1)' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'hsl(var(--primary))')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '')}
            >
              Explore Collection
            </Link>
            <Link
              href="/journal"
              className="text-foreground/75"
              style={{ transition: 'color 350ms cubic-bezier(0.22,1,0.36,1)' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'hsl(var(--primary))')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '')}
            >
              Journal
            </Link>
            <Link
              href="/atlas"
              className="text-foreground/75"
              style={{ transition: 'color 350ms cubic-bezier(0.22,1,0.36,1)' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'hsl(var(--primary))')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '')}
            >
              Origin Atlas
            </Link>
            <Link href="/orders" className="text-foreground/75">Orders</Link>
            <Link href="/cart" className="text-foreground/75">Cart</Link>
          </div>
          <p className="text-sm text-muted-foreground/70">
            &copy; {new Date().getFullYear()} Coffee Diaries. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
