import { useState, type SubmitEvent } from "react";
import { ArrowRight, Check, ShieldCheck, Truck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { formatPrice, products } from "../../data/products";
import { useShop } from "../../store/useShop";
import { EmptyState } from "../../components/common/EmptyState";
import "../../styles/commerce.css";
import type { DemoOrder } from "../../types/catalog";

export function Checkout() {
  const { cart, clearCart } = useShop();
  const navigate = useNavigate();
  const [sameAddress, setSameAddress] = useState(true);
  const subtotal = cart.reduce(
    (sum, line) =>
      sum +
      (products.find((item) => item.id === line.productId)?.price || 0) *
        line.quantity,
    0,
  );
  const [coupon, setCoupon] = useState(
    () => localStorage.getItem("nexa-coupon") || "",
  );
  const [couponApplied, setCouponApplied] = useState(
    () => localStorage.getItem("nexa-coupon") === "NEXA10",
  );
  const [couponMessage, setCouponMessage] = useState(() =>
    localStorage.getItem("nexa-coupon") === "NEXA10"
      ? "NEXA10 applied: 10% off."
      : "",
  );
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal >= 150 ? 0 : 12;
  const total = subtotal - discount + shipping;
  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === "NEXA10") {
      setCoupon("NEXA10");
      setCouponApplied(true);
      localStorage.setItem("nexa-coupon", "NEXA10");
      setCouponMessage("NEXA10 applied: 10% off.");
    } else {
      setCouponApplied(false);
      localStorage.removeItem("nexa-coupon");
      setCouponMessage("Code not recognized. Try NEXA10.");
    }
  };
  const placeOrder = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!cart.length) return;
    const data = new FormData(event.currentTarget);
    const order: DemoOrder = {
      id: `NX-${Date.now().toString().slice(-7)}`,
      date: new Date().toLocaleDateString(),
      total,
      email: String(data.get("email")),
      items: cart,
    };
    const previous = safeOrders();
    localStorage.setItem("nexa-orders", JSON.stringify([order, ...previous]));
    localStorage.setItem("nexa-last-order", JSON.stringify(order));
    localStorage.removeItem("nexa-coupon");
    clearCart();
    navigate("/order-confirmation");
  };
  if (!cart.length)
    return (
      <div className="checkout-empty page-width">
        <EmptyState
          title="Your cart is waiting for its first upgrade."
          text="Add products before heading to checkout."
        />
        <Link className="button button-primary" to="/shop">
          Explore products <ArrowRight size={15} />
        </Link>
      </div>
    );
  return (
    <div className="checkout-page page-width">
      <header className="checkout-top">
        <span className="eyebrow">SECURE DEMO CHECKOUT</span>
        <h1>Almost yours.</h1>
        <p>This is a demo checkout. No payment is collected or processed.</p>
      </header>
      <form className="checkout-layout" onSubmit={placeOrder}>
        <div className="checkout-form">
          <section className="checkout-section">
            <div className="checkout-section-title">
              <span>01</span>
              <h2>Contact</h2>
              <Link to="/login">Sign in</Link>
            </div>
            <div className="form-grid">
              <Field
                label="Email address"
                name="email"
                type="email"
                autoComplete="email"
                required
              />
              <Field
                label="Phone (optional)"
                name="phone"
                type="tel"
                autoComplete="tel"
              />
            </div>
          </section>
          <section className="checkout-section">
            <div className="checkout-section-title">
              <span>02</span>
              <h2>Delivery details</h2>
            </div>
            <div className="form-grid">
              <Field
                label="First name"
                name="firstName"
                autoComplete="given-name"
                required
              />
              <Field
                label="Last name"
                name="lastName"
                autoComplete="family-name"
                required
              />
              <Field
                label="Address"
                name="address"
                autoComplete="street-address"
                required
                full
                placeholder="Street address"
              />
              <Field
                label="Apartment, suite, etc. (optional)"
                name="apartment"
                autoComplete="address-line2"
                full
              />
              <Field
                label="City"
                name="city"
                autoComplete="address-level2"
                required
              />
              <Field
                label="Postal code"
                name="postalCode"
                autoComplete="postal-code"
                required
              />
              <label className="form-field full-field">
                Country / region
                <select name="country" defaultValue="United States">
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                  <option>Australia</option>
                </select>
              </label>
            </div>
            <label className="check-row">
              <input
                type="checkbox"
                checked={sameAddress}
                onChange={(event) => setSameAddress(event.target.checked)}
              />{" "}
              Billing address is the same as delivery
            </label>
            {!sameAddress && (
              <Field
                label="Billing address"
                name="billingAddress"
                required
                full
              />
            )}
          </section>
          <section className="checkout-section">
            <div className="checkout-section-title">
              <span>03</span>
              <h2>Shipping</h2>
            </div>
            <div className="shipping-option">
              <Truck size={18} />
              <span>
                <strong>Standard delivery</strong>
                <small>3–5 business days · tracked</small>
              </span>
              <b>{shipping ? formatPrice(shipping) : "Free"}</b>
            </div>
          </section>
          <section className="checkout-section">
            <div className="checkout-section-title">
              <span>04</span>
              <h2>Payment</h2>
            </div>
            <div className="demo-payment-note">
              <ShieldCheck size={18} />
              <div>
                <strong>Demo payment only</strong>
                <p>
                  No card details requested. This demo does not connect to a
                  payment provider.
                </p>
              </div>
            </div>
            <div className="payment-option">
              <input type="radio" name="payment" defaultChecked />
              <span>Demo order — no charge will be made</span>
              <span className="demo-chip">DEMO</span>
            </div>
          </section>
        </div>
        <aside className="order-summary">
          <h2>
            Order summary{" "}
            <span>
              {cart.reduce((sum, line) => sum + line.quantity, 0)} items
            </span>
          </h2>
          {cart.map((line) => {
            const product = products.find((item) => item.id === line.productId);
            if (!product) return null;
            return (
              <div
                className="summary-line"
                key={`${line.productId}-${line.color}-${line.size}`}
              >
                <div className="summary-product-image">
                  <img src={product.images[0]} alt="" />
                  <span>{line.quantity}</span>
                </div>
                <span>
                  {product.name}
                  <small>
                    {product.brand} · {product.model}
                  </small>
                </span>
                <strong>{formatPrice(product.price * line.quantity)}</strong>
              </div>
            );
          })}
          <div className="coupon-form">
            <input
              aria-label="Discount code"
              placeholder="Discount code"
              value={coupon}
              onChange={(event) => {
                setCoupon(event.target.value);
                setCouponApplied(false);
                localStorage.removeItem("nexa-coupon");
                setCouponMessage("");
              }}
            />
            <button type="button" onClick={applyCoupon}>
              {couponApplied ? "Applied" : "Apply"}
            </button>
          </div>
          {couponMessage && (
            <p className={`coupon-message ${discount ? "coupon-success" : ""}`}>
              {couponMessage}
            </p>
          )}
          <div className="summary-totals">
            <div>
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="discount-row">
                <span>NEXA10</span>
                <span>−{formatPrice(discount)}</span>
              </div>
            )}
            <div>
              <span>Shipping</span>
              <span>{shipping ? formatPrice(shipping) : "Free"}</span>
            </div>
            <div className="summary-total">
              <strong>Total</strong>
              <strong>{formatPrice(total)}</strong>
            </div>
          </div>
          <button type="submit" className="button button-primary place-order">
            Place demo order <ArrowRight size={15} />
          </button>
          <p className="checkout-legal">
            No payment is taken. Your order is stored only in this browser.
          </p>
          <div className="secure-note">
            <Check size={14} /> Your details stay private
          </div>
        </aside>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  required = false,
  full = false,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  full?: boolean;
  placeholder?: string;
}) {
  return (
    <label className={`form-field ${full ? "full-field" : ""}`}>
      {label}
      <input
        type={type}
        name={name}
        autoComplete={autoComplete}
        required={required}
        placeholder={placeholder}
      />
    </label>
  );
}

function safeOrders(): DemoOrder[] {
  try {
    return JSON.parse(
      localStorage.getItem("nexa-orders") || "[]",
    ) as DemoOrder[];
  } catch {
    return [];
  }
}
