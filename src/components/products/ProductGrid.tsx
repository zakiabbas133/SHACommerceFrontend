import type { Product } from "../../data/products";
import { EmptyState } from "../common/EmptyState";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ items }: { items: Product[] }) {
  if (!items.length)
    return (
      <EmptyState
        title="No products found"
        text="Try adjusting your filters, or explore the full range."
      />
    );
  return (
    <div className="product-grid">
      {items.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
