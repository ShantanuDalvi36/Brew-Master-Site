import { FormEvent, useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowLeft, CreditCard, Users } from 'lucide-react';
import { coffees } from '@/data/coffees';
import { clearCart, formatPrice, getCartTotal, loadCart, loadTableContext, saveTableContext, type CartItem } from '@/services/orderStorage';
import { placeTableOrder, tableOrderInput } from '@/services/tableOrdering';

export default function Checkout() {
  const [, navigate] = useLocation();
  const [items] = useState<CartItem[]>(loadCart());
  const [context, setContext] = useState(loadTableContext());
  const [name, setName] = useState(context?.customerName ?? '');
  const [phone, setPhone] = useState(context?.phone ?? '');
  const [paymentMethod, setPaymentMethod] = useState('Payment at table');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!items.length) navigate('/cart');
    if (!context) navigate('/order');
  }, [context, items.length, navigate]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!context || !name.trim() || !phone.trim()) {
      setError('Please complete your name and phone number.');
      return;
    }
    setLoading(true);
    setError('');
    const nextContext = { ...context, customerName: name.trim(), phone: phone.trim() };
    saveTableContext(nextContext);
    setContext(nextContext);
    try {
      const order = await placeTableOrder(tableOrderInput(nextContext, items, paymentMethod));
      clearCart();
      navigate(`/order/${order.id}/confirmation`);
    } catch {
      setError('We could not place your order. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] px-6 pb-32 pt-36">
      <div className="mx-auto max-w-[1120px]">
        <Link href="/cart" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft size={16} /> Back to cart</Link>
        <div className="mb-10"><p className="text-xs uppercase tracking-[0.18em] text-accent">Table {context?.tableNumber ?? '—'} · Your bill</p><h1 className="mt-2 font-serif text-5xl text-primary dark:text-primary-foreground">Place your order</h1><p className="mt-4 max-w-xl text-muted-foreground">Everyone at the table orders independently. This bill belongs only to you.</p></div>
        <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            <section className="rounded-[1.75rem] border border-border bg-card p-6 md:p-8">
              <h2 className="font-serif text-2xl text-primary dark:text-primary-foreground">Your details</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Name<input required value={name} onChange={event => setName(event.target.value)} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm normal-case tracking-normal text-foreground" /></label>
                <label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Phone<input required value={phone} onChange={event => setPhone(event.target.value)} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm normal-case tracking-normal text-foreground" /></label>
              </div>
            </section>
            <section className="rounded-[1.75rem] border border-border bg-card p-6 md:p-8">
              <h2 className="font-serif text-2xl text-primary dark:text-primary-foreground">Payment option</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {['Payment at table', 'Online Payment'].map(method => <button key={method} type="button" onClick={() => setPaymentMethod(method)} className={`flex items-start gap-3 rounded-xl border p-4 text-left text-sm ${paymentMethod === method ? 'border-primary bg-primary/10' : 'border-border'}`}><CreditCard size={18} className="mt-0.5 text-accent" /><span><span className="font-medium">{method}</span><span className="mt-1 block text-xs text-muted-foreground">{method === 'Online Payment' ? 'Mock payment placeholder' : 'Settle with the café team'}</span></span></button>)}
              </div>
              <p className="mt-5 text-xs text-muted-foreground">Payment processing is intentionally a placeholder for this version.</p>
            </section>
            {error && <p className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive" role="alert">{error}</p>}
          </div>
          <aside className="h-fit rounded-[1.75rem] border border-border bg-card p-6 lg:sticky lg:top-28">
            <div className="flex items-center justify-between"><p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Your order</p><p className="flex items-center gap-1 text-xs text-accent"><Users size={14} /> Table {context?.tableNumber}</p></div>
            <div className="mt-5 space-y-4">{items.map(item => { const coffee = coffees.find(entry => entry.id === item.coffeeId); return coffee ? <div key={item.id} className="flex justify-between gap-3 text-sm"><span><span className="text-foreground">{item.quantity} × {coffee.name}</span><span className="mt-1 block text-xs text-muted-foreground">{item.customization.size} · {item.customization.milk} milk · {item.customization.sweetness} sweetness</span></span><span>{formatPrice(item.unitPrice * item.quantity)}</span></div> : null; })}</div>
            <div className="mt-6 flex justify-between border-t border-border pt-5 font-serif text-xl text-primary"><span>Total</span><span>{formatPrice(getCartTotal(items))}</span></div>
            <button type="submit" disabled={loading} className="mt-7 w-full rounded-full bg-primary px-5 py-3.5 text-sm font-medium text-primary-foreground disabled:opacity-60">{loading ? 'Placing order…' : 'Place order'}</button>
          </aside>
        </form>
      </div>
    </div>
  );
}