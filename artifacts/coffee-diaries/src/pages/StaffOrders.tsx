import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'wouter';
import { Check, ChevronRight, Coffee, Lock, RefreshCw } from 'lucide-react';
import { formatPrice } from '@/services/orderStorage';
import { loadStaffOrders, moveRemoteOrder, type StaffOrder, type UpdateOrderStatusRequestStatus } from '@/services/tableOrdering';
import { closeTableSession } from '@workspace/api-client-react';

const statuses: UpdateOrderStatusRequestStatus[] = ['Order Placed', 'Preparing', 'Ready', 'Served'];

export default function StaffOrders() {
  const [orders, setOrders] = useState<StaffOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setOrders(await loadStaffOrders());
      setMessage('');
    } catch {
      setMessage('The staff order board could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { void refresh(); }, [refresh]);

  const grouped = useMemo(() => orders.reduce<Record<number, StaffOrder[]>>((groups, order) => {
    (groups[order.tableNumber] ??= []).push(order);
    return groups;
  }, {}), [orders]);

  const updateStatus = async (order: StaffOrder) => {
    const next = statuses[Math.min(statuses.indexOf(order.status as UpdateOrderStatusRequestStatus) + 1, statuses.length - 1)];
    if (!next || next === order.status) return;
    const updated = await moveRemoteOrder(order.id, next);
    setOrders(current => current.map(item => item.id === order.id ? { ...item, status: updated.status } : item));
  };

  const closeSession = async (tableNumber: number) => {
    await closeTableSession(tableNumber);
    setMessage(`Table ${tableNumber} is closed. The next scan will start a new session.`);
    await refresh();
  };

  return (
    <div className="min-h-[100dvh] px-6 pb-32 pt-36">
      <div className="mx-auto max-w-[1120px]">
        <div className="flex flex-col justify-between gap-5 border-b border-border pb-8 sm:flex-row sm:items-end">
          <div><p className="text-xs uppercase tracking-[0.2em] text-accent">Coffee Diaries staff</p><h1 className="mt-2 font-serif text-5xl text-primary dark:text-primary-foreground">Active table orders</h1><p className="mt-4 max-w-xl text-muted-foreground">Each card is an individual bill. Move orders through the bar without combining guests at the same table.</p></div>
          <button type="button" onClick={() => void refresh()} className="inline-flex items-center justify-center gap-2 rounded-full border border-primary px-5 py-3 text-sm text-primary"><RefreshCw size={15} /> Refresh</button>
        </div>
        {message && <p className="mt-6 rounded-xl bg-secondary/60 p-4 text-sm text-accent" role="status">{message}</p>}
        {loading ? <div className="py-24 text-center text-muted-foreground">Loading active orders…</div> : orders.length === 0 ? <div className="py-24 text-center"><Coffee size={30} className="mx-auto text-accent" /><p className="mt-5 font-serif text-3xl text-primary">No active table orders.</p><p className="mt-3 text-muted-foreground">New orders will appear here as guests place them.</p></div> : <div className="mt-10 grid gap-6 md:grid-cols-2">{Object.entries(grouped).map(([tableNumber, tableOrders]) => <section key={tableNumber} className="rounded-[1.75rem] border border-border bg-card p-6"><div className="flex items-center justify-between border-b border-border pb-5"><div><p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Table</p><h2 className="font-serif text-3xl text-primary">{tableNumber}</h2></div><button type="button" onClick={() => void closeSession(Number(tableNumber))} className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-xs text-muted-foreground hover:border-primary hover:text-primary"><Lock size={13} /> Close session</button></div><div className="mt-5 space-y-4">{tableOrders.map(order => <article key={order.id} className="rounded-2xl border border-border/70 bg-background p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-medium">{order.customerName}</p><p className="mt-1 text-xs text-muted-foreground">{order.id} · {new Date(order.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</p></div><p className="font-medium text-accent">{formatPrice(order.totalAmount)}</p></div><div className="mt-4 flex items-center justify-between gap-3"><span className="rounded-full bg-secondary px-3 py-1.5 text-xs text-accent">{order.status}</span>{order.status !== 'Served' && <button type="button" onClick={() => void updateStatus(order)} className="inline-flex items-center gap-1 text-xs text-primary">Next status <ChevronRight size={14} /></button>}{order.status === 'Served' && <span className="inline-flex items-center gap-1 text-xs text-accent"><Check size={14} /> Served</span>}</div></article>)}</div></section>)}</div>}
        <Link href="/explore" className="mt-10 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">Return to customer view <ChevronRight size={15} /></Link>
      </div>
    </div>
  );
}