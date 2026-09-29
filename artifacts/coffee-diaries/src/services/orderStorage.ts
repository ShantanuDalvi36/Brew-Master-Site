export type Size = 'Small' | 'Medium' | 'Large';
export type Milk = 'None' | 'Regular' | 'Oat' | 'Almond';
export type Sweetness = 'None' | 'Low' | 'Medium' | 'High';
export type Extra = 'None' | 'Extra Shot' | 'Whipped Cream' | 'Syrup';
export type OrderType = 'Pickup' | 'Delivery';
export type PaymentMethod = 'Cash on Delivery' | 'Online Payment';
export type OrderStatus = 'Order Placed' | 'Preparing' | 'Ready' | 'Completed';

export interface Customization {
  size: Size;
  milk: Milk;
  sweetness: Sweetness;
  extra: Extra;
}

export interface CartItem {
  id: string;
  coffeeId: string;
  quantity: number;
  customization: Customization;
  unitPrice: number;
  addedAt: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  orderType: OrderType;
  address?: string;
  customerName: string;
  phone: string;
  paymentMethod: PaymentMethod;
  createdAt: string;
  estimatedMinutes: number;
}

const CART_KEY = 'coffee-diaries:cart';
const ORDERS_KEY = 'coffee-diaries:orders';
const FAVORITES_KEY = 'coffee-diaries:favorites';

export const DEFAULT_CUSTOMIZATION: Customization = {
  size: 'Medium',
  milk: 'None',
  sweetness: 'None',
  extra: 'None',
};

export const BASE_PRICES: Record<string, number> = {
  espresso: 3.5,
  latte: 5.5,
  cappuccino: 5,
  'cold-brew': 5.25,
  'iced-latte': 5.75,
  affogato: 6,
  mocha: 6.25,
  'flat-white': 5.5,
  americano: 4,
  macchiato: 4.25,
  cortado: 4.75,
  'vietnamese-iced-coffee': 5.75,
};

const SIZE_PRICES: Record<Size, number> = { Small: 0, Medium: 0.75, Large: 1.5 };
const MILK_PRICES: Record<Milk, number> = { None: 0, Regular: 0, Oat: 0.75, Almond: 0.75 };
const SWEETNESS_PRICES: Record<Sweetness, number> = { None: 0, Low: 0, Medium: 0, High: 0 };
const EXTRA_PRICES: Record<Extra, number> = { None: 0, 'Extra Shot': 1.5, 'Whipped Cream': 0.75, Syrup: 0.75 };

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('coffee-diaries:storage'));
  } catch {
    // The in-memory UI still works when storage is unavailable.
  }
}

export function getBasePrice(coffeeId: string) {
  return BASE_PRICES[coffeeId] ?? 5;
}

export function getCustomizationPrice(coffeeId: string, customization: Customization) {
  return getBasePrice(coffeeId)
    + SIZE_PRICES[customization.size]
    + MILK_PRICES[customization.milk]
    + SWEETNESS_PRICES[customization.sweetness]
    + EXTRA_PRICES[customization.extra];
}

export function formatPrice(value: number) {
  return `$${value.toFixed(2)}`;
}

export function loadCart() {
  return readJson<CartItem[]>(CART_KEY, []);
}

function createId(prefix: string) {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? `${prefix}-${crypto.randomUUID()}`
    : `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function addToCart(coffeeId: string, customization: Customization, quantity = 1) {
  const cart = loadCart();
  const unitPrice = getCustomizationPrice(coffeeId, customization);
  const existing = cart.find(item =>
    item.coffeeId === coffeeId
    && item.customization.size === customization.size
    && item.customization.milk === customization.milk
    && item.customization.sweetness === customization.sweetness
    && item.customization.extra === customization.extra,
  );

  const next = existing
    ? cart.map(item => item.id === existing.id ? { ...item, quantity: item.quantity + quantity } : item)
    : [...cart, { id: createId('cart'), coffeeId, quantity, customization, unitPrice, addedAt: new Date().toISOString() }];
  writeJson(CART_KEY, next);
  return next;
}

export function updateCartQuantity(id: string, quantity: number) {
  const next = loadCart().map(item => item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item);
  writeJson(CART_KEY, next);
  return next;
}

export function removeFromCart(id: string) {
  const next = loadCart().filter(item => item.id !== id);
  writeJson(CART_KEY, next);
  return next;
}

export function clearCart() {
  writeJson(CART_KEY, []);
}

export function getCartTotal(items = loadCart()) {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

export function loadOrders() {
  return readJson<Order[]>(ORDERS_KEY, []);
}

export function createOrder(input: Omit<Order, 'id' | 'createdAt' | 'status'>) {
  const order: Order = {
    ...input,
    id: `CD-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    status: 'Order Placed',
  };
  writeJson(ORDERS_KEY, [order, ...loadOrders()]);
  clearCart();
  return order;
}

export function getOrder(id: string) {
  return loadOrders().find(order => order.id === id);
}

export function advanceOrderStatus(id: string) {
  const order = getOrder(id);
  if (!order) return undefined;
  const statuses: OrderStatus[] = ['Order Placed', 'Preparing', 'Ready', 'Completed'];
  const nextStatus = statuses[Math.min(statuses.indexOf(order.status) + 1, statuses.length - 1)];
  const updated = { ...order, status: nextStatus };
  writeJson(ORDERS_KEY, loadOrders().map(item => item.id === id ? updated : item));
  return updated;
}

export function reorder(order: Order) {
  const current = loadCart();
  const next = [...current, ...order.items.map(item => ({ ...item, id: createId('cart'), addedAt: new Date().toISOString() }))];
  writeJson(CART_KEY, next);
  return next;
}

export function loadFavorites() {
  return readJson<string[]>(FAVORITES_KEY, []);
}

export function toggleFavorite(coffeeId: string) {
  const favorites = loadFavorites();
  const next = favorites.includes(coffeeId)
    ? favorites.filter(id => id !== coffeeId)
    : [...favorites, coffeeId];
  writeJson(FAVORITES_KEY, next);
  return next;
}

export function isFavorite(coffeeId: string) {
  return loadFavorites().includes(coffeeId);
}