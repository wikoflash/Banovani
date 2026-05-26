import { create } from 'zustand';

export type CartItem = {
  productId: string;
  variantId: string;
  name: string;
  slug: string;
  image: string;
  color?: string;
  size?: string;
  quantity: number;
  unitPrice: number;
};

type CartStore = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotalItems: () => number;
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (item) => {
    set((state) => {
      const existing = state.items.findIndex((i) => i.variantId === item.variantId);
      if (existing >= 0) {
        const updated = [...state.items];
        updated[existing] = {
          ...updated[existing],
          quantity: updated[existing].quantity + item.quantity,
        };
        return { items: updated };
      }
      return { items: [...state.items, item] };
    });
  },
  removeItem: (variantId) => {
    set((state) => ({ items: state.items.filter((i) => i.variantId !== variantId) }));
  },
  updateQuantity: (variantId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(variantId);
      return;
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.variantId === variantId ? { ...i, quantity } : i
      ),
    }));
  },
  clearCart: () => set({ items: [] }),
  getSubtotal: () =>
    get().items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
  getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
}));
