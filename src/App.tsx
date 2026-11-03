import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { StoreLayout } from "./components/layout/StoreLayout";
import { ShopProvider } from "./store/ShopProvider";

const Home = lazy(() =>
  import("./pages/Home/Home").then((module) => ({ default: module.Home })),
);
const Shop = lazy(() =>
  import("./pages/Shop/Shop").then((module) => ({ default: module.Shop })),
);
const Categories = lazy(() =>
  import("./pages/Categories/Categories").then((module) => ({
    default: module.Categories,
  })),
);
const Category = lazy(() =>
  import("./pages/Category/Category").then((module) => ({
    default: module.Category,
  })),
);
const SearchResults = lazy(() =>
  import("./pages/Search/Search").then((module) => ({
    default: module.SearchResults,
  })),
);
const ProductDetails = lazy(() =>
  import("./pages/ProductDetails/ProductDetails").then((module) => ({
    default: module.ProductDetails,
  })),
);
const Cart = lazy(() =>
  import("./pages/Cart/Cart").then((module) => ({ default: module.Cart })),
);
const Wishlist = lazy(() =>
  import("./pages/Wishlist/Wishlist").then((module) => ({
    default: module.Wishlist,
  })),
);
const Checkout = lazy(() =>
  import("./pages/Checkout/Checkout").then((module) => ({
    default: module.Checkout,
  })),
);
const OrderConfirmation = lazy(() =>
  import("./pages/OrderConfirmation/OrderConfirmation").then((module) => ({
    default: module.OrderConfirmation,
  })),
);
const Account = lazy(() =>
  import("./pages/Account/Account").then((module) => ({
    default: module.Account,
  })),
);
const Orders = lazy(() =>
  import("./pages/Orders/Orders").then((module) => ({
    default: module.Orders,
  })),
);
const Login = lazy(() =>
  import("./pages/Login/Login").then((module) => ({ default: module.Login })),
);
const Register = lazy(() =>
  import("./pages/Register/Register").then((module) => ({
    default: module.Register,
  })),
);
const NotFound = lazy(() =>
  import("./pages/NotFound/NotFound").then((module) => ({
    default: module.NotFound,
  })),
);

export default function App() {
  return (
    <ShopProvider>
      <BrowserRouter>
        <Suspense fallback={<WebsiteLoader />}>
          <Routes>
            <Route element={<StoreLayout />}>
              <Route index element={<Home />} />
              <Route path="shop" element={<Shop />} />
              <Route path="categories" element={<Categories />} />
              <Route path="category/:slug" element={<Category />} />
              <Route path="search" element={<SearchResults />} />
              <Route path="product/:slug" element={<ProductDetails />} />
              <Route path="cart" element={<Cart />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="checkout" element={<Checkout />} />
              <Route
                path="order-confirmation"
                element={<OrderConfirmation />}
              />
              <Route path="account" element={<Account />} />
              <Route path="orders" element={<Orders />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route
                path="account/orders"
                element={<Navigate to="/orders" replace />}
              />
              <Route
                path="account/login"
                element={<Navigate to="/login" replace />}
              />
              <Route
                path="account/register"
                element={<Navigate to="/register" replace />}
              />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ShopProvider>
  );
}

function WebsiteLoader() {
  return (
    <div
      className="route-loading"
      role="status"
      aria-live="polite"
      aria-label="Loading NexaTech"
    >
      <div className="route-loader-grid" aria-hidden="true" />
      <div className="route-loader-content">
        <div className="route-loader-mark" aria-hidden="true">
          <span className="route-loader-orbit route-loader-orbit-outer" />
          <span className="route-loader-orbit route-loader-orbit-inner" />
          <span className="route-loader-spark route-loader-spark-one" />
          <span className="route-loader-spark route-loader-spark-two" />
          <span className="route-loader-core">N</span>
        </div>
        <span className="route-loader-wordmark">
          nexa<span>tech</span>
        </span>
        <h1>Getting your next upgrade ready</h1>
        <p>Thoughtful tech. Just a moment.</p>
        <div className="route-loader-progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  );
}
