import React from 'react';
import { Link } from 'wouter';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface CoffeeCardProps {
  coffee: {
    id: string;
    name: string;
    shortDesc: string;
    image: string | null;
  };
  className?: string;
  imagePath?: string;
}

export function CoffeeCard({ coffee, className, imagePath }: CoffeeCardProps) {
  const imgSrc = imagePath || '';

  return (
    <Link
      href={`/coffee/${coffee.id}`}
      className={cn(
        // Lift 6px on hover, deepen shadow, smooth 300ms
        "group flex flex-col bg-card rounded-2xl overflow-hidden shadow-sm border border-border/50",
        "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:-translate-y-[6px] hover:shadow-[0_16px_40px_rgba(50,35,25,0.14)]",
        className
      )}
      data-testid={`coffee-card-${coffee.id}`}
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-secondary relative">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={coffee.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary/50">
            <span className="font-serif italic">Image brewing…</span>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-serif text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors duration-300">
          {coffee.name}
        </h3>
        <p className="text-muted-foreground text-sm flex-grow mb-6">
          {coffee.shortDesc}
        </p>
        {/* "View Details →" moves 4px right on hover */}
        <div className="flex items-center text-sm font-medium text-primary dark:text-primary-foreground opacity-80 group-hover:opacity-100 transition-opacity mt-auto">
          View Details
          <ArrowRight
            size={16}
            className="ml-2 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
          />
        </div>
      </div>
    </Link>
  );
}
