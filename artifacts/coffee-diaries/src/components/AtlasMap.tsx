import React from 'react';
import { useLocation } from 'wouter';
import { MapPin } from 'lucide-react';
import { atlasCountries } from '@/data/atlas';

interface AtlasMapProps {
  visited: string[];
  activeSlug?: string;
  onVisit?: (slug: string) => void;
}

export function AtlasMap({ visited, activeSlug, onVisit }: AtlasMapProps) {
  const [, setLocation] = useLocation();
  return (
    <div className="relative aspect-[1.7/1] min-h-[300px] w-full overflow-hidden rounded-[2rem] border border-border bg-[#e6ddcd] dark:bg-[#382724]" aria-label="Interactive coffee origin map">
      <div className="absolute inset-0 opacity-45 dark:opacity-20" aria-hidden="true">
        <div className="absolute left-[8%] top-[24%] h-[38%] w-[23%] -rotate-12 rounded-[48%] bg-[#b8ae98]" />
        <div className="absolute left-[25%] top-[44%] h-[43%] w-[24%] rotate-[12deg] rounded-[48%] bg-[#b8ae98]" />
        <div className="absolute left-[46%] top-[17%] h-[34%] w-[23%] rotate-[13deg] rounded-[48%] bg-[#b8ae98]" />
        <div className="absolute left-[66%] top-[27%] h-[37%] w-[29%] rotate-[25deg] rounded-[46%] bg-[#b8ae98]" />
        <div className="absolute left-[76%] top-[67%] h-[23%] w-[16%] rotate-[30deg] rounded-[48%] bg-[#b8ae98]" />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_0,transparent_40%,hsl(var(--primary)/.06)_100%)]" aria-hidden="true" />
      <div className="absolute left-5 top-5 z-10 text-[10px] uppercase tracking-[0.24em] text-primary/65">Origin atlas · {atlasCountries.length} notes</div>
      {atlasCountries.map(country => {
        const isActive = country.slug === activeSlug;
        const isVisited = visited.includes(country.slug);
        const pin = (
          <button
            type="button"
            className={`group absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#e6ddcd] ${isActive ? 'scale-125' : ''}`}
            style={{ left: country.coordinates.left, top: country.coordinates.top }}
            aria-label={`${isVisited ? 'Visited' : 'Explore'} ${country.name}`}
            onClick={() => onVisit ? onVisit(country.slug) : setLocation(`/atlas/${country.slug}`)}
          >
            <span className={`relative flex h-5 w-5 items-center justify-center rounded-full border-2 border-card shadow-[0_3px_10px_rgba(60,35,20,.22)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-125 ${isVisited ? 'bg-accent' : isActive ? 'bg-primary' : 'bg-background'}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${isVisited || isActive ? 'bg-primary-foreground' : 'bg-primary'}`} />
              {isVisited && <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full border border-card bg-accent" />}
            </span>
            <span className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-2.5 py-1 text-[10px] font-medium text-primary-foreground opacity-0 shadow-sm transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
               {country.name} · {country.coffeeIds.length} {country.coffeeIds.length === 1 ? 'coffee' : 'coffees'}
            </span>
          </button>
        );
        return <React.Fragment key={country.slug}>{pin}</React.Fragment>;
      })}
      <div className="absolute bottom-5 left-5 flex items-center gap-4 text-[10px] uppercase tracking-[0.15em] text-foreground/55">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-accent" /> Collected</span>
        <span className="flex items-center gap-1.5"><MapPin size={12} /> Origin</span>
      </div>
    </div>
  );
}