import { useEffect, useState } from 'react';
import { Link, useRoute } from 'wouter';
import { ArrowLeft, Check, Clock, Coffee, PackageCheck } from 'lucide-react';
import { getOrder, advanceOrderStatus, type Order, type OrderStatus } from '@/services/orderStorage';

const steps: { label: OrderStatus; icon: typeof Check; note: string }[] = [
  { label: 'Order Placed', icon: Check, note: 'We received your order.' },
  { label: 'Preparing', icon: Coffee, note: 'Your barista is crafting it.' },
  { label: 'Ready', icon: PackageCheck, note: 'Your coffee is ready to enjoy.' },
  { label: 'Completed', icon: Check, note: 'Hope it made your day.' },
];

export default function OrderTracking() {
  const [, params] = useRoute('/order/:id/tracking');
  const [order, setOrder] = useState<Order | undefined>(() => params?.id ? getOrder(params.id) : undefined);
  useEffect(() => { if (params?.id) setOrder(getOrder(params.id)); }, [params?.id]);
  if (!order) return <div className="mx-auto flex min-h-[70dvh] max-w-xl flex-col items-center justify-center px-6 text-center"><h1 className="font-serif text-4xl text-primary">Order not found</h1><Link href="/orders" className="mt-6 rounded-full bg-primary px-6 py-3 text-primary-foreground">View order history</Link></div>;
  const currentIndex = steps.findIndex(step => step.label === order.status);
  const advance = () => { const next = advanceOrderStatus(order.id); if (next) setOrder(next); };
  return (
    <div className="min-h-[100dvh] px-6 pb-32 pt-36">
      <div className="mx-auto max-w-[820px]">
        <Link href={`/order/${order.id}/confirmation`} className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft size={16} /> Order details</Link>
        <div className="text-center"><p className="text-xs uppercase tracking-[0.2em] text-accent">Live order update</p><h1 className="mt-2 font-serif text-5xl text-primary dark:text-primary-foreground">Tracking {order.id}</h1><p className="mt-4 text-muted-foreground">A quiet little journey from our bar to you.</p></div>
        <div className="mt-14 rounded-[2rem] border border-border bg-card p-6 md:p-12">
          <div className="relative space-y-8 before:absolute before:bottom-8 before:left-[19px] before:top-8 before:w-px before:bg-border md:before:left-[23px]">{steps.map((step, index) => { const Icon = step.icon; const complete = index <= currentIndex; return <div key={step.label} className="relative flex gap-5"><div className={`z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 ${complete ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground'}`}><Icon size={17} /></div><div className="pt-1"><p className={`font-serif text-xl ${complete ? 'text-primary dark:text-primary-foreground' : 'text-muted-foreground'}`}>{step.label}</p><p className="mt-1 text-sm text-muted-foreground">{step.note}</p></div></div>; })}</div>
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-7 sm:flex-row"><p className="flex items-center gap-2 text-sm text-muted-foreground"><Clock size={16} /> Estimated time: {order.estimatedMinutes} minutes</p>{order.status !== 'Completed' && <button type="button" onClick={advance} className="rounded-full bg-primary px-5 py-3 text-sm text-primary-foreground">Simulate next update</button>}</div>
        </div>
      </div>
    </div>
  );
}