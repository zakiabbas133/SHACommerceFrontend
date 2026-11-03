import { useState, type ChangeEvent, type SubmitEvent } from "react";
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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [phoneNumber, setPhoneNumber] = useState("");
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
  const clearFieldError = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.currentTarget.name;
    const value = event.currentTarget.value.trim();
    const valid =
      name === "email"
        ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        : value.length > 0;
    if (!valid) return;
    setFieldErrors((current) => {
      if (!current[name]) return current;
      const updated = { ...current };
      delete updated[name];
      return updated;
    });
  };
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
    const form = event.currentTarget;
    const data = new FormData(form);
    const errors = validateCheckout(data, sameAddress);
    setFieldErrors(errors);
    const firstError = Object.keys(errors)[0];
    if (firstError) {
      const fieldName = firstError === "phone" ? "phone-local" : firstError;
      form.querySelector<HTMLInputElement>(`[name="${fieldName}"]`)?.focus();
      return;
    }
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
      <form className="checkout-layout" onSubmit={placeOrder} noValidate>
        <div className="checkout-form">
          {Object.keys(fieldErrors).length > 0 && (
            <div className="checkout-error-summary" role="alert">
              <strong>A few details need your attention</strong>
              <span>
                Check the highlighted fields below so we can deliver your order
                and send your confirmation.
              </span>
            </div>
          )}
          <section className="checkout-section">
            <div className="checkout-section-title">
              <span>01</span>
              <h2>Contact</h2>
              {/* <Link to="/login">Sign in</Link> */}
            </div>
            <div className="form-grid">
              <Field
                label="Email address"
                name="email"
                type="email"
                autoComplete="email"
                required
                error={fieldErrors.email}
                onChange={clearFieldError}
              />
              <PhoneField
                value={phoneNumber}
                error={fieldErrors.phone}
                onChange={(value) => {
                  setPhoneNumber(value);
                  if (/^3\d{9}$/.test(value)) {
                    setFieldErrors((current) => {
                      if (!current.phone) return current;
                      const updated = { ...current };
                      delete updated.phone;
                      return updated;
                    });
                  }
                }}
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
                error={fieldErrors.firstName}
                onChange={clearFieldError}
              />
              <Field
                label="Last name"
                name="lastName"
                autoComplete="family-name"
                required
                error={fieldErrors.lastName}
                onChange={clearFieldError}
              />
              <Field
                label="Address"
                name="address"
                autoComplete="street-address"
                required
                full
                error={fieldErrors.address}
                onChange={clearFieldError}
              />
              <Field
                label="Apartment, suite, etc. (optional)"
                name="apartment"
                autoComplete="address-line2"
                full
                onChange={clearFieldError}
              />
              <Field
                label="City"
                name="city"
                autoComplete="address-level2"
                required
                error={fieldErrors.city}
                onChange={clearFieldError}
              />
              <Field
                label="Postal code"
                name="postalCode"
                autoComplete="postal-code"
                required
                error={fieldErrors.postalCode}
                onChange={clearFieldError}
              />
              <Field
                label="Country"
                name="country"
                autoComplete="country"
                required
                full
                value="Pakistan"
                disabled
              />
            </div>
            <label className="check-row">
              <input
                type="checkbox"
                checked={sameAddress}
                onChange={(event) => {
                  setSameAddress(event.target.checked);
                  if (event.target.checked) {
                    setFieldErrors((current) => {
                      const updated = { ...current };
                      delete updated.billingAddress;
                      return updated;
                    });
                  }
                }}
              />{" "}
              Billing address is the same as delivery
            </label>
            {!sameAddress && (
              <Field
                label="Billing address"
                name="billingAddress"
                required
                full
                error={fieldErrors.billingAddress}
                onChange={clearFieldError}
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
  value,
  disabled = false,
  error,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  full?: boolean;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  error?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label
      className={`form-field ${full ? "full-field" : ""} ${error ? "has-error" : ""}`}
    >
      {label}
      <input
        type={type}
        name={name}
        autoComplete={autoComplete}
        aria-required={required}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        aria-disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        onChange={onChange}
        className={disabled ? "disabled-form-field" : ""}
      />
      {error && (
        <span className="field-error" id={`${name}-error`}>
          {error}
        </span>
      )}
    </label>
  );
}

function PhoneField({
  value,
  error,
  onChange,
}: {
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className={`form-field ${error ? "has-error" : ""}`}>
      Phone number
      <span className="phone-input">
        <span aria-hidden="true">+92</span>
        <input
          type="tel"
          name="phone-local"
          autoComplete="tel-national"
          inputMode="numeric"
          maxLength={18}
          aria-required="true"
          value={value}
          placeholder="300 1234567"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "phone-error" : "phone-help"}
          onChange={(event) => {
            const digits = event.currentTarget.value.replace(/\D/g, "");
            const localNumber = digits.startsWith("92")
              ? digits.slice(2)
              : digits.startsWith("0")
                ? digits.slice(1)
                : digits;
            onChange(localNumber.slice(0, 10));
          }}
        />
      </span>
      <input type="hidden" name="phone" value={`+92${value}`} />
      {error ? (
        <span className="field-error" id="phone-error">
          {error}
        </span>
      ) : (
        <span className="field-hint" id="phone-help">
          Enter 10 digits after +92, starting with 3. Example: 3001234567.
        </span>
      )}
    </label>
  );
}

function validateCheckout(
  data: FormData,
  sameAddress: boolean,
): Record<string, string> {
  const errors: Record<string, string> = {};
  const value = (name: string) => String(data.get(name) || "").trim();

  if (!value("email")) {
    errors.email =
      "Enter an email address so we can send your order confirmation.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value("email"))) {
    errors.email =
      "Check your email address. It should look like name@example.com.";
  }
  if (!/^\+923\d{9}$/.test(value("phone"))) {
    errors.phone =
      "Enter 10 digits after +92. Pakistani mobile numbers start with 3, for example 3001234567.";
  }
  if (!value("firstName")) {
    errors.firstName =
      "Enter your first name so the parcel is addressed to you.";
  }
  if (!value("lastName")) {
    errors.lastName =
      "Enter your last name as it should appear on the delivery.";
  }
  if (!value("address")) {
    errors.address =
      "Enter the street address where you want your order delivered.";
  }
  if (!value("city")) {
    errors.city = "Enter the city or town for this delivery address.";
  }
  if (!value("postalCode")) {
    errors.postalCode =
      "Enter your postal or ZIP code to help the courier find you.";
  }
  if (!sameAddress && !value("billingAddress")) {
    errors.billingAddress = "Enter the address used for your billing details.";
  }
  return errors;
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
