import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, X } from 'lucide-react';
import { coffees } from '@/data/coffees';
import { getCountryForCoffee } from '@/data/atlas';
import { coffeeImageMap } from '@/data/coffeeImages';
import { JournalEntryCard } from '@/components/JournalEntryCard';
import { createJournalEntry, deleteJournalEntry, loadJournalEntries, updateJournalEntry, type JournalEntry } from '@/services/diaryStorage';

const EASE = [0.22, 1, 0.36, 1] as const;
const blankForm = { coffeeId: coffees[0].id, country: 'Italy', countrySlug: 'italy', rating: 4, notes: '', brewMethod: 'Espresso', date: new Date().toISOString().slice(0, 10) };

function TastingForm({ initial, onClose, onSaved }: { initial?: JournalEntry; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState(initial ? { coffeeId: initial.coffeeId, country: initial.country, countrySlug: initial.countrySlug || '', rating: initial.rating, notes: initial.notes, brewMethod: initial.brewMethod, date: initial.date.slice(0, 10) } : blankForm);
  const selectedCoffee = coffees.find(coffee => coffee.id === form.coffeeId);
  const set = (key: string, value: string | number) => setForm(previous => ({ ...previous, [key]: value }));
  const selectCoffee = (coffeeId: string) => {
    const nextCoffee = coffees.find(coffee => coffee.id === coffeeId);
    const country = nextCoffee ? getCountryForCoffee(nextCoffee.id) : undefined;
    setForm(previous => ({ ...previous, coffeeId, country: country?.name || previous.country, countrySlug: country?.slug || previous.countrySlug }));
  };
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedCoffee) return;
    const date = new Date(`${form.date}T12:00:00`).toISOString();
    if (initial) updateJournalEntry(initial.id, { ...form, date, coffeeName: selectedCoffee.name });
    else createJournalEntry({ ...form, date, coffeeName: selectedCoffee.name, favorite: false });
    onSaved();
  };
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-primary/20 p-0 backdrop-blur-sm sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="tasting-title">
      <form onSubmit={submit} className="w-full max-w-xl rounded-t-[2rem] border border-border bg-card p-6 shadow-[0_24px_80px_rgba(52,28,22,.22)] sm:rounded-[2rem] sm:p-8">
        <div className="mb-7 flex items-start justify-between"><div><p className="text-[10px] uppercase tracking-[0.22em] text-accent">Personal tasting note</p><h2 id="tasting-title" className="mt-2 font-serif text-3xl text-primary dark:text-primary-foreground">{initial ? 'Revisit this cup' : 'Record a cup'}</h2></div><button type="button" onClick={onClose} aria-label="Close form" className="rounded-full p-2 text-muted-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><X size={18} /></button></div>
        <div className="grid gap-5 sm:grid-cols-2">
           <label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Coffee<select value={form.coffeeId} onChange={e => selectCoffee(e.target.value)} className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-3 text-sm normal-case tracking-normal text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">{coffees.map(coffee => <option key={coffee.id} value={coffee.id}>{coffee.name}</option>)}</select></label>
          <label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Origin<input value={form.country} onChange={e => set('country', e.target.value)} required className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-3 text-sm normal-case tracking-normal text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" /></label>
          <label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Brew method<input value={form.brewMethod} onChange={e => set('brewMethod', e.target.value)} required className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-3 text-sm normal-case tracking-normal text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" /></label>
          <label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Rating<select value={form.rating} onChange={e => set('rating', Number(e.target.value))} className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-3 text-sm normal-case tracking-normal text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">{[5, 4, 3, 2, 1].map(rating => <option key={rating} value={rating}>{rating} / 5</option>)}</select></label>
           <label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Date<input type="date" value={form.date} onChange={e => set('date', e.target.value)} className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-3 text-sm normal-case tracking-normal text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" /></label>
           <label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Rating<select value={form.rating} onChange={e => set('rating', Number(e.target.value))} className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-3 text-sm normal-case tracking-normal text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">{[5, 4, 3, 2, 1].map(rating => <option key={rating} value={rating}>{rating} / 5</option>)}</select></label>
          <label className="text-xs uppercase tracking-[0.14em] text-muted-foreground sm:col-span-2">Your note<textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={4} placeholder="What stayed with you?" className="mt-2 w-full resize-none rounded-xl border border-border bg-background px-3 py-3 text-sm normal-case tracking-normal text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" /></label>
        </div>
        <div className="mt-7 flex justify-end gap-3"><button type="button" onClick={onClose} className="rounded-full px-4 py-2.5 text-sm text-muted-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Cancel</button><button type="submit" className="rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">{initial ? 'Save changes' : 'Save tasting'}</button></div>
      </form>
    </div>
  );
}

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>(() => loadJournalEntries());
   const [filter, setFilter] = useState<'all' | 'favorites' | 'highest' | 'recent'>('all');
  const [query, setQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<JournalEntry>();
   const filtered = useMemo(() => {
     const result = entries.filter(entry => (filter !== 'favorites' || entry.favorite) && `${entry.coffeeName} ${entry.country} ${entry.notes}`.toLowerCase().includes(query.toLowerCase()));
     return [...result].sort((a, b) => filter === 'highest' ? b.rating - a.rating : filter === 'recent' ? new Date(b.date).getTime() - new Date(a.date).getTime() : 0);
   }, [entries, filter, query]);
   const averageRating = entries.length ? (entries.reduce((sum, entry) => sum + entry.rating, 0) / entries.length).toFixed(1) : '—';
   const countriesExplored = new Set(entries.map(entry => entry.country)).size;
   const favoriteCoffee = entries.length ? entries.reduce((best, entry) => entry.rating > best.rating ? entry : best, entries[0]).coffeeName : '—';
  const refresh = () => { setEntries(loadJournalEntries()); setFormOpen(false); setEditing(undefined); };
  const favorite = (entry: JournalEntry) => { updateJournalEntry(entry.id, { favorite: !entry.favorite }); setEntries(loadJournalEntries()); };
  const remove = (entry: JournalEntry) => { if (window.confirm(`Remove your note for ${entry.coffeeName}?`)) { deleteJournalEntry(entry.id); setEntries(loadJournalEntries()); } };

  return (
    <div className="min-h-[100dvh] pb-24 pt-32">
      <div className="mx-auto max-w-[1120px] px-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, ease: EASE }} className="grid gap-8 border-b border-border pb-12 md:grid-cols-[1fr_300px] md:items-end">
           <div><p className="mb-4 text-[10px] uppercase tracking-[0.28em] text-accent">Your tasting notebook</p><h1 className="max-w-2xl font-serif text-5xl leading-[.98] text-primary dark:text-primary-foreground md:text-7xl">My Coffee Journal</h1><p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground">Keep track of the coffees you've discovered, loved, and want to try again.</p></div>
          <div className="rounded-2xl bg-secondary/50 p-5"><div className="flex items-center gap-3 text-primary"><BookOpen size={18} /><span className="text-xs uppercase tracking-[0.18em]">Notebook in progress</span></div><p className="mt-5 font-serif text-4xl text-foreground">{entries.length.toString().padStart(2, '0')}</p><p className="text-sm text-muted-foreground">tastings recorded</p></div>
        </motion.div>
         <div className="grid gap-3 border-b border-border py-7 sm:grid-cols-2 lg:grid-cols-4">
           {[['Coffees tried', entries.length], ['Countries explored', countriesExplored], ['Average rating', averageRating], ['Favorite coffee', favoriteCoffee]].map(([label, value]) => <div key={label} className="rounded-2xl border border-border bg-card p-4"><p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{label}</p><p className="mt-2 truncate font-serif text-xl text-primary dark:text-primary-foreground">{value}</p></div>)}
         </div>
         <div className="flex flex-col gap-4 border-b border-border py-7 md:flex-row md:items-center md:justify-between">
           <div className="flex flex-wrap gap-2">{[['all', 'All'], ['favorites', 'Favorites'], ['highest', 'Highest rated'], ['recent', 'Recently added']].map(([value, label]) => <button key={value} type="button" onClick={() => setFilter(value as typeof filter)} className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.14em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${filter === value ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground/70'}`}>{label}</button>)}</div>
          <div className="flex gap-3"><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search your notes" aria-label="Search journal notes" className="min-w-0 rounded-full border border-border bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" /><button type="button" onClick={() => setFormOpen(true)} className="shrink-0 rounded-full bg-accent px-4 py-2 text-xs uppercase tracking-[0.12em] text-accent-foreground transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">+ Record a cup</button></div>
        </div>
         <div className="mt-10 grid gap-10 md:grid-cols-[minmax(0,1fr)_260px]">
           <section aria-live="polite">{filtered.length > 0 ? filtered.map((entry, index) => <motion.div key={entry.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55, delay: index * .06, ease: EASE }}><JournalEntryCard entry={entry} imagePath={coffeeImageMap[entry.coffeeId]} onFavorite={() => favorite(entry)} onEdit={() => { setEditing(entry); setFormOpen(true); }} onDelete={() => remove(entry)} /></motion.div>) : <div className="rounded-2xl border border-dashed border-border bg-secondary/20 p-10 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary"><BookOpen size={20} /></div><h2 className="mt-5 font-serif text-2xl text-primary dark:text-primary-foreground">{entries.length ? 'No notes match that view.' : 'Your coffee story starts here.'}</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{entries.length ? 'Try another filter or a different word.' : 'Explore a coffee and add your first entry to your journal.'}</p>{!entries.length && <button type="button" onClick={() => setFormOpen(true)} className="mt-6 rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">Explore coffees →</button>}</div>}</section>
          <aside className="h-fit rounded-2xl border border-border bg-card p-6"><p className="text-[10px] uppercase tracking-[0.2em] text-accent">A small practice</p><p className="mt-5 font-serif text-2xl leading-tight text-primary dark:text-primary-foreground">Notice one thing before you name five.</p><p className="mt-4 text-sm leading-6 text-muted-foreground">The first impression is often the honest one. Write it down before tasting notes turn into a checklist.</p><div className="mt-6 h-px bg-border" /><p className="mt-5 text-xs leading-5 text-muted-foreground">Your entries live in this browser, so your notebook stays yours.</p></aside>
        </div>
      </div>
      {formOpen && <TastingForm initial={editing} onClose={() => { setFormOpen(false); setEditing(undefined); }} onSaved={refresh} />}
    </div>
  );
}