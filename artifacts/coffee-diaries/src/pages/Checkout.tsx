import { FormEvent, useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowLeft, MapPin, Store } from 'lucide-react';
import { coffees } from '@/data/coffees';
import { createOrder, formatPrice, getCartTotal, loadCart, type OrderType, type PaymentMethod } from '@/services/orderStorage';

export default function Checkout() {
  const [, navigate] = useLocation();
  const [items] = useState(loadCart());
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [orderType, setOrderType] = useState<OrderType>('Pickup');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash on Delivery');
  const [error, setError] = useState('');

  useEffect(() => { if (!items.length) navigate('/cart'); }, [items.length, navigate]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !phone.trim() || (orderType === 'Delivery' && !address.trim())) {
      setError('Please complete the required details before placing your order.');
      return;
    }
    const order = createOrder({
      items,
      total: getCartTotal(items),
      orderType,
      address: orderType === 'Delivery' ? address.trim() : undefined,
      customerName: name.trim(),
      phone: phone.trim(),
      paymentMethod,
      estimatedMinutes: orderType === 'Pickup' ? 15 : 35,
    });
    navigate(`/order/${order.id}/confirmation`);
  };

  return (
    <div className="min-h-[100dvh] px-6 pb-32 pt-36">
      <div className="mx-auto max-w-[1120px]">
        <Link href="/cart" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft size={16} /> Back to cart</Link>
        <div className="mb-10"><p className="text-xs uppercase tracking-[0.18em] text-accent">Almost there</p><h1 className="mt-2 font-serif text-5xl text-primary dark:text-primary-foreground">Checkout</h1></div>
        <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            <section className="rounded-[1.75rem] border border-border bg-card p-6 md:p-8">
              <h2 className="font-serif text-2xl text-primary dark:text-primary-foreground">Your details</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Name<input required value={name} onChange={event => setName(event.target.value)} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm normal-case tracking-normal text-foreground" placeholder="Your name" /></label>
                <label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Phone<input required value={phone} onChange={event => setPhone(event.target.value)} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm normal-case tracking-normal text-foreground" placeholder="+91 98765 43210" /></label>
              </div>
            </section>
            <section className="rounded-[1.75rem] border border-border bg-card p-6 md:p-8">
              <h2 className="font-serif text-2xl text-primary dark:text-primary-foreground">How would you like it?</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {(['Pickup', 'Delivery'] as OrderType[]).map(type => <button key={type} type="button" onClick={() => setOrderType(type)} className={`flex items-center gap-3 rounded-xl border p-4 text-left ${orderType === type ? 'border-primary bg-primary/10' : 'border-border'}`}>{type === 'Pickup' ? <Store size={19} /> : <MapPin size={19} />}<span><span className="block text-sm font-medium">{type}</span><span className="text-xs text-muted-foreground">{type === 'Pickup' ? 'Ready at our bar' : 'Bring it to your door'}</span></span></button>)}
              </div>
              {orderType === 'Delivery' && <label className="mt-5 block text-xs uppercase tracking-[0.14em] text-muted-foreground">Delivery address<textarea required value={address} onChange={event => setAddress(event.target.value)} rows={3} className="mt-2 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm normal-case tracking-normal text-foreground" placeholder="Street, building, city" /></label>}
            </section>
            <section className="rounded-[1.75rem] border border-border bg-card p-6 md:p-8">
              <h2 className="font-serif text-2xl text-primary dark:text-primary-foreground">Payment</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {(['Cash on Delivery', 'Online Payment'] as PaymentMethod[]).map(method => <button key={method} type="button" onClick={() => setPaymentMethod(method)} className={`rounded-xl border p-4 text-left text-sm ${paymentMethod === method ? 'border-primary bg-primary/10' : 'border-border'}`}><span className="font-medium">{method}</span><span className="mt-1 block text-xs text-muted-foreground">{method === 'Online Payment' ? 'Secure mock payment for now' : 'Pay when your coffee arrives'}</span></button>)}
              </div>
            </section>
            {error && <p className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive" role="alert">{error}</p>}
          </div>
          <aside className="h-fit rounded-[1.75rem] border border-border bg-card p-6 lg:sticky lg:top-28">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Review order</p>
            <div className="mt-5 space-y-4">{items.map(item => { const coffee = coffees.find(entry => entry.id === item.coffeeId); return coffee ? <div key={item.id} className="flex justify-between gap-3 text-sm"><span className="text-muted-foreground">{item.quantity} × {coffee.name}</span><span>{formatPrice(item.unitPrice * item.quantity)}</span></div> : null; })}</div>
            <div className="mt-6 flex justify-between border-t border-border pt-5 font-serif text-xl text-primary"><span>Total</span><span>{formatPrice(getCartTotal(items))}</span></div>
            <button type="submit" className="mt-7 w-full rounded-full bg-primary px-5 py-3.5 text-sm font-medium text-primary-foreground">Place order</button>
          </aside>
        </form>
      </div>
    </div>
  );
}