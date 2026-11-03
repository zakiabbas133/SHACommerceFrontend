import { useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  Star,
  Truck,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  discountPercent,
  formatPrice,
  productCategory,
  products,
} from "../../data/products";
import { useShop } from "../../store/useShop";
import { useStoreUI } from "../../context/StoreUIContext";
import { ProductGrid } from "../../components/products/ProductGrid";
import { SectionHeading } from "../../components/common/SectionHeading";
import { NotFound } from "../NotFound/NotFound";
import "./ProductDetails.css";

export function ProductDetails() {
  const { slug } = useParams();
  const product = products.find((item) => item.slug === slug);
  const { addToCart, wishlist, toggleWishlist } = useShop();
  const { notify, openCart } = useStoreUI();
  const navigate = useNavigate();
  const [imageIndex, setImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("Overview");
  if (!product) return <NotFound />;
  const category = productCategory(product);
  const related = products
    .filter(
      (item) =>
        item.categoryId === product.categoryId && item.id !== product.id,
    )
    .slice(0, 4);
  const add = (checkout = false) => {
    if (!product.stock) return notify("This item is currently out of stock.");
    addToCart(product, quantity);
    if (checkout) navigate("/checkout");
    else {
      notify(`${product.name} added to cart`);
      openCart();
    }
  };
  const specs = Object.entries(product.specs);
  const imageSwitch = (direction: number) =>
    setImageIndex(
      (index) =>
        (index + direction + product.images.length) % product.images.length,
    );
  return (
    <div className="product-detail page-width">
      <div className="breadcrumbs">
        <Link to="/">Home</Link>
        <ChevronRight size={13} />
        <Link to={`/category/${category?.slug || product.categoryId}`}>
          {category?.name || "Products"}
        </Link>
        <ChevronRight size={13} />
        <span>{product.name}</span>
      </div>
      <div className="product-detail-layout">
        <section className="product-gallery" aria-label="Product images">
          <div className="gallery-main">
            <img
              key={product.images[imageIndex]}
              src={product.images[imageIndex]}
              alt={`${product.name} product view ${imageIndex + 1}`}
            />
            <span className="gallery-count">
              {String(imageIndex + 1).padStart(2, "0")} /{" "}
              {String(product.images.length).padStart(2, "0")}
            </span>
            <button
              className="gallery-arrow prev"
              onClick={() => imageSwitch(-1)}
              aria-label="Previous image"
            >
              <ChevronLeft />
            </button>
            <button
              className="gallery-arrow next"
              onClick={() => imageSwitch(1)}
              aria-label="Next image"
            >
              <ChevronRight />
            </button>
          </div>
          <div className="gallery-thumbs">
            {product.images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                className={index === imageIndex ? "thumb-selected" : ""}
                onClick={() => setImageIndex(index)}
                aria-label={`View product image ${index + 1}`}
              >
                <img src={image} alt="" style={{borderRadius: 6}} />
              </button>
            ))}
          </div>
        </section>
        <section className="product-detail-info">
          <div className="product-brand-line">
            <span>{product.brand}</span>
            <span>MODEL / {product.model}</span>
          </div>
          <span className="eyebrow">
            {category?.name || product.categoryId}
          </span>
          <h1>{product.name}</h1>
          <p className="product-model">Part no. {product.sku}</p>
          <div className="detail-rating">
            <span className="rating">
              <Star size={13} fill="currentColor" /> {product.rating}
            </span>
            <a href="#reviews">{product.reviews} verified ratings</a>
          </div>
          <div className="detail-price">
            {formatPrice(product.price)}
            {product.originalPrice && (
              <>
                <del>{formatPrice(product.originalPrice)}</del>
                <span className="discount-label">
                  Save {discountPercent(product)}%
                </span>
              </>
            )}
          </div>
          <p className="detail-description">{product.description}</p>
          <div className="detail-stock">
            <span
              className={
                product.stock
                  ? "stock-indicator"
                  : "stock-indicator unavailable"
              }
            />
            {product.stock
              ? `In stock · ${product.stock} available`
              : "Currently out of stock"}
            <span>Ships from NexaTech</span>
          </div>
          <div className="detail-buy-row">
            <div className="quantity-control">
              <button
                aria-label="Decrease quantity"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus size={14} />
              </button>
              <span>{quantity}</span>
              <button
                aria-label="Increase quantity"
                onClick={() =>
                  setQuantity(
                    Math.min(Math.max(product.stock, 1), quantity + 1),
                  )
                }
              >
                <Plus size={14} />
              </button>
            </div>
            <button
              className="button button-primary add-cart-button"
              disabled={!product.stock}
              onClick={() => add()}
            >
              {product.stock ? (
                <>
                  Add to cart <ArrowRight size={15} />
                </>
              ) : (
                "Sold out"
              )}
            </button>
            <button
              className={`icon-button detail-wishlist ${wishlist.includes(product.id) ? "is-active" : ""}`}
              onClick={() => {
                toggleWishlist(product.id);
                notify(
                  wishlist.includes(product.id)
                    ? "Removed from wishlist"
                    : "Saved to wishlist",
                );
              }}
              aria-label="Toggle wishlist"
            >
              <Heart
                fill={wishlist.includes(product.id) ? "currentColor" : "none"}
              />
            </button>
          </div>
          <button
            className="buy-now-button"
            disabled={!product.stock}
            onClick={() => add(true)}
          >
            Buy now
          </button>
          <div className="shipping-note">
            <Truck size={16} />
            <span>
              Genuine product · Manufacturer warranty · Easy 30-day returns
            </span>
          </div>
        </section>
      </div>
      <section className="specs-section">
        <div className="specs-heading">
          <span className="eyebrow">KNOW YOUR GEAR</span>
          <h2>Built to the details.</h2>
          <p>Technical specifications provided by the manufacturer.</p>
        </div>
        <div className="specs-content">
          <div className="spec-tabs">
            {["Overview", "Specifications", "Compatibility"].map((tab) => (
              <button
                className={activeTab === tab ? "tab-active" : ""}
                key={tab}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          {activeTab === "Overview" && (
            <div className="spec-overview">
              <p>{product.description}</p>
              <p>
                Always check your system manufacturer's documentation and
                current product support list before purchasing components.
                Specifications may vary by configuration.
              </p>
              <span>Product code: {product.sku}</span>
            </div>
          )}
          {activeTab === "Specifications" && (
            <dl className="spec-grid">
              {specs.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          )}
          {activeTab === "Compatibility" && (
            <div className="compatibility-copy">
              {product.compatibility?.length ? (
                <>
                  <span className="compatibility-label">
                    <Check size={15} /> Manufacturer guidance
                  </span>
                  {product.compatibility.map((text) => (
                    <p key={text}>{text}</p>
                  ))}
                  <p className="compatibility-disclaimer">
                    Compatibility varies by exact configuration. Verify model
                    numbers and vendor documentation before purchase.
                  </p>
                </>
              ) : (
                <>
                  <strong>
                    No verified compatibility data is available for this
                    product.
                  </strong>
                  <p>
                    Check the manufacturer specification or contact support
                    before pairing with other hardware.
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </section>
      <section id="reviews" className="review-summary">
        <span className="eyebrow">REAL-WORLD RATINGS</span>
        <div className="review-big">
          {product.rating}
          <span>★★★★★</span>
          <small>{product.reviews} ratings</small>
        </div>
        <p>
          Ratings are shown for product discovery. Review details are supplied
          by the catalog.
        </p>
      </section>
      <section className="section related-section page-width">
        <SectionHeading
          eyebrow="COMPLETE THE SETUP"
          title="More gear to consider."
          action="Browse the full range"
        />
        <ProductGrid
          items={
            related.length
              ? related
              : products.filter((item) => item.id !== product.id).slice(0, 4)
          }
        />
      </section>
    </div>
  );
}
