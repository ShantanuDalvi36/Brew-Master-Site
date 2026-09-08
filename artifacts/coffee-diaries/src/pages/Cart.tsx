import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react';
import { coffees } from '@/data/coffees';
import { coffeeImageMap } from '@/data/coffeeImages';
import { formatPrice, getCartTotal, loadCart, loadTableContext, removeFromCart, updateCartQuantity, type CartItem } from '@/services/orderStorage';

function CartRow({ item, onChange }: { item: CartItem; onChange: () => void }) {
  const coffee = coffees.find(entry => entry.id === item.coffeeId);
  if (!coffee) return null;
  return (
    <div className="flex flex-col gap-4 border-b border-border py-6 sm:flex-row sm:items-center">
      <img src={coffeeImageMap[coffee.id]} alt={coffee.name} className="h-24 w-24 rounded-2xl object-cover" />
      <div className="min-w-0 flex-1">
        <p className="font-serif text-xl text-primary dark:text-primary-foreground">{coffee.name}</p>
        <p className="mt-1 text-sm text-muted-foreground">{item.customization.size} · {item.customization.milk} milk · {item.customization.sweetness} sweetness{item.customization.extra !== 'None' ? ` · ${item.customization.extra}` : ''}</p>
        <p className="mt-2 text-sm text-accent">{formatPrice(item.unitPrice)} each</p>
      </div>
      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <div className="flex items-center rounded-full border border-border">
          <button type="button" onClick={() => { updateCartQuantity(item.id, item.quantity - 1); onChange(); }} className="p-2.5 text-muted-foreground hover:text-primary" aria-label="Decrease quantity"><Minus size={14} /></button>
          <span className="min-w-8 text-center text-sm">{item.quantity}</span>
          <button type="button" onClick={() => { updateCartQuantity(item.id, item.quantity + 1); onChange(); }} className="p-2.5 text-muted-foreground hover:text-primary" aria-label="Increase quantity"><Plus size={14} /></button>
        </div>
        <p className="w-20 text-right font-medium">{formatPrice(item.unitPrice * item.quantity)}</p>
        <button type="button" onClick={() => { removeFromCart(item.id); onChange(); }} className="p-2 text-muted-foreground hover:text-destructive" aria-label={`Remove ${coffee.name}`}><Trash2 size={16} /></button>
      </div>
    </div>
  );
}

export default function Cart() {
  const [, navigate] = useLocation();
  const [items, setItems] = useState<CartItem[]>([]);
  const [tableContext] = useState(loadTableContext());
  const refresh = () => setItems(loadCart());
  useEffect(refresh, []);

  return (
    <div className="min-h-[100dvh] px-6 pb-32 pt-36">
      <div className="mx-auto max-w-[1120px]">
        <Link href="/explore" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft size={16} /> Continue exploring</Link>
        <div className="flex flex-col justify-between gap-4 border-b border-border pb-8 sm:flex-row sm:items-end">
          <div><p className="text-xs uppercase tracking-[0.18em] text-accent">Your selection</p><h1 className="mt-2 font-serif text-5xl text-primary dark:text-primary-foreground">Cart</h1></div>
          <p className="text-muted-foreground">{items.reduce((sum, item) => sum + item.quantity, 0)} {items.length === 1 ? 'item' : 'items'}</p>
        </div>
        {items.length === 0 ? (
          <div className="py-24 text-center"><p className="font-serif text-3xl text-primary">Your cart is waiting.</p><p className="mt-3 text-muted-foreground">Choose a coffee and make it exactly yours.</p><Link href="/explore" className="mt-7 inline-flex rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground">Explore coffees</Link></div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-[1fr_330px]">
            <div>{items.map(item => <CartRow key={item.id} item={item} onChange={refresh} />)}</div>
            <aside className="h-fit rounded-[1.75rem] border border-border bg-card p-6 lg:mt-6">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Order summary</p>
              <div className="mt-6 flex justify-between text-sm text-muted-foreground"><span>Subtotal</span><span>{formatPrice(getCartTotal(items))}</span></div>
              <div className="mt-3 flex justify-between text-sm text-muted-foreground"><span>Service</span><span>Included</span></div>
              <div className="mt-6 flex justify-between border-t border-border pt-5 font-serif text-xl text-primary"><span>Total</span><span>{formatPrice(getCartTotal(items))}</span></div>
              {tableContext ? <button type="button" onClick={() => navigate('/checkout')} className="mt-7 w-full rounded-full bg-primary px-5 py-3.5 text-sm font-medium text-primary-foreground">Place order for Table {tableContext.tableNumber}</button> : <Link href="/order" className="mt-7 block w-full rounded-full bg-primary px-5 py-3.5 text-center text-sm font-medium text-primary-foreground">Scan table QR to order</Link>}
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}