import { useEffect, useState } from 'react';
import { Link, useRoute } from 'wouter';
import { Check, CreditCard, Users } from 'lucide-react';
import { coffees } from '@/data/coffees';
import { formatPrice, getOrder, type Order } from '@/services/orderStorage';
import { loadRemoteOrder } from '@/services/tableOrdering';

export default function OrderConfirmation() {
  const [, params] = useRoute('/order/:id/confirmation');
  const [order, setOrder] = useState<Order | undefined>(() => params?.id ? getOrder(params.id) : undefined);
  useEffect(() => {
    if (!params?.id) return;
    loadRemoteOrder(params.id).then(response => setOrder({
      ...getOrder(params.id),
      id: response.id,
      sessionId: response.sessionId,
      tableNumber: response.tableNumber,
      customerName: response.customerName,
      phone: response.phone,
      status: response.status as Order['status'],
      total: response.totalAmount,
      paymentMethod: response.paymentMethod,
      createdAt: response.createdAt,
      items: response.items.map(item => ({ id: item.id, coffeeId: item.coffeeId, quantity: item.quantity, unitPrice: item.unitPrice, addedAt: response.createdAt, customization: { size: item.customization.size as 'Small' | 'Medium' | 'Large', milk: item.customization.milk as 'None' | 'Regular' | 'Oat' | 'Almond', sweetness: item.customization.sweetness as 'None' | 'Low' | 'Medium' | 'High', extra: item.customization.extra as 'None' | 'Extra Shot' | 'Whipped Cream' | 'Syrup' } })),
    })).catch(() => undefined);
  }, [params?.id]);

  if (!order) return <div className="mx-auto flex min-h-[70dvh] max-w-xl flex-col items-center justify-center px-6 text-center"><h1 className="font-serif text-4xl text-primary">Order not found</h1><Link href="/orders" className="mt-6 rounded-full bg-primary px-6 py-3 text-primary-foreground">View order history</Link></div>;
  return (
    <div className="min-h-[100dvh] px-6 pb-32 pt-36">
      <div className="mx-auto max-w-[760px]">
        <div className="text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check size={29} /></div><p className="mt-7 text-xs uppercase tracking-[0.2em] text-accent">Thank you, {order.customerName}</p><h1 className="mt-2 font-serif text-5xl text-primary dark:text-primary-foreground">Your order is in.</h1><p className="mt-4 text-muted-foreground">We’re preparing a beautiful cup for Table {order.tableNumber}.</p></div>
        <div className="mt-12 rounded-[2rem] border border-border bg-card p-6 md:p-9">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6"><div><p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Order ID</p><p className="mt-1 font-serif text-2xl text-primary">{order.id}</p></div><div className="text-right"><p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Table {order.tableNumber}</p><p className="mt-1 text-sm font-medium text-accent">{order.status}</p></div></div>
          <div className="grid gap-4 border-b border-border py-6 text-sm sm:grid-cols-2"><p className="flex items-center gap-3 text-muted-foreground"><Users size={17} /> Individual bill for Table {order.tableNumber}</p><p className="flex items-center gap-3 text-muted-foreground"><CreditCard size={17} /> {order.paymentMethod}</p></div>
          <div className="space-y-4 py-6">{order.items.map(item => { const coffee = coffees.find(entry => entry.id === item.coffeeId); return coffee ? <div key={item.id} className="flex justify-between gap-4 text-sm"><span><span className="font-medium">{item.quantity} × {coffee.name}</span><span className="mt-1 block text-muted-foreground">{item.customization.size} · {item.customization.milk} milk · {item.customization.sweetness} sweetness</span></span><span>{formatPrice(item.unitPrice * item.quantity)}</span></div> : null; })}</div>
          <div className="flex justify-between border-t border-border pt-5 font-serif text-xl text-primary"><span>Total</span><span>{formatPrice(order.total)}</span></div>
        </div>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link href={`/order/${order.id}/tracking`} className="rounded-full bg-primary px-7 py-3.5 text-center text-sm text-primary-foreground">Track order</Link><Link href="/explore" className="rounded-full border border-primary px-7 py-3.5 text-center text-sm text-primary">Continue exploring</Link></div>
      </div>
    </div>
  );
}