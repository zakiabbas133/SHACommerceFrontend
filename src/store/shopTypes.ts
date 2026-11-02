import { createContext } from "react";
import type { Product } from "../data/products";

export type CartLine = {
  productId: string;
  quantity: number;
  color?: string;
  size?: string;
};
export type ShopContextValue = {
  cart: CartLine[];
  wishlist: string[];
  itemCount: number;
  addToCart: (
    product: Product,
    quantity?: number,
    color?: string,
    size?: string,
  ) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    color?: string,
    size?: string,
  ) => void;
  removeFromCart: (productId: string, color?: string, size?: string) => void;
  toggleWishlist: (productId: string) => void;
  clearCart: () => void;
};

export const ShopContext = createContext<ShopContextValue | null>(null);
