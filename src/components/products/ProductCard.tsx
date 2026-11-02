import { useState } from "react";
import { Check, Heart, Plus, Star } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import {
  discountPercent,
  formatPrice,
  productCategory,
  type Product,
} from "../../data/products";
import { useShop } from "../../store/useShop";
import { useStoreUI } from "../../context/StoreUIContext";
import "./products.css";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, wishlist, toggleWishlist } = useShop();
  const { notify, openCart } = useStoreUI();
  const [added, setAdded] = useState(false);
  const wished = wishlist.includes(product.id);
  const quickAdd = () => {
    if (!product.stock) return notify("This item is currently out of stock.");
    addToCart(product);
    setAdded(true);
    notify(`${product.name} added to cart`);
    openCart();
    window.setTimeout(() => setAdded(false), 1200);
  };
  const category = productCategory(product);
  return (
    <motion.article
      className="product-card"
      initial={{ opacity: 0, y: 13 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-25px" }}
      transition={{ duration: 0.32 }}
    >
      <div className="product-card-media">
        <Link to={`/product/${product.slug}`} className="product-card-image">
          <img src={product.images[0]} alt={product.name} loading="lazy" />
        </Link>
        {(product.originalPrice || product.isNew || product.bestseller) && (
          <span
            className={`product-badge ${product.originalPrice ? "sale-badge" : ""}`}
          >
            {product.originalPrice
              ? `−${discountPercent(product)}%`
              : product.isNew
                ? "New"
                : "Top rated"}
          </span>
        )}
        <button
          className={`wishlist-toggle ${wished ? "is-active" : ""}`}
          aria-label={
            wished
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          onClick={() => {
            toggleWishlist(product.id);
            notify(wished ? "Removed from wishlist" : "Saved to wishlist");
          }}
        >
          <Heart size={17} fill={wished ? "currentColor" : "none"} />
        </button>
        <button
          className="quick-add"
          disabled={!product.stock}
          onClick={quickAdd}
        >
          {added ? (
            <>
              <Check size={15} /> Added
            </>
          ) : product.stock ? (
            <>
              Add to cart <Plus size={15} />
            </>
          ) : (
            "Sold out"
          )}
        </button>
      </div>
      <div className="product-card-info">
        <div className="product-meta">
          <span>{product.brand}</span>
          <span className="rating">
            <Star size={11} fill="currentColor" /> {product.rating}{" "}
            <small>({product.reviews})</small>
          </span>
        </div>
        <Link to={`/product/${product.slug}`} className="product-name">
          {product.name}
        </Link>
        <span className="product-category">
          {category?.name || product.categoryId} ·{" "}
          {product.specs[Object.keys(product.specs)[0]]}
        </span>
        <div className="product-price">
          <strong>{formatPrice(product.price)}</strong>
          {product.originalPrice && (
            <del>{formatPrice(product.originalPrice)}</del>
          )}
        </div>
        <span className={`stock-note ${product.stock ? "" : "out-of-stock"}`}>
          {product.stock
            ? `In stock · ${product.stock} available`
            : "Currently out of stock"}
        </span>
      </div>
    </motion.article>
  );
}
