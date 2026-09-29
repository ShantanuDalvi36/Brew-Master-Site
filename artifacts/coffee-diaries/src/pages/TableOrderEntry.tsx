import { FormEvent, useMemo, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowRight, Coffee, LockKeyhole } from 'lucide-react';
import { identifyTable } from '@/services/tableOrdering';
import { saveTableContext } from '@/services/orderStorage';

export default function TableOrderEntry() {
  const [, navigate] = useLocation();
  const tableNumber = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const value = Number(new URLSearchParams(window.location.search).get('table'));
    return Number.isInteger(value) && value > 0 ? value : null;
  }, []);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!tableNumber) return;
    setLoading(true);
    setError('');
    try {
      const context = await identifyTable(tableNumber);
      saveTableContext({
        tableNumber,
        sessionId: context.session.id,
        customerName: name.trim(),
        phone: phone.trim(),
      });
      navigate('/explore');
    } catch {
      setError('We could not open this table right now. Please scan the QR code again.');
    } finally {
      setLoading(false);
    }
  };

  if (!tableNumber) {
    return (
      <div className="min-h-[100dvh] px-6 pb-32 pt-40">
        <div className="mx-auto max-w-xl text-center">
          <Coffee size={34} className="mx-auto text-accent" />
          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-accent">Coffee Diaries table ordering</p>
          <h1 className="mt-3 font-serif text-5xl text-primary dark:text-primary-foreground">Scan your table QR</h1>
          <p className="mt-5 text-muted-foreground">This ordering page opens from the QR code on your café table so we know where to bring your coffee.</p>
          <Link href="/explore" className="mt-8 inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3 text-sm text-primary">Browse the collection <ArrowRight size={15} /></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] px-6 pb-32 pt-40">
      <div className="mx-auto max-w-xl">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground"><Coffee size={24} /></div>
          <p className="mt-7 text-xs uppercase tracking-[0.2em] text-accent">Table {tableNumber}</p>
          <h1 className="mt-3 font-serif text-5xl text-primary dark:text-primary-foreground">Welcome to Coffee Diaries</h1>
          <p className="mt-5 text-muted-foreground">You’re ordering from Table {tableNumber}. Enter your details to start your own order.</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-10 rounded-[2rem] border border-border bg-card p-6 shadow-sm md:p-9">
          <label className="block text-xs uppercase tracking-[0.14em] text-muted-foreground">Name<input required value={name} onChange={event => setName(event.target.value)} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm normal-case tracking-normal text-foreground" placeholder="Your name" /></label>
          <label className="mt-5 block text-xs uppercase tracking-[0.14em] text-muted-foreground">Phone number<input required minLength={3} value={phone} onChange={event => setPhone(event.target.value)} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm normal-case tracking-normal text-foreground" placeholder="+91 98765 43210" /></label>
          {error && <p className="mt-5 rounded-xl bg-destructive/10 p-4 text-sm text-destructive" role="alert">{error}</p>}
          <button type="submit" disabled={loading} className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground disabled:cursor-wait disabled:opacity-60">{loading ? 'Opening your table…' : 'Start ordering'} {!loading && <ArrowRight size={16} />}</button>
          <p className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground"><LockKeyhole size={13} /> Each guest at this table gets a separate order and bill.</p>
        </form>
      </div>
    </div>
  );
}