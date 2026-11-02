import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice } from "../../data/products";
import "../../styles/commerce.css";

type Confirmation = { id: string; total: number };
function getOrder(): Confirmation | null {
  try {
    return JSON.parse(
      localStorage.getItem("nexa-last-order") || "null",
    ) as Confirmation | null;
  } catch {
    return null;
  }
}

export function OrderConfirmation() {
  const order = getOrder();
  return (
    <div className="confirmation-page page-width">
      <div className="confirmation-mark">
        <Check size={25} />
      </div>
      <span className="eyebrow">DEMO ORDER CONFIRMED</span>
      <h1>
        Thanks for choosing
        <br />
        <em>NexaTech.</em>
      </h1>
      <p>
        Your demo order has been saved in this browser. No payment was collected
        and no real order was submitted.
      </p>
      {order && (
        <div className="confirmation-order">
          <span>Order reference</span>
          <strong>{order.id}</strong>
          <span>Demo total</span>
          <strong>{formatPrice(order.total)}</strong>
        </div>
      )}
      <div className="confirmation-actions">
        <Link className="button button-primary" to="/shop">
          Keep exploring
        </Link>
        <Link className="text-link" to="/orders">
          View order history
        </Link>
      </div>
    </div>
  );
}
