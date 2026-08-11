import React from 'react';
import { Link } from 'wouter';
import { Heart, Pencil, Trash2 } from 'lucide-react';
import type { JournalEntry } from '@/services/diaryStorage';

interface JournalEntryCardProps {
  entry: JournalEntry;
  onFavorite: () => void;
  onEdit: () => void;
  onDelete: () => void;
  imagePath?: string;
}

export function JournalEntryCard({ entry, onFavorite, onEdit, onDelete, imagePath }: JournalEntryCardProps) {
  const date = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(entry.date));
  return (
    <article className="group grid gap-5 border-b border-border/80 py-7 first:pt-0 last:border-0 sm:grid-cols-[150px_1fr]">
      <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-secondary">
        {imagePath ? <img src={imagePath} alt="" className="h-full w-full object-cover transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]" /> : <div className="flex h-full items-center justify-center font-serif italic text-muted-foreground">Coffee</div>}
      </div>
      <div>
      <div className="flex items-start justify-between gap-5">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            <span>{date}</span><span className="h-1 w-1 rounded-full bg-accent" /><span>{entry.country}</span>
          </div>
          <h3 className="font-serif text-2xl text-primary dark:text-primary-foreground">{entry.coffeeName}</h3>
          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">{entry.brewMethod} · {entry.rating}/5</p>
        </div>
        <button type="button" onClick={onFavorite} aria-label={`${entry.favorite ? 'Remove from' : 'Add to'} favorites`} className={`rounded-full p-2 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${entry.favorite ? 'text-primary' : 'text-muted-foreground'}`}>
          <Heart size={18} fill={entry.favorite ? 'currentColor' : 'none'} />
        </button>
      </div>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-foreground/75">{entry.notes || 'A quiet tasting, left without a note.'}</p>
      <div className="mt-4 flex flex-wrap items-center gap-4 opacity-70 transition-opacity duration-300 group-hover:opacity-100">
        <Link href={`/coffee/${entry.coffeeId}`} className="text-xs uppercase tracking-[0.12em] text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">View coffee</Link>
        <button type="button" onClick={onEdit} className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.12em] text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><Pencil size={13} /> Edit</button>
        <button type="button" onClick={onDelete} className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.12em] text-muted-foreground hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive"><Trash2 size={13} /> Remove</button>
      </div>
      </div>
    </article>
  );
}