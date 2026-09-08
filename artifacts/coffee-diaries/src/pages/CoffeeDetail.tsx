import React, { useEffect, useState } from 'react';
import { useRoute, Link } from 'wouter';
import { ArrowLeft, Coffee, Droplets, Zap, Globe, X, Check, Heart, ShoppingBag } from 'lucide-react';
import { coffees } from '@/data/coffees';
import { addExploredCoffee, createJournalEntry, loadJournalEntries } from '@/services/diaryStorage';
import { getCountryForCoffee } from '@/data/atlas';
import { formatPrice, getBasePrice, isFavorite, toggleFavorite } from '@/services/orderStorage';

import espressoImg from '@assets/generated_images/espresso.jpg';
import latteImg from '@assets/generated_images/latte.jpg';
import cappuccinoImg from '@assets/generated_images/cappuccino.jpg';
import coldBrewImg from '@assets/generated_images/cold-brew.jpg';
import icedLatteImg from '@assets/generated_images/iced-latte.jpg';
import affogatoImg from '@assets/generated_images/affogato.jpg';
import mochaImg from '@assets/generated_images/mocha.jpg';
import flatWhiteImg from '@assets/generated_images/flat-white.jpg';
import americanoImg from '@assets/generated_images/americano.jpg';
import macchiatoImg from '@assets/generated_images/macchiato.jpg';
import cortadoImg from '@assets/generated_images/cortado.jpg';
import vietnameseImg from '@assets/generated_images/vietnamese-iced-coffee.jpg';

const imageMap: Record<string, string> = {
  'espresso': espressoImg,
  'latte': latteImg,
  'cappuccino': cappuccinoImg,
  'cold-brew': coldBrewImg,
  'iced-latte': icedLatteImg,
  'affogato': affogatoImg,
  'mocha': mochaImg,
  'flat-white': flatWhiteImg,
  'americano': americanoImg,
  'macchiato': macchiatoImg,
  'cortado': cortadoImg,
  'vietnamese-iced-coffee': vietnameseImg,
};

export default function CoffeeDetail() {
  const [, params] = useRoute('/coffee/:id');
  const id = params?.id;
  const coffee = coffees.find(c => c.id === id);
  const [journalOpen, setJournalOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [rating, setRating] = useState(5);
  const [notes, setNotes] = useState('');
  const [tastingDate, setTastingDate] = useState(new Date().toISOString().slice(0, 10));
  const [confirmation, setConfirmation] = useState('');
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setSaved(Boolean(id && loadJournalEntries().some(entry => entry.coffeeId === id)));
    setFavorite(Boolean(id && isFavorite(id)));
  }, [id]);

  if (!coffee) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center text-center px-6">
        <h1 className="font-serif text-4xl text-primary mb-4">Coffee not found</h1>
        <p className="text-muted-foreground mb-8">We couldn't find the brew you're looking for.</p>
        <Link href="/explore" className="px-6 py-3 bg-primary text-white rounded-full">
          Back to Explore
        </Link>
      </div>
    );
  }

  const imageSrc = imageMap[coffee.id];
  const similarCoffees = coffees.filter(c => coffee.similar.includes(c.id));
  const country = getCountryForCoffee(coffee.id);

  return (
    <div className="min-h-[100dvh] pb-24">
      {/* Hero */}
      <div className="h-[50vh] min-h-[400px] w-full relative">
        <div className="absolute inset-0">
          {imageSrc ? (
            <img src={imageSrc} alt={coffee.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-secondary/80" />
          )}
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-[1280px] mx-auto z-10">
          <Link href="/explore" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Back to Explore
            
          </Link>
          <div className="inline-block px-3 py-1 bg-primary/80 backdrop-blur-sm text-white text-sm font-medium rounded-full mb-4">
            {coffee.category}
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-md">
            {coffee.name}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl font-light drop-shadow">
            {coffee.description}
          </p>
           <button
             type="button"
             onClick={() => setJournalOpen(true)}
             className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/15 px-5 py-3 text-sm text-white backdrop-blur-sm transition-colors duration-300 hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
           >
             {saved ? <Check size={16} /> : null}
             {saved ? 'Add another tasting' : 'Add to Journal'}
           </button>
           <div className="mt-3 flex flex-wrap items-center gap-3">
             <Link href={`/coffee/${coffee.id}/customize`} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm text-primary-foreground hover:opacity-90">
               <ShoppingBag size={16} /> Customize &amp; Order · {formatPrice(getBasePrice(coffee.id))}
             </Link>
             <button type="button" onClick={() => { const next = toggleFavorite(coffee.id); setFavorite(next.includes(coffee.id)); setConfirmation(next.includes(coffee.id) ? 'Saved to your favorites.' : 'Removed from your favorites.'); }} className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/15 px-5 py-3 text-sm text-white backdrop-blur-sm hover:bg-white/25">
               <Heart size={16} fill={favorite ? 'currentColor' : 'none'} /> {favorite ? 'Saved' : 'Add to Favorites'}
             </button>
           </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          
          <section>
            <h2 className="font-serif text-3xl font-bold text-primary dark:text-primary-foreground mb-6">The Recipe</h2>
            <div className="bg-card border border-border p-8 rounded-2xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Ingredients</h3>
              <ul className="space-y-3 mb-8">
                {coffee.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-center text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-primary/50 mr-3"></span>
                    {ing}
                  </li>
                ))}
              </ul>

              <h3 className="text-lg font-semibold mb-4 text-foreground">Preparation</h3>
              <p className="text-muted-foreground leading-relaxed">
                {coffee.recipe}
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-3xl font-bold text-primary dark:text-primary-foreground mb-6">Serving Tips</h2>
            <div className="grid gap-4">
              {coffee.servingTips.map((tip, i) => (
                <div key={i} className="bg-secondary/30 border border-border p-4 rounded-xl flex items-start">
                  <span className="text-primary mr-3 text-xl leading-none">•</span>
                  <span className="text-foreground/80">{tip}</span>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
            <h3 className="font-serif text-xl font-bold mb-6 border-b border-border pb-4">Quick Facts</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary">
                  <Globe size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Origin</p>
                  <p className="font-medium text-foreground">{coffee.origin}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary">
                  <Coffee size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Strength</p>
                  <p className="font-medium text-foreground">{coffee.strength}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary">
                  <Zap size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Caffeine</p>
                  <p className="font-medium text-foreground">{coffee.caffeine}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary">
                  <Droplets size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Milk Level</p>
                  <p className="font-medium text-foreground">{coffee.milkLevel}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
            <h3 className="font-serif text-xl font-bold mb-6 border-b border-border pb-4">Flavor Profile</h3>
            <div className="flex flex-wrap gap-2">
              {coffee.flavorProfile.map((flavor, i) => (
                <span 
                  key={i}
                  className="px-4 py-2 bg-secondary text-foreground text-sm font-medium rounded-full"
                >
                  {flavor}
                </span>
              ))}
            </div>
          </div>

          {similarCoffees.length > 0 && (
            <div>
              <h3 className="font-serif text-xl font-bold mb-4 text-primary dark:text-primary-foreground">Similar Brews</h3>
              <div className="space-y-4">
                {similarCoffees.map(c => (
                  <Link 
                    key={c.id} 
                    href={`/coffee/${c.id}`}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-colors group"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary shrink-0">
                      {imageMap[c.id] && (
                        <img src={imageMap[c.id]} alt={c.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-serif font-semibold text-foreground group-hover:text-primary transition-colors">{c.name}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[150px]">{c.shortDesc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
      {journalOpen && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-primary/20 p-0 backdrop-blur-sm sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="journal-dialog-title">
          <form
            onSubmit={event => {
              event.preventDefault();
              createJournalEntry({
                coffeeId: coffee.id,
                coffeeName: coffee.name,
                country: country?.name || coffee.origin,
                countrySlug: country?.slug,
                rating,
                notes,
                brewMethod: coffee.name,
                favorite: false,
                date: new Date(`${tastingDate}T12:00:00`).toISOString(),
              });
              addExploredCoffee(coffee.id);
              setSaved(true);
              setJournalOpen(false);
              setNotes('');
              setConfirmation('Added to your journal and passport progress.');
            }}
            className="w-full max-w-xl rounded-t-[2rem] border border-border bg-card p-6 shadow-[0_24px_80px_rgba(52,28,22,.22)] sm:rounded-[2rem] sm:p-8"
          >
            <div className="mb-7 flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-accent">Personal tasting note</p>
                <h2 id="journal-dialog-title" className="mt-2 font-serif text-3xl text-primary dark:text-primary-foreground">Add to your journal</h2>
              </div>
              <button type="button" onClick={() => setJournalOpen(false)} aria-label="Close journal form" className="rounded-full p-2 text-muted-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><X size={18} /></button>
            </div>
            <div className="rounded-2xl bg-secondary/40 p-4">
              <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Coffee</p>
              <p className="mt-1 font-serif text-xl text-foreground">{coffee.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{country?.name || coffee.origin}</p>
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Rating
                <select value={rating} onChange={event => setRating(Number(event.target.value))} className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-3 text-sm normal-case tracking-normal text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                  {[5, 4, 3, 2, 1].map(value => <option key={value} value={value}>{value} / 5</option>)}
                </select>
              </label>
              <label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Date
                <input type="date" value={tastingDate} onChange={event => setTastingDate(event.target.value)} className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-3 text-sm normal-case tracking-normal text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              </label>
              <label className="text-xs uppercase tracking-[0.14em] text-muted-foreground sm:col-span-2">Notes
                <textarea value={notes} onChange={event => setNotes(event.target.value)} rows={4} placeholder="What stayed with you?" className="mt-2 w-full resize-none rounded-xl border border-border bg-background px-3 py-3 text-sm normal-case tracking-normal text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              </label>
            </div>
            <div className="mt-7 flex justify-end gap-3">
              <button type="button" onClick={() => setJournalOpen(false)} className="rounded-full px-4 py-2.5 text-sm text-muted-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Cancel</button>
              <button type="submit" className="rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">Save to Journal</button>
            </div>
          </form>
        </div>
      )}
      {confirmation && (
        <div className="fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 rounded-full border border-accent/30 bg-card px-5 py-3 text-sm text-accent shadow-[0_10px_35px_rgba(52,28,22,.16)]" role="status">
          {confirmation}
          <button type="button" onClick={() => setConfirmation('')} className="ml-3 text-muted-foreground underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Dismiss</button>
        </div>
      )}
    </div>
  );
}
