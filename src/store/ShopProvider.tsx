import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { products, type Product } from "../data/products";
import { ShopContext, type CartLine } from "./shopTypes";

function readStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>(() =>
    readStorage("nexa-cart", []),
  );
  const [wishlist, setWishlist] = useState<string[]>(() =>
    readStorage("nexa-wishlist", []),
  );

  useEffect(
    () => localStorage.setItem("nexa-cart", JSON.stringify(cart)),
    [cart],
  );
  useEffect(
    () => localStorage.setItem("nexa-wishlist", JSON.stringify(wishlist)),
    [wishlist],
  );

  const addToCart = useCallback(
    (product: Product, quantity = 1, color?: string, size?: string) => {
      setCart((current) => {
        const match = current.find(
          (line) =>
            line.productId === product.id &&
            line.color === color &&
            line.size === size,
        );
        return match
          ? current.map((line) =>
              line === match
                ? {
                    ...line,
                    quantity: Math.min(product.stock, line.quantity + quantity),
                  }
                : line,
            )
          : [
              ...current,
              {
                productId: product.id,
                quantity: Math.min(product.stock, quantity),
                color,
                size,
              },
            ];
      });
    },
    [],
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number, color?: string, size?: string) => {
      const product = products.find((item) => item.id === productId);
      const adjustedQuantity = product
        ? Math.min(quantity, product.stock)
        : quantity;
      setCart((current) =>
        quantity < 1
          ? current.filter(
              (line) =>
                !(
                  line.productId === productId &&
                  line.color === color &&
                  line.size === size
                ),
            )
          : current.map((line) =>
              line.productId === productId &&
              line.color === color &&
              line.size === size
                ? { ...line, quantity: adjustedQuantity }
                : line,
            ),
      );
    },
    [],
  );
  const removeFromCart = useCallback(
    (productId: string, color?: string, size?: string) =>
      setCart((current) =>
        current.filter(
          (line) =>
            !(
              line.productId === productId &&
              line.color === color &&
              line.size === size
            ),
        ),
      ),
    [],
  );
  const toggleWishlist = useCallback(
    (productId: string) =>
      setWishlist((current) =>
        current.includes(productId)
          ? current.filter((id) => id !== productId)
          : [...current, productId],
      ),
    [],
  );
  const clearCart = useCallback(() => setCart([]), []);
  const itemCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const value = useMemo(
    () => ({
      cart,
      wishlist,
      itemCount,
      addToCart,
      updateQuantity,
      removeFromCart,
      toggleWishlist,
      clearCart,
    }),
    [
      cart,
      wishlist,
      itemCount,
      addToCart,
      updateQuantity,
      removeFromCart,
      toggleWishlist,
      clearCart,
    ],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}
