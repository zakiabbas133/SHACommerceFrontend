import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CartContents } from "../../components/cart/CartContents";
import "../../styles/commerce.css";

export function Cart() {
  return (
    <div className="cart-page page-width">
      <div className="page-intro">
        <span className="eyebrow">YOUR GEAR, READY TO GO</span>
        <h1>Your cart.</h1>
        <p>Product quantities and availability can change before checkout.</p>
      </div>
      <div className="cart-page-grid">
        <CartContents />
        <aside className="cart-assurance">
          <strong>Every order, protected.</strong>
          <p>Genuine products, secure demo checkout and clear warranty info.</p>
          <Link to="/account">
            Need help choosing? <ArrowRight size={14} />
          </Link>
        </aside>
      </div>
    </div>
  );
}
