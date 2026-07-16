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
  // Use provided image path or fallback to an empty colored box if not available yet
  const imgSrc = imagePath || ``;

  return (
    <Link 
      href={`/coffee/${coffee.id}`}
      className={cn(
        "group flex flex-col bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-border/50",
        className
      )}
      data-testid={`coffee-card-${coffee.id}`}
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-secondary relative">
        {imgSrc ? (
          <img 
            src={imgSrc} 
            alt={coffee.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary/50">
            <span className="font-serif italic">Image brewing...</span>
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-serif text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
          {coffee.name}
        </h3>
        <p className="text-muted-foreground text-sm flex-grow mb-6">
          {coffee.shortDesc}
        </p>
        <div className="flex items-center text-sm font-medium text-primary dark:text-primary-foreground opacity-80 group-hover:opacity-100 transition-opacity mt-auto">
          View Details
          <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
