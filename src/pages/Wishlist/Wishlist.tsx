import { useShop } from "../../store/useShop";
import { products } from "../../data/products";
import { ProductGrid } from "../../components/products/ProductGrid";
import "../../components/products/catalog.css";

export function Wishlist() {
  const { wishlist } = useShop();
  const saved = products.filter((product) => wishlist.includes(product.id));
  return (
    <div className="wishlist-page page-width">
      <div className="page-intro">
        <span className="eyebrow">YOUR SHORTLIST</span>
        <h1>Saved for later.</h1>
        <p>
          {saved.length} {saved.length === 1 ? "product" : "products"} in your
          wishlist.
        </p>
      </div>
      <ProductGrid items={saved} />
    </div>
  );
}
