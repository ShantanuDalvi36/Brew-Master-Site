import React, { useState, useRef } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import { coffees } from '@/data/coffees';
import { ExploreCoffeeCard } from '@/components/ExploreCoffeeCard';

// ── Images ────────────────────────────────────────────────────────────────────
import espressoImg    from '@assets/generated_images/espresso.jpg';
import latteImg       from '@assets/generated_images/latte.jpg';
import cappuccinoImg  from '@assets/generated_images/cappuccino.jpg';
import coldBrewImg    from '@assets/generated_images/cold-brew.jpg';
import icedLatteImg   from '@assets/generated_images/iced-latte.jpg';
import affogatoImg    from '@assets/generated_images/affogato.jpg';
import mochaImg       from '@assets/generated_images/mocha.jpg';
import flatWhiteImg   from '@assets/generated_images/flat-white.jpg';
import americanoImg   from '@assets/generated_images/americano.jpg';
import macchiatoImg   from '@assets/generated_images/macchiato.jpg';
import cortadoImg     from '@assets/generated_images/cortado.jpg';
import vietnameseImg  from '@assets/generated_images/vietnamese-iced-coffee.jpg';

const imageMap: Record<string, string> = {
  espresso:               espressoImg,
  latte:                  latteImg,
  cappuccino:             cappuccinoImg,
  'cold-brew':            coldBrewImg,
  'iced-latte':           icedLatteImg,
  affogato:               affogatoImg,
  mocha:                  mochaImg,
  'flat-white':           flatWhiteImg,
  americano:              americanoImg,
  macchiato:              macchiatoImg,
  cortado:                cortadoImg,
  'vietnamese-iced-coffee': vietnameseImg,
};

// ── Animation helpers ─────────────────────────────────────────────────────────
const EASE = [0.22, 1, 0.36, 1] as const;

const sectionReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: EASE },
  }),
};

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeading({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-baseline gap-3 mb-8">
      <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
        {title}
      </h2>
      <span className="text-sm text-muted-foreground/60 font-medium">
        {count} {count === 1 ? 'coffee' : 'coffees'}
      </span>
    </div>
  );
}

function CoffeeGrid({ items }: { items: typeof coffees }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((coffee, i) => (
        <motion.div
          key={coffee.id}
          custom={i}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          <ExploreCoffeeCard
            coffee={coffee}
            imagePath={imageMap[coffee.id]}
          />
        </motion.div>
      ))}
    </div>
  );
}

// ── Featured Card ─────────────────────────────────────────────────────────────
function FeaturedCard() {
  const cappuccino = coffees.find(c => c.id === 'cappuccino')!;

  return (
    <Link
      href={`/coffee/${cappuccino.id}`}
      className="group block w-full overflow-hidden rounded-[28px] border border-[#D9C9BA] dark:border-border bg-[#FCF8F3] dark:bg-card shadow-[0_8px_40px_rgba(40,30,20,0.10)] relative"
      style={{
        transition: 'transform 450ms cubic-bezier(0.22,1,0.36,1), box-shadow 450ms cubic-bezier(0.22,1,0.36,1)',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 24px 60px rgba(40,30,20,0.15)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 40px rgba(40,30,20,0.10)';
      }}
    >
      {/* 16:10 image */}
      <div className="aspect-[16/10] w-full overflow-hidden relative">
        <img
          src={cappuccinoImg}
          alt="Cappuccino"
          className="w-full h-full object-cover"
          style={{ transition: 'transform 450ms cubic-bezier(0.22,1,0.36,1)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.03)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Badge */}
        <span className="absolute top-5 left-5 text-[11px] font-semibold tracking-[0.10em] uppercase px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/30">
          Today's Pick
        </span>
      </div>

      {/* Content */}
      <div className="p-7 md:p-9 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-2">
            Featured · {cappuccino.origin}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
            {cappuccino.name}
          </h2>
          <p className="text-muted-foreground max-w-xl leading-relaxed">
            {cappuccino.description}
          </p>
        </div>

        <div className="flex-shrink-0">
          <span
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium"
            style={{ transition: 'background-color 300ms cubic-bezier(0.22,1,0.36,1), transform 300ms cubic-bezier(0.22,1,0.36,1)' }}
          >
            View Recipe
            <ArrowRight
              size={15}
              className="group-hover:translate-x-1"
              style={{ transition: 'transform 350ms cubic-bezier(0.22,1,0.36,1)' }}
            />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Explore() {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const q = query.trim().toLowerCase();

  const popular       = coffees.filter(c => c.popular);
  const hotCoffees    = coffees.filter(c => c.category === 'Hot Coffee');
  const coldCoffees   = coffees.filter(c => c.category === 'Cold Coffee');
  const dessertCoffees = coffees.filter(c => c.category === 'Dessert Coffee');

  const searchResults = coffees.filter(
    c =>
      c.name.toLowerCase().includes(q) ||
      c.shortDesc.toLowerCase().includes(q) ||
      c.origin.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q),
  );

  const isSearching = q.length > 0;

  return (
    <div className="min-h-[100dvh] pt-36 pb-32">
      <div className="max-w-[1280px] mx-auto px-6">

        {/* ── Page heading ── */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary dark:text-primary-foreground mb-3">
            Explore the Collection
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            From the concentrated intensity of a pure espresso to the indulgent comfort of a mocha — discover your perfect cup.
          </p>
        </motion.div>

        {/* ── Search bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="mb-24"
        >
          <div className="relative">
            <Search
              size={20}
              strokeWidth={1.6}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              style={{ transition: 'color 350ms cubic-bezier(0.22,1,0.36,1)' }}
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search coffees…"
              className="w-full h-14 pl-14 pr-5 bg-[#FCF8F3] dark:bg-card border border-[#D9C9BA] dark:border-border rounded-[18px] text-foreground text-base placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary dark:focus:border-primary focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.10)]"
              style={{
                transition:
                  'border-color 350ms cubic-bezier(0.22,1,0.36,1), box-shadow 350ms cubic-bezier(0.22,1,0.36,1)',
              }}
            />
          </div>
        </motion.div>

        {/* ── Search results ── */}
        {isSearching ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <SectionHeading title={`Results for "${query}"`} count={searchResults.length} />
            {searchResults.length > 0 ? (
              <CoffeeGrid items={searchResults} />
            ) : (
              <div className="text-center py-20">
                <p className="font-serif text-2xl text-muted-foreground mb-2">No coffees found</p>
                <p className="text-muted-foreground/60 text-sm">Try a different name, origin, or category.</p>
              </div>
            )}
          </motion.div>
        ) : (
          <>
            {/* ── Featured Coffee ── */}
            <motion.section
              className="mb-28"
              variants={sectionReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
            >
              <div className="flex items-baseline gap-3 mb-8">
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                  Featured Coffee
                </h2>
                <span className="text-xs font-semibold tracking-[0.08em] uppercase px-2.5 py-1 rounded-full bg-primary/8 dark:bg-primary/15 text-primary border border-primary/15">
                  Today's Pick
                </span>
              </div>
              <FeaturedCard />
            </motion.section>

            {/* ── Popular ── */}
            <motion.section
              className="mb-28"
              variants={sectionReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
            >
              <SectionHeading title="Popular" count={popular.length} />
              <CoffeeGrid items={popular} />
            </motion.section>

            {/* ── Hot Coffee ── */}
            <motion.section
              className="mb-28"
              variants={sectionReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
            >
              <SectionHeading title="Hot Coffee" count={hotCoffees.length} />
              <CoffeeGrid items={hotCoffees} />
            </motion.section>

            {/* ── Cold Coffee ── */}
            <motion.section
              className="mb-28"
              variants={sectionReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
            >
              <SectionHeading title="Cold Coffee" count={coldCoffees.length} />
              <CoffeeGrid items={coldCoffees} />
            </motion.section>

            {/* ── Dessert Coffee ── */}
            <motion.section
              variants={sectionReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
            >
              <SectionHeading title="Dessert Coffee" count={dessertCoffees.length} />
              <CoffeeGrid items={dessertCoffees} />
            </motion.section>
          </>
        )}
      </div>
    </div>
  );
}
