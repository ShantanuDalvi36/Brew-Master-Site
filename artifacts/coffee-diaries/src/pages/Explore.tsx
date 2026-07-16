import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  espresso: espressoImg,
  latte: latteImg,
  cappuccino: cappuccinoImg,
  'cold-brew': coldBrewImg,
  'iced-latte': icedLatteImg,
  affogato: affogatoImg,
  mocha: mochaImg,
  'flat-white': flatWhiteImg,
  americano: americanoImg,
};

type FilterType = 'All' | 'Featured' | 'Popular' | 'Hot Coffee' | 'Cold Coffee' | 'Dessert Coffee';
const filters: FilterType[] = ['All', 'Featured', 'Popular', 'Hot Coffee', 'Cold Coffee', 'Dessert Coffee'];

const ease = [0.22, 1, 0.36, 1] as const;

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.06, ease },
  }),
};

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  const filteredCoffees = coffees.filter(coffee => {
    const matchesSearch =
      coffee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coffee.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    switch (activeFilter) {
      case 'All': return true;
      case 'Featured': return coffee.featured;
      case 'Popular': return coffee.popular;
      default: return coffee.category === activeFilter;
    }
  });

  return (
    <div className="min-h-[100dvh] pt-32 pb-24 px-6 max-w-[1280px] mx-auto w-full">
      {/* Page heading — fades in on load */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
      >
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary dark:text-primary-foreground mb-6">
          Explore the Collection
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          From the concentrated intensity of a pure espresso to the indulgent comfort of a mocha, discover your perfect cup.
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        className="mb-12 space-y-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.12, ease }}
      >
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5 pointer-events-none transition-colors duration-300" />
          <input
            type="text"
            placeholder="Search by name or flavor..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={cn(
              "w-full pl-12 pr-4 py-3 bg-card border border-border rounded-full shadow-sm text-foreground",
              "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
              "focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.12)]",
              "placeholder:transition-colors placeholder:duration-300 focus:placeholder:text-muted-foreground/40"
            )}
          />
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                'px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
                activeFilter === filter
                  ? 'bg-primary text-primary-foreground shadow-md scale-[1.02]'
                  : 'bg-secondary text-foreground hover:bg-secondary/80'
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Grid — cards stagger 60ms each */}
      {filteredCoffees.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCoffees.map((coffee, i) => (
            <motion.div
              key={coffee.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
            >
              <CoffeeCard coffee={coffee} imagePath={imageMap[coffee.id]} />
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          className="text-center py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <p className="font-serif text-2xl text-muted-foreground mb-2">No coffees found</p>
          <p className="text-muted-foreground/70">Try adjusting your search or filter criteria.</p>
        </motion.div>
      )}
    </div>
  );
}
