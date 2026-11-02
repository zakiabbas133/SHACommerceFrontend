import { createContext, useContext } from "react";

export type StoreUI = {
  notify: (message: string) => void;
  openCart: () => void;
};

export const StoreUIContext = createContext<StoreUI | null>(null);

export function useStoreUI() {
  const context = useContext(StoreUIContext);
  if (!context) throw new Error("useStoreUI must be used within StoreLayout");
  return context;
}
