import { useContext } from "react";
import { ShopContext } from "./shopTypes";

export function useShop() {
  const value = useContext(ShopContext);
  if (!value) throw new Error("useShop must be used within ShopProvider");
  return value;
}
