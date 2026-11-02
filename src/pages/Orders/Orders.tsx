import { Check, PackageOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice, products } from "../../data/products";
import { EmptyState } from "../../components/common/EmptyState";
import "../../styles/commerce.css";
import "../../components/products/catalog.css";
import type { DemoOrder } from "../../types/catalog";

function getOrders(): DemoOrder[] {
  try {
    return JSON.parse(
      localStorage.getItem("nexa-orders") || "[]",
    ) as DemoOrder[];
  } catch {
    return [];
  }
}

export function Orders() {
  const orders = getOrders();
  return (
    <div className="orders-page page-width">
      <div className="page-intro">
        <span className="eyebrow">YOUR NEXATECH</span>
        <h1>Order history.</h1>
        <p>Demo orders placed in this browser.</p>
      </div>
      {orders.length ? (
        <div className="orders-list">
          {orders.map((order) => (
            <article className="order-card" key={order.id}>
              <div>
                <span className="eyebrow">ORDER {order.id}</span>
                <p>
                  {order.date} ·{" "}
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                  items
                </p>
                <div className="order-products">
                  {order.items.map((item) => {
                    const product = products.find(
                      (entry) => entry.id === item.productId,
                    );
                    return product ? (
                      <span key={product.id}>
                        {product.name} × {item.quantity}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
              <strong>{formatPrice(order.total)}</strong>
              <span className="order-status">
                <Check size={13} /> Demo order placed
              </span>
            </article>
          ))}
        </div>
      ) : (
        <>
          <EmptyState
            title="No orders yet."
            text="Your order history will appear here after you place a demo order."
          />
          <div className="orders-help">
            <PackageOpen size={17} /> Orders are only stored in your current
            browser.<Link to="/shop">Browse products</Link>
          </div>
        </>
      )}
    </div>
  );
}
