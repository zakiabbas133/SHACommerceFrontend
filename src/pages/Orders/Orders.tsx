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
              <div className="order-card-heading">
                <span className="eyebrow">ORDER {order.id}</span>
                <p>
                  {order.date} ·{" "}
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                  items
                </p>
              </div>
              <strong>{formatPrice(order.total)}</strong>
              <div className="order-products">
                {order.items.map((item, index) => {
                  const product = products.find(
                    (entry) => entry.id === item.productId,
                  );
                  const name = item.name || product?.name || "Saved order item";
                  const brand = item.brand || product?.brand;
                  const model = item.model || product?.model;
                  const image = item.image || product?.images[0];
                  const unitPrice = item.unitPrice ?? product?.price ?? 0;
                  const lineTotal =
                    item.lineTotal ?? unitPrice * item.quantity;
                  const itemKey = `${item.productId}-${item.color || ""}-${item.size || ""}-${index}`;

                  return (
                    <article className="order-product" key={itemKey}>
                      {product ? (
                        <Link
                          className="order-product-image"
                          to={`/product/${product.slug}`}
                          aria-label={`View ${name}`}
                        >
                          {image && <img src={image} alt="" loading="lazy" />}
                          <span className="order-product-quantity">
                            {item.quantity}
                          </span>
                        </Link>
                      ) : (
                        <div className="order-product-image">
                          {image && <img src={image} alt="" loading="lazy" />}
                          <span className="order-product-quantity">
                            {item.quantity}
                          </span>
                        </div>
                      )}
                      <div className="order-product-details">
                        {brand && (
                          <span className="order-product-brand">{brand}</span>
                        )}
                        {product ? (
                          <Link
                            className="order-product-name"
                            to={`/product/${product.slug}`}
                          >
                            {name}
                          </Link>
                        ) : (
                          <strong className="order-product-name">{name}</strong>
                        )}
                        {model && (
                          <span className="order-product-model">
                            Model · {model}
                          </span>
                        )}
                      </div>
                      <div className="order-product-price">
                        <span>
                          {formatPrice(unitPrice)} <i>each</i>
                        </span>
                        <strong>{formatPrice(lineTotal)} Total</strong>
                      </div>
                    </article>
                  );
                })}
              </div>
              <span className="order-status">
                <Check size={13} /> Order placed
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
