export interface JournalEntry {
  id: string;
  coffeeId: string;
  coffeeName: string;
  country: string;
  countrySlug?: string;
  rating: number;
  notes: string;
  brewMethod: string;
  date: string;
  favorite: boolean;
}

const JOURNAL_KEY = 'coffee-diaries:journal';
const VISITED_KEY = 'coffee-diaries:visited-countries';
const EXPLORED_KEY = 'coffee-diaries:explored-coffees';

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable in private browsing. The journal remains usable in memory.
  }
}

function createId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `entry-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function loadJournalEntries() {
  return readJson<JournalEntry[]>(JOURNAL_KEY, []);
}

export function createJournalEntry(
  entry: Omit<JournalEntry, 'id' | 'date'> & { date?: string },
) {
  const nextEntry: JournalEntry = {
    ...entry,
    id: createId(),
    date: entry.date || new Date().toISOString(),
  };
  const next = [nextEntry, ...loadJournalEntries()];
  writeJson(JOURNAL_KEY, next);
  if (nextEntry.countrySlug) addVisitedCountry(nextEntry.countrySlug);
  addExploredCoffee(nextEntry.coffeeId);
  return nextEntry;
}

export function loadExploredCoffees() {
  return readJson<string[]>(EXPLORED_KEY, []);
}

export function addExploredCoffee(coffeeId: string) {
  const current = loadExploredCoffees();
  if (current.includes(coffeeId)) return current;
  const next = [...current, coffeeId];
  writeJson(EXPLORED_KEY, next);
  return next;
}

export function updateJournalEntry(id: string, updates: Partial<Omit<JournalEntry, 'id'>>) {
  const next = loadJournalEntries().map(entry =>
    entry.id === id ? { ...entry, ...updates } : entry,
  );
  writeJson(JOURNAL_KEY, next);
  return next.find(entry => entry.id === id);
}

export function deleteJournalEntry(id: string) {
  const next = loadJournalEntries().filter(entry => entry.id !== id);
  writeJson(JOURNAL_KEY, next);
  return next;
}

export function loadVisitedCountries() {
  return readJson<string[]>(VISITED_KEY, []);
}

export function addVisitedCountry(slug: string) {
  const current = loadVisitedCountries();
  if (current.includes(slug)) return current;
  const next = [...current, slug];
  writeJson(VISITED_KEY, next);
  return next;
}

export function toggleVisitedCountry(slug: string) {
  const current = loadVisitedCountries();
  const next = current.includes(slug)
    ? current.filter(country => country !== slug)
    : [...current, slug];
  writeJson(VISITED_KEY, next);
  return next;
}