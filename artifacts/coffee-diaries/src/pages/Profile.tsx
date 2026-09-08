import { Heart, BookOpen, Globe2, Package } from 'lucide-react';
import { Link } from 'wouter';

const links = [
  { href: '/favorites', label: 'Favorites', description: 'Return to the coffees you love.', icon: Heart },
  { href: '/journal', label: 'My Journal', description: 'Keep your tasting notes close.', icon: BookOpen },
  { href: '/passport', label: 'Coffee Passport', description: 'Continue your journey around the world.', icon: Globe2 },
  { href: '/orders', label: 'Order History', description: 'See past cups and order again.', icon: Package },
];

export default function Profile() {
  return <div className="min-h-[100dvh] px-6 pb-32 pt-36"><div className="mx-auto max-w-[920px]"><div className="max-w-2xl"><p className="text-xs uppercase tracking-[0.18em] text-accent">Your coffee corner</p><h1 className="mt-2 font-serif text-5xl text-primary dark:text-primary-foreground">Profile</h1><p className="mt-5 text-lg leading-relaxed text-muted-foreground">A personal home for your orders, notes, and the places your coffee has taken you.</p></div><div className="mt-12 grid gap-4 sm:grid-cols-2">{links.map(({ href, label, description, icon: Icon }) => <Link key={href} href={href} className="group rounded-[1.5rem] border border-border bg-card p-6 hover:border-primary/60"><div className="flex items-center justify-between"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-primary"><Icon size={20} /></div><span className="text-muted-foreground transition-transform group-hover:translate-x-1">→</span></div><h2 className="mt-7 font-serif text-2xl text-primary dark:text-primary-foreground">{label}</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p></Link>)}</div></div></div>;
}