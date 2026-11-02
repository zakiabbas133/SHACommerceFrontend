import { useState, type SubmitEvent } from "react";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice, products } from "../../data/products";
import { useShop } from "../../store/useShop";
import { EmptyState } from "../common/EmptyState";

export function CartContents({ onClose }: { onClose?: () => void }) {
  const { cart, updateQuantity, removeFromCart } = useShop();
  const lines = cart
    .map((line) => ({
      ...line,
      product: products.find((item) => item.id === line.productId),
    }))
    .filter(
      (line): line is typeof line & { product: (typeof products)[number] } =>
        !!line.product,
    );
  const subtotal = lines.reduce(
    (sum, line) => sum + line.product.price * line.quantity,
    0,
  );
  const [coupon, setCoupon] = useState(
    () => localStorage.getItem("nexa-coupon") || "",
  );
  const [couponApplied, setCouponApplied] = useState(
    () => localStorage.getItem("nexa-coupon") === "NEXA10",
  );
  const [message, setMessage] = useState("");
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal === 0 || subtotal >= 150 ? 0 : 12;
  const applyCoupon = (event: SubmitEvent) => {
    event.preventDefault();
    if (coupon.trim().toUpperCase() === "NEXA10") {
      setCoupon("NEXA10");
      setCouponApplied(true);
      localStorage.setItem("nexa-coupon", "NEXA10");
      setMessage("NEXA10 applied: 10% off.");
    } else {
      setCouponApplied(false);
      localStorage.removeItem("nexa-coupon");
      setMessage("Code not recognized. Try NEXA10.");
    }
  };
  if (!lines.length)
    return (
      <div className="empty-cart">
        <div className="empty-icon">
          <ShoppingBag size={23} />
        </div>
        <EmptyState
          title="Your cart is waiting for its first upgrade."
          text="Explore the latest components and accessories."
        />
        <Link to="/shop" className="button button-primary" onClick={onClose}>
          Shop products <ArrowRight size={15} />
        </Link>
      </div>
    );
  return (
    <div className="cart-contents">
      <div className="cart-lines">
        {lines.map((line) => (
          <article
            className="cart-line"
            key={`${line.productId}-${line.color}-${line.size}`}
          >
            <Link
              to={`/product/${line.product.slug}`}
              onClick={onClose}
              className="cart-line-image"
            >
              <img src={line.product.images[0]} alt={line.product.name} />
            </Link>
            <div className="cart-line-info">
              <Link to={`/product/${line.product.slug}`} onClick={onClose}>
                {line.product.name}
              </Link>
              <span>
                {line.product.brand} · {line.product.model}
              </span>
              <div className="quantity-control">
                <button
                  aria-label="Decrease quantity"
                  onClick={() =>
                    updateQuantity(
                      line.productId,
                      line.quantity - 1,
                      line.color,
                      line.size,
                    )
                  }
                >
                  <Minus size={12} />
                </button>
                <span>{line.quantity}</span>
                <button
                  aria-label="Increase quantity"
                  onClick={() =>
                    updateQuantity(
                      line.productId,
                      line.quantity + 1,
                      line.color,
                      line.size,
                    )
                  }
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>
            <div className="cart-line-end">
              <strong>{formatPrice(line.product.price * line.quantity)}</strong>
              <button
                className="remove-line"
                aria-label={`Remove ${line.product.name}`}
                onClick={() =>
                  removeFromCart(line.productId, line.color, line.size)
                }
              >
                <Trash2 size={14} />
              </button>
            </div>
          </article>
        ))}
      </div>
      <form className="coupon-form" onSubmit={applyCoupon}>
        <input
          aria-label="Discount code"
          placeholder="Discount code"
          value={coupon}
          onChange={(event) => {
            setCoupon(event.target.value);
            setCouponApplied(false);
            localStorage.removeItem("nexa-coupon");
            setMessage("");
          }}
        />
        <button type="submit">{couponApplied ? "Applied" : "Apply"}</button>
      </form>
      {message && (
        <p className={`coupon-message ${discount ? "coupon-success" : ""}`}>
          {message}
        </p>
      )}
      <div className="cart-totals">
        <div>
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="discount-row">
            <span>NEXA10 · 10% off</span>
            <span>−{formatPrice(discount)}</span>
          </div>
        )}
        <div>
          <span>Shipping</span>
          <span>{shipping ? formatPrice(shipping) : "Free"}</span>
        </div>
        <div className="cart-total">
          <span>Total</span>
          <strong>{formatPrice(subtotal - discount + shipping)}</strong>
        </div>
        <small>Shipping and taxes calculated at checkout.</small>
      </div>
      <Link
        to="/checkout"
        className="button button-primary checkout-button"
        onClick={onClose}
      >
        Secure checkout <ArrowRight size={15} />
      </Link>
      <Link to="/shop" className="continue-shopping" onClick={onClose}>
        Continue shopping
      </Link>
    </div>
  );
}
