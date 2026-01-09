import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/product';

export interface CartItem extends Product {
    quantity: number;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    addItem: (product: Product) => void;
    removeItem: (productId: number) => void;
    updateQuantity: (productId: number, delta: number) => void;
    toggleCart: () => void;
    clearCart: () => void;
    totalItems: () => number;
    totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            addItem: (product) => {
                const items = get().items;
                const existingItem = items.find((item) => item.id === product.id);

                if (existingItem) {
                    set({
                        items: items.map((item) =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                        isOpen: true, // Auto-open cart on add
                    });
                } else {
                    set({
                        items: [...items, { ...product, quantity: 1 }],
                        isOpen: true,
                    });
                }
            },
            removeItem: (productId) => {
                set({
                    items: get().items.filter((item) => item.id !== productId),
                });
            },
            updateQuantity: (productId, delta) => {
                const items = get().items;
                set({
                    items: items
                        .map((item) => {
                            if (item.id === productId) {
                                const newQuantity = item.quantity + delta;
                                return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
                            }
                            return item;
                        }),
                });
            },
            toggleCart: () => set({ isOpen: !get().isOpen }),
            clearCart: () => set({ items: [] }),
            totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
            totalPrice: () =>
                get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        }),
        {
            name: 'cart-storage',
            partialize: (state) => ({ items: state.items }), // Only persist items, not isOpen state
        }
    )
);
