import React from 'react';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Coffee {
  id: string;
  name: string;
  shortDesc: string;
  category: string;
  origin: string;
  strengthLevel: number;
  strength: string;
}

interface ExploreCoffeeCardProps {
  coffee: Coffee;
  imagePath?: string;
  className?: string;
}

function getBadge(category: string, strength: string): string {
  if (category === 'Cold Coffee') return 'Cold Brew';
  if (category === 'Dessert Coffee') return 'Dessert';
  if (strength === 'Strong' || strength === 'Very Strong') return 'Strong';
  return 'Classic';
}

function StrengthDots({ level }: { level: number }) {
  return (
    <div className="flex gap-[3px]" aria-label={`Strength: ${level} of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={cn(
            'text-[9px] leading-none',
            i < level ? 'text-primary dark:text-primary' : 'text-border dark:text-border',
          )}
        >
          ●
        </span>
      ))}
    </div>
  );
}

export function ExploreCoffeeCard({ coffee, imagePath, className }: ExploreCoffeeCardProps) {
  const badge = getBadge(coffee.category, coffee.strength);

  return (
    <Link
      href={`/coffee/${coffee.id}`}
      className={cn(
        'group flex flex-col overflow-hidden',
        'rounded-[22px] border border-[#D9C9BA] dark:border-border',
        'bg-[#FCF8F3] dark:bg-card',
        'shadow-[0_6px_24px_rgba(40,30,20,0.08)]',
        'p-[17px]',
        className,
      )}
      style={{
        transition:
          'transform 450ms cubic-bezier(0.22,1,0.36,1), box-shadow 450ms cubic-bezier(0.22,1,0.36,1)',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-5px)';
        (e.currentTarget as HTMLElement).style.boxShadow =
          '0 20px 48px rgba(40,30,20,0.14)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0px)';
        (e.currentTarget as HTMLElement).style.boxShadow =
          '0 6px 24px rgba(40,30,20,0.08)';
      }}
      data-testid={`explore-card-${coffee.id}`}
    >
      {/* Image — 4:5 aspect ratio */}
      <div className="aspect-[4/5] w-full overflow-hidden rounded-[18px] bg-secondary relative mb-4">
        {imagePath ? (
          <img
            src={imagePath}
            alt={coffee.name}
            className="w-full h-full object-cover"
            style={{
              transition: 'transform 450ms cubic-bezier(0.22,1,0.36,1)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.03)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary/50">
            <span className="font-serif italic text-sm">Image brewing…</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow px-1">
        {/* Badge */}
        <span className="inline-flex self-start mb-2 text-[10px] font-semibold tracking-[0.08em] uppercase px-2.5 py-1 rounded-full bg-primary/8 dark:bg-primary/15 text-primary dark:text-primary border border-primary/15 dark:border-primary/20">
          {badge}
        </span>

        {/* Name */}
        <h3
          className="font-serif text-lg font-semibold text-foreground mb-1 leading-snug"
          style={{ transition: 'color 350ms cubic-bezier(0.22,1,0.36,1)' }}
        >
          {coffee.name}
        </h3>

        {/* One-line description */}
        <p className="text-muted-foreground text-xs leading-relaxed mb-3 line-clamp-1">
          {coffee.shortDesc}
        </p>

        {/* Origin + Strength */}
        <div className="flex items-center justify-between mt-auto mb-3">
          <span className="text-[11px] text-muted-foreground/70 font-medium tracking-wide">
            {coffee.origin}
          </span>
          <StrengthDots level={coffee.strengthLevel} />
        </div>

        {/* CTA */}
        <div
          className="flex items-center text-xs font-semibold tracking-wide text-primary dark:text-primary gap-1.5"
          style={{ transition: 'opacity 350ms cubic-bezier(0.22,1,0.36,1)' }}
        >
          <span>Discover</span>
          <ArrowRight
            size={13}
            className="group-hover:translate-x-1"
            style={{ transition: 'transform 350ms cubic-bezier(0.22,1,0.36,1)' }}
          />
        </div>
      </div>
    </Link>
  );
}
