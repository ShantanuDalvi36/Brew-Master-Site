import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { CoffeeCard } from '@/components/CoffeeCard';
import { coffees } from '@/data/coffees';
import { cn } from '@/lib/utils';

import espressoImg from '@assets/generated_images/espresso.jpg';
import latteImg from '@assets/generated_images/latte.jpg';
import cappuccinoImg from '@assets/generated_images/cappuccino.jpg';
import coldBrewImg from '@assets/generated_images/cold-brew.jpg';
import icedLatteImg from '@assets/generated_images/iced-latte.jpg';
import affogatoImg from '@assets/generated_images/affogato.jpg';
import mochaImg from '@assets/generated_images/mocha.jpg';
import flatWhiteImg from '@assets/generated_images/flat-white.jpg';
import americanoImg from '@assets/generated_images/americano.jpg';

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
};

type FilterType = "All" | "Featured" | "Popular" | "Hot Coffee" | "Cold Coffee" | "Dessert Coffee";

const filters: FilterType[] = ["All", "Featured", "Popular", "Hot Coffee", "Cold Coffee", "Dessert Coffee"];

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");

  const filteredCoffees = coffees.filter(coffee => {
    const matchesSearch = coffee.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          coffee.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    switch (activeFilter) {
      case "All": return true;
      case "Featured": return coffee.featured;
      case "Popular": return coffee.popular;
      default: return coffee.category === activeFilter;
    }
  });

  return (
    <div className="min-h-[100dvh] pt-32 pb-24 px-6 max-w-[1280px] mx-auto w-full">
      <div className="text-center mb-16">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary dark:text-primary-foreground mb-6">
          Explore the Collection
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          From the concentrated intensity of a pure espresso to the indulgent comfort of a mocha, discover your perfect cup.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-12 space-y-8">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <input 
            type="text"
            placeholder="Search by name or flavor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300",
                activeFilter === filter 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filteredCoffees.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCoffees.map(coffee => (
            <CoffeeCard 
              key={coffee.id} 
              coffee={coffee} 
              imagePath={imageMap[coffee.id]} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="font-serif text-2xl text-muted-foreground mb-2">No coffees found</p>
          <p className="text-muted-foreground/70">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
}
