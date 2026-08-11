import React, { useMemo, useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, Check, LockKeyhole, Map, Stamp } from 'lucide-react';
import { atlasCountries } from '@/data/atlas';
import { loadExploredCoffees, loadVisitedCountries, toggleVisitedCountry } from '@/services/diaryStorage';

const EASE = [0.22, 1, 0.36, 1] as const;

const achievements = [
  { id: 'first', title: 'First Sip', text: 'Explore your first coffee.', target: 1, kind: 'coffees' },
  { id: 'five', title: 'Coffee Explorer', text: 'Explore 5 coffees.', target: 5, kind: 'coffees' },
  { id: 'ten', title: 'Coffee Collector', text: 'Explore 10 coffees.', target: 10, kind: 'coffees' },
  { id: 'countries', title: 'World Traveler', text: 'Explore coffees from 5 countries.', target: 5, kind: 'countries' },
  { id: 'global', title: 'Global Coffee Explorer', text: 'Explore coffees from 10 countries.', target: 10, kind: 'countries' },
  { id: 'italian', title: 'Italian Coffee Journey', text: 'Explore 3 Italian coffees.', target: 3, kind: 'italy' },
];

export default function Passport() {
  const [visited, setVisited] = useState<string[]>(() => loadVisitedCountries());
  const [explored] = useState<string[]>(() => loadExploredCoffees());
  const collected = useMemo(() => atlasCountries.filter(country => visited.includes(country.slug)), [visited]);
  const regions = new Set(collected.map(country => country.region)).size;
  const continents = Math.min(5, regions);
  const italianCount = collected.find(country => country.slug === 'italy')?.coffeeIds.filter(id => explored.includes(id)).length || 0;
  const progressFor = (kind: string) => kind === 'coffees' ? explored.length : kind === 'italy' ? italianCount : collected.length;
  const completion = Math.round((collected.length / atlasCountries.length) * 100);

  const mark = (slug: string) => setVisited(toggleVisitedCountry(slug));

  return (
    <div className="min-h-[100dvh] pb-24 pt-32">
      <div className="mx-auto max-w-[1120px] px-6">
        <motion.header initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, ease: EASE }} className="grid gap-8 border-b border-border pb-12 md:grid-cols-[1fr_300px] md:items-end">
          <div>
            <p className="mb-4 text-[10px] uppercase tracking-[0.28em] text-accent">Your coffee passport</p>
            <h1 className="max-w-2xl font-serif text-5xl leading-[.98] text-primary dark:text-primary-foreground md:text-7xl">Every coffee is a new place to discover.</h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground">Collect the origins, coffees, and small rituals that make your journey yours.</p>
          </div>
          <div className="rounded-2xl bg-primary p-6 text-primary-foreground">
            <p className="text-[10px] uppercase tracking-[.2em] text-primary-foreground/60">Passport completion</p>
            <p className="mt-3 font-serif text-6xl leading-none">{completion}%</p>
            <p className="mt-3 text-sm text-primary-foreground/70">{collected.length} of {atlasCountries.length} origins visited</p>
          </div>
        </motion.header>

        <section className="grid gap-3 border-b border-border py-7 sm:grid-cols-2 lg:grid-cols-4">
          {[['Countries visited', collected.length], ['Coffees explored', explored.length], ['Continents explored', continents], ['Passport completion', `${completion}%`]].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-border bg-card p-4">
              <p className="text-[10px] uppercase tracking-[.15em] text-muted-foreground">{label}</p>
              <p className="mt-2 font-serif text-2xl text-primary dark:text-primary-foreground">{value}</p>
            </div>
          ))}
        </section>

        <section className="py-12">
          <div className="flex items-end justify-between border-b border-border pb-5">
            <div><p className="text-[10px] uppercase tracking-[.22em] text-accent">Passport collection</p><h2 className="mt-2 font-serif text-3xl text-primary dark:text-primary-foreground">Places you have found</h2></div>
            <Link href="/atlas" className="inline-flex items-center gap-2 text-xs uppercase tracking-[.14em] text-muted-foreground hover:text-primary">Explore atlas <ArrowRight size={14} /></Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {atlasCountries.map((country, index) => {
              const unlocked = visited.includes(country.slug);
              return (
                <motion.div key={country.slug} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: index * .08, ease: EASE }} className={`relative overflow-hidden rounded-2xl border p-6 ${unlocked ? 'border-accent/50 bg-accent/10' : 'border-border bg-card'}`}>
                  <div className="flex items-start justify-between"><span className={`flex h-10 w-10 items-center justify-center rounded-full border ${unlocked ? 'border-accent text-accent' : 'border-border text-muted-foreground'}`}>{unlocked ? <Stamp size={18} /> : <LockKeyhole size={16} />}</span><span className="text-[10px] uppercase tracking-[.15em] text-muted-foreground">{unlocked ? 'Visited' : 'Not yet explored'}</span></div>
                  <p className="mt-8 text-2xl" aria-label={`${country.name} flag initials`}>{country.flag}</p>
                  <h3 className="mt-2 font-serif text-3xl text-primary dark:text-primary-foreground">{country.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{unlocked ? country.tagline : 'Unlock this origin through exploration.'}</p>
                  {unlocked ? <Link href={`/atlas/${country.slug}`} className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[.12em] text-primary">Read note <ArrowRight size={13} /></Link> : <button type="button" onClick={() => mark(country.slug)} className="mt-6 text-xs uppercase tracking-[.12em] text-muted-foreground underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Mark explored</button>}
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="border-t border-border pt-12">
          <p className="text-[10px] uppercase tracking-[.22em] text-accent">Your coffee journey</p>
          <h2 className="mt-2 font-serif text-3xl text-primary dark:text-primary-foreground">Progress worth noticing</h2>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {[['Countries', collected.length, atlasCountries.length], ['Coffees', explored.length, 12]].map(([label, value, target]) => (
              <div key={label} className="rounded-2xl border border-border bg-card p-5"><div className="flex justify-between text-sm"><span>{label}</span><span className="text-muted-foreground">{value} / {target}</span></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ width: `${Math.min(100, Number(value) / Number(target) * 100)}%` }} /></div></div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <p className="text-[10px] uppercase tracking-[.22em] text-accent">Achievements</p>
          <h2 className="mt-2 font-serif text-3xl text-primary dark:text-primary-foreground">Small milestones, kept</h2>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {achievements.map(achievement => {
              const progress = progressFor(achievement.kind);
              const unlocked = progress >= achievement.target;
              return <div key={achievement.id} className={`flex items-center gap-4 rounded-2xl border p-5 ${unlocked ? 'border-accent/50 bg-accent/10' : 'border-border bg-card'}`}><div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${unlocked ? 'bg-accent text-accent-foreground' : 'bg-secondary text-muted-foreground'}`}>{unlocked ? <Check size={17} /> : <LockKeyhole size={16} />}</div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-4"><h3 className="font-serif text-xl text-foreground">{achievement.title}</h3><span className="text-xs text-muted-foreground">{Math.min(progress, achievement.target)}/{achievement.target}</span></div><p className="mt-1 text-sm text-muted-foreground">{achievement.text}</p><div className="mt-3 h-1 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-accent transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ width: `${Math.min(100, progress / achievement.target * 100)}%` }} /></div></div></div>;
            })}
          </div>
        </section>

        <section className="mt-12 rounded-[2rem] border border-border bg-secondary/40 p-7 md:p-9">
          <div className="flex items-center gap-4"><Map className="text-primary" size={22} /><div><p className="text-[10px] uppercase tracking-[.2em] text-accent">Keep exploring</p><h2 className="mt-2 font-serif text-3xl text-primary dark:text-primary-foreground">The next stamp is out there.</h2></div></div>
          <Link href="/atlas" className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground">Open Coffee Atlas <ArrowRight size={15} /></Link>
        </section>
      </div>
    </div>
  );
}