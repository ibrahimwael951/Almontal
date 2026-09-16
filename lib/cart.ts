import { CartItem } from "@/types/cart";

const CART_KEY = "cart";
const CART_UPDATED_EVENT = "cart-updated";

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.log(err);
    return [];
  }
}

function writeCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  // Notify any component listening (e.g. a cart icon/badge in the navbar)
  window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT, { detail: items }));
}

export function getCart(): CartItem[] {
  return readCart();
}

export function getCartCount(): number {
  return readCart().reduce((sum, item) => sum + item.quantity, 0);
}

export function addToCart(item: Omit<CartItem, "quantity">, quantity: number) {
  const cart = readCart();
  const existing = cart.find((c) => c.productId === item.productId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...item, quantity });
  }

  writeCart(cart);
  return cart;
}

export function updateQuantity(productId: string, quantity: number) {
  const cart = readCart();
  const item = cart.find((c) => c.productId === productId);
  if (!item) return cart;

  if (quantity <= 0) {
    return removeFromCart(productId);
  }

  item.quantity = quantity;
  writeCart(cart);
  return cart;
}

export function removeFromCart(productId: string) {
  const cart = readCart().filter((c) => c.productId !== productId);
  writeCart(cart);
  return cart;
}

export function clearCart() {
  writeCart([]);
}

export { CART_UPDATED_EVENT };
