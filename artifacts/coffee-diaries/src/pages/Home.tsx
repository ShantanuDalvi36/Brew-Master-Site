import React from 'react';
import { HeroSection } from '@/components/HeroSection';
import { QuoteSection } from '@/components/QuoteSection';
import { CoffeeCard } from '@/components/CoffeeCard';
import { coffees } from '@/data/coffees';
import heroImg from '@assets/generated_images/hero.jpg';
import espressoImg from '@assets/generated_images/espresso.jpg';
import latteImg from '@assets/generated_images/latte.jpg';
import cappuccinoImg from '@assets/generated_images/cappuccino.jpg';
import mochaImg from '@assets/generated_images/mocha.jpg';

const imageMap: Record<string, string> = {
  'espresso': espressoImg,
  'latte': latteImg,
  'cappuccino': cappuccinoImg,
  'mocha': mochaImg,
};

export default function Home() {
  const featuredCoffees = coffees.filter(c => c.featured).slice(0, 3);

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <HeroSection imagePath={heroImg} />
      
      <section className="py-24 px-6 max-w-[1280px] mx-auto w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary dark:text-primary-foreground mb-4">
              Featured Pours
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Curated selections from our daily rotation. Time-honored classics crafted with intention.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCoffees.map(coffee => (
            <CoffeeCard 
              key={coffee.id} 
              coffee={coffee} 
              imagePath={imageMap[coffee.id]} 
            />
          ))}
        </div>
      </section>

      <QuoteSection />
    </div>
  );
}
