import React from 'react';
import { motion } from 'framer-motion';
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
  espresso: espressoImg,
  latte: latteImg,
  cappuccino: cappuccinoImg,
  mocha: mochaImg,
};

const EASE = [0.22, 1, 0.36, 1] as const;

// 80ms stagger between cards
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: EASE },
  }),
};

export default function Home() {
  const featuredCoffees = coffees.filter(c => c.featured).slice(0, 3);

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <HeroSection imagePath={heroImg} />

      <motion.section
        className="py-24 px-6 max-w-[1280px] mx-auto w-full"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: EASE }}
      >
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
          {featuredCoffees.map((coffee, i) => (
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
      </motion.section>

      <QuoteSection />
    </div>
  );
}
