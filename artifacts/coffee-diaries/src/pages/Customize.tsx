import { useState } from 'react';
import { Link, useLocation, useRoute } from 'wouter';
import { ArrowLeft, Check, ShoppingBag } from 'lucide-react';
import { coffees } from '@/data/coffees';
import { coffeeImageMap } from '@/data/coffeeImages';
import {
  addToCart,
  DEFAULT_CUSTOMIZATION,
  formatPrice,
  getCustomizationPrice,
  type Customization,
  type Extra,
  type Milk,
  type Size,
  type Sweetness,
} from '@/services/orderStorage';

const choices = {
  size: ['Small', 'Medium', 'Large'] as Size[],
  milk: ['None', 'Regular', 'Oat', 'Almond'] as Milk[],
  sweetness: ['None', 'Low', 'Medium', 'High'] as Sweetness[],
  extra: ['None', 'Extra Shot', 'Whipped Cream', 'Syrup'] as Extra[],
};

function OptionGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: T[];
  onChange: (value: T) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</legend>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {options.map(option => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-xl border px-3 py-3 text-sm transition-colors ${
              value === option
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-foreground hover:border-primary/60'
            }`}
            aria-pressed={value === option}
          >
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export default function Customize() {
  const [, params] = useRoute('/coffee/:id/customize');
  const [, navigate] = useLocation();
  const coffee = coffees.find(item => item.id === params?.id);
  const [customization, setCustomization] = useState<Customization>(DEFAULT_CUSTOMIZATION);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!coffee) {
    return (
      <div className="mx-auto flex min-h-[70dvh] max-w-2xl flex-col items-center justify-center px-6 text-center">
        <h1 className="font-serif text-4xl text-primary">Coffee not found</h1>
        <Link href="/explore" className="mt-6 rounded-full bg-primary px-6 py-3 text-primary-foreground">Back to Explore</Link>
      </div>
    );
  }

  const price = getCustomizationPrice(coffee.id, customization);
  const setOption = <K extends keyof Customization>(key: K) => (value: Customization[K]) =>
    setCustomization(current => ({ ...current, [key]: value }));

  const handleAdd = () => {
    addToCart(coffee.id, customization, quantity);
    setAdded(true);
  };

  return (
    <div className="min-h-[100dvh] px-6 pb-32 pt-36">
      <div className="mx-auto grid max-w-[1120px] gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <Link href={`/coffee/${coffee.id}`} className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft size={16} /> Back to coffee
          </Link>
          <div className="overflow-hidden rounded-[2rem] border border-border bg-secondary/40">
            <img src={coffeeImageMap[coffee.id]} alt={coffee.name} className="aspect-[4/5] w-full object-cover" />
          </div>
          <div className="mt-6">
            <p className="text-xs uppercase tracking-[0.18em] text-accent">{coffee.category} · {coffee.origin}</p>
            <h1 className="mt-2 font-serif text-4xl text-primary dark:text-primary-foreground">{coffee.name}</h1>
            <p className="mt-3 max-w-lg leading-relaxed text-muted-foreground">{coffee.description}</p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm md:p-10">
          <div className="flex items-start justify-between gap-4 border-b border-border pb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Make it yours</p>
              <h2 className="mt-2 font-serif text-3xl text-primary dark:text-primary-foreground">Customize your cup</h2>
            </div>
            <p className="font-serif text-2xl text-accent">{formatPrice(price)}</p>
          </div>

          <div className="mt-8 space-y-7">
            <OptionGroup label="Size" value={customization.size} options={choices.size} onChange={setOption('size')} />
            <OptionGroup label="Milk" value={customization.milk} options={choices.milk} onChange={setOption('milk')} />
            <OptionGroup label="Sweetness" value={customization.sweetness} options={choices.sweetness} onChange={setOption('sweetness')} />
            <OptionGroup label="Extra" value={customization.extra} options={choices.extra} onChange={setOption('extra')} />
          </div>

          <div className="mt-9 flex items-center justify-between border-t border-border pt-6">
            <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Quantity
              <select value={quantity} onChange={event => setQuantity(Number(event.target.value))} className="ml-3 rounded-lg border border-border bg-background px-3 py-2 text-sm normal-case tracking-normal text-foreground">
                {[1, 2, 3, 4, 5].map(value => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
            <p className="text-sm text-muted-foreground">Subtotal <span className="ml-2 font-medium text-foreground">{formatPrice(price * quantity)}</span></p>
          </div>

          {added && (
            <div className="mt-5 flex items-center gap-2 rounded-xl bg-secondary/60 p-3 text-sm text-accent" role="status">
              <Check size={17} /> Added to your cart.
            </div>
          )}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={handleAdd} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground hover:opacity-90">
              <ShoppingBag size={17} /> {added ? 'Add another' : 'Add to cart'}
            </button>
            {added && <button type="button" onClick={() => navigate('/cart')} className="rounded-full border border-primary px-6 py-3.5 text-sm font-medium text-primary hover:bg-primary hover:text-primary-foreground">View cart</button>}
          </div>
        </div>
      </div>
    </div>
  );
}