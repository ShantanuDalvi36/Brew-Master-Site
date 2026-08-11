import React, { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, Compass } from 'lucide-react';
import { AtlasMap } from '@/components/AtlasMap';
import { atlasCountries } from '@/data/atlas';
import { loadVisitedCountries } from '@/services/diaryStorage';
import { coffeeImageMap } from '@/data/coffeeImages';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Atlas() {
  const [visited] = useState<string[]>(() => loadVisitedCountries());
  return (
    <div className="min-h-[100dvh] pb-24 pt-32">
      <div className="mx-auto max-w-[1120px] px-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, ease: EASE }} className="mb-12 max-w-3xl">
          <p className="mb-4 text-[10px] uppercase tracking-[0.28em] text-accent">The origin atlas</p>
          <h1 className="font-serif text-5xl leading-[.98] text-primary dark:text-primary-foreground md:text-7xl">Every cup has a place.</h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground">Trace the flavors, rituals, and landscapes behind the coffees you know. Choose a pin to open a field note from that part of the world.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .75, delay: .1, ease: EASE }}><AtlasMap visited={visited} /></motion.div>
        <div className="mt-14 flex items-end justify-between border-b border-border pb-5"><div><p className="text-[10px] uppercase tracking-[0.22em] text-accent">Places to begin</p><h2 className="mt-2 font-serif text-3xl text-primary dark:text-primary-foreground">A world in small sips</h2></div><span className="hidden text-sm text-muted-foreground sm:block">{atlasCountries.length} origin notes</span></div>
         <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
           {atlasCountries.map((country, index) => {
             const imagePath = coffeeImageMap[country.coffeeIds[0]];
             return <motion.div key={country.slug} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-30px' }} transition={{ duration: .55, delay: index % 3 * .08, ease: EASE }}>
               <Link href={`/atlas/${country.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_6px_24px_rgba(40,30,20,0.06)] transition-[transform,box-shadow] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[5px] hover:shadow-[0_20px_48px_rgba(40,30,20,0.13)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4">
                 <div className="aspect-[4/3] overflow-hidden bg-secondary">{imagePath && <img src={imagePath} alt="" className="h-full w-full object-cover transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]" />}</div>
                 <div className="flex flex-1 items-start justify-between gap-4 p-5"><div><p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{country.region}</p><h3 className="mt-1 font-serif text-2xl text-foreground transition-colors duration-300 group-hover:text-primary">{country.name}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{country.tagline}</p><p className="mt-4 text-[10px] uppercase tracking-[0.14em] text-accent">{country.coffeeIds.length} {country.coffeeIds.length === 1 ? 'coffee' : 'coffees'}</p></div><ArrowRight size={18} className="mt-1 shrink-0 text-primary transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1" /></div>
               </Link>
             </motion.div>;
           })}
        </div>
        <div className="mt-16 rounded-[2rem] bg-primary p-7 text-primary-foreground md:flex md:items-center md:justify-between md:p-10"><div className="flex gap-4"><Compass className="mt-1 shrink-0" size={22} /><div><p className="text-[10px] uppercase tracking-[0.2em] text-primary-foreground/60">Keep exploring</p><p className="mt-2 max-w-lg font-serif text-2xl">Start with a coffee, then follow the thread back to its source.</p></div></div><Link href="/journal" className="mt-6 inline-flex items-center gap-2 text-sm underline decoration-primary-foreground/40 underline-offset-4 hover:decoration-primary-foreground md:mt-0">Open your journal <ArrowRight size={15} /></Link></div>
      </div>
    </div>
  );
}