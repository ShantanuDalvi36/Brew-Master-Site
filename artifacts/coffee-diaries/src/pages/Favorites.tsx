import { useEffect, useState } from 'react';
import { Heart, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { coffees } from '@/data/coffees';
import { coffeeImageMap } from '@/data/coffeeImages';
import { formatPrice, getBasePrice, loadFavorites } from '@/services/orderStorage';

export default function Favorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  useEffect(() => {
    const refresh = () => setFavoriteIds(loadFavorites());
    refresh();
    window.addEventListener('coffee-diaries:storage', refresh);
    return () => window.removeEventListener('coffee-diaries:storage', refresh);
  }, []);
  const favoriteCoffees = coffees.filter(coffee => favoriteIds.includes(coffee.id));

  return (
    <div className="min-h-[100dvh] px-6 pb-32 pt-36">
      <div className="mx-auto max-w-[1120px]">
        <div className="border-b border-border pb-8">
          <p className="text-xs uppercase tracking-[0.18em] text-accent">Saved for later</p>
          <h1 className="mt-2 font-serif text-5xl text-primary dark:text-primary-foreground">Favorites</h1>
          <p className="mt-4 max-w-xl text-muted-foreground">The cups that made you pause. Keep them close for your next order.</p>
        </div>
        {favoriteCoffees.length === 0 ? (
          <div className="py-24 text-center">
            <Heart size={30} className="mx-auto text-accent" />
            <p className="mt-5 font-serif text-3xl text-primary">Nothing saved yet.</p>
            <p className="mt-3 text-muted-foreground">Tap the heart on a coffee you want to return to.</p>
            <Link href="/explore" className="mt-7 inline-flex rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground">Explore coffees</Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteCoffees.map(coffee => (
              <Link key={coffee.id} href={`/coffee/${coffee.id}`} className="group overflow-hidden rounded-[1.5rem] border border-border bg-card">
                <img src={coffeeImageMap[coffee.id]} alt={coffee.name} className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                <div className="p-5">
                  <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">{coffee.category}</p>
                  <h2 className="mt-2 font-serif text-2xl text-primary dark:text-primary-foreground">{coffee.name}</h2>
                  <div className="mt-4 flex items-center justify-between text-sm"><span className="text-accent">From {formatPrice(getBasePrice(coffee.id))}</span><ArrowRight size={16} className="text-muted-foreground" /></div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}