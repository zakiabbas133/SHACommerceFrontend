import { useEffect, useState, type SubmitEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  FlameIcon,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { categories, categoryGroups, products } from "../../data/products";
import { useShop } from "../../store/useShop";
import { useStoreUI } from "../../context/StoreUIContext";

export function Header() {
  const { itemCount, wishlist } = useShop();
  const { openCart } = useStoreUI();
  const [menuOpen, setMenuOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<typeof products>([]);
  const [scrolled, setScrolled] = useState(false);
  const [recent, setRecent] = useState<string[]>(() => readRecent());
  const location = useLocation();
  const navigate = useNavigate();
  const isDealsPage =
    location.pathname === "/shop" &&
    new URLSearchParams(location.search).get("filter") === "sale";

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const term = query.trim().toLowerCase();
      setSuggestions(
        term
          ? products
              .filter((product) =>
                `${product.name} ${product.brand} ${product.model} ${product.sku} ${product.categoryId} ${Object.values(product.specs).join(" ")}`
                  .toLowerCase()
                  .includes(term),
              )
              .slice(0, 5)
          : [],
      );
    }, 180);
    return () => window.clearTimeout(timer);
  }, [query]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const search = (event: SubmitEvent) => {
    event.preventDefault();
    if (!query.trim()) return;
    const value = query.trim();
    const updated = [
      value,
      ...recent.filter((item) => item.toLowerCase() !== value.toLowerCase()),
    ].slice(0, 5);
    setRecent(updated);
    localStorage.setItem("nexa-recent-searches", JSON.stringify(updated));
    navigate(`/search?q=${encodeURIComponent(value)}`);
    setSearchOpen(false);
    setMenuOpen(false);
  };
  const dismiss = () => {
    setMenuOpen(false);
    setNavOpen(false);
  };
  return (
    <>
      {/* <div className="announcement">
        <span>GENUINE TECH. GENUINE WARRANTY.</span>
        <span>
          Free shipping on selected orders <ArrowUpRight size={12} />
        </span>
        <span>New arrivals, just landed</span>
      </div> */}
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="header-main">
          <button
            className="icon-button mobile-menu"
            aria-label="Toggle navigation"
            aria-expanded={navOpen}
            onClick={() => setNavOpen(!navOpen)}
          >
            {navOpen ? <X /> : <Menu />}
          </button>
          <Link
            to="/"
            className="brand-lockup"
            aria-label="NexaTech home"
            onClick={dismiss}
          >
            <span className="brand-symbol">N</span>
            <span>
              nexa<span className="brand-tech">tech</span>
              <i>.</i>
            </span>
          </Link>
          <form className="header-search" onSubmit={search}>
            <Search size={17} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setSearchOpen(true)}
              placeholder="Search products, brands, model numbers..."
              aria-label="Search products"
              style={{ fontSize: 16 }}
            />
            <button aria-label="Submit search">
              <ArrowRight size={17} />
            </button>
          </form>
          <div className="header-actions">
            <Link className="header-action account-link" to="/account">
              <UserRound size={17} />
              <span>Account</span>
            </Link>
            <Link
              className="header-icon"
              to="/wishlist"
              aria-label={`Wishlist, ${wishlist.length} saved`}
            >
              <Heart size={28} />
              <b>{wishlist.length}</b>
            </Link>
            <button
              className="header-icon"
              onClick={openCart}
              aria-label={`Shopping cart, ${itemCount} items`}
            >
              <ShoppingBag size={28} />
              <b>{itemCount}</b>
            </button>
          </div>
        </div>
        <nav
          className={`store-nav ${navOpen ? "store-nav-open" : ""}`}
          aria-label="Main navigation"
        >
          <NavLink to="/" onClick={dismiss}>
            Home
          </NavLink>
          <NavLink
            to="/shop"
            className={({ isActive }) =>
              isActive && !isDealsPage ? "active" : undefined
            }
            onClick={dismiss}
          >
            All products
          </NavLink>
          <div className="mega-parent">
            <button
              className="mega-trigger"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              Categories <ChevronDown size={14} />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  className="mega-menu"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                >
                  <button
                    className="mega-close"
                    type="button"
                    aria-label="Close categories menu"
                    onClick={() => setMenuOpen(false)}
                  >
                    <X size={18} />
                  </button>
                  <div className="mega-groups">
                    {categoryGroups.map((group) => (
                      <div className="mega-group" key={group.name}>
                        <span>{group.name}</span>
                        {group.ids.slice(0, 7).map((id) => {
                          const category = categories.find(
                            (item) => item.id === id,
                          );
                          const sub = categories
                            .flatMap((item) => item.subcategories)
                            .find((item) => item.id === id);
                          const item = category || sub;
                          return item ? (
                            <Link
                              key={id}
                              to={`/category/${item.slug}`}
                              onClick={dismiss}
                            >
                              {item.name}
                              <ArrowUpRight size={12} />
                            </Link>
                          ) : null;
                        })}
                      </div>
                    ))}
                  </div>
                  <Link
                    to="/category/gaming"
                    className="mega-feature"
                    onClick={dismiss}
                  >
                    <img
                      src={
                        categories.find((category) => category.id === "gaming")
                          ?.image
                      }
                      alt=""
                    />
                    <span>PLAY WITHOUT LIMITS</span>
                    <strong>Find your next level.</strong>
                    <span className="mega-feature-cta">
                      Explore gaming <ArrowRight size={14} />
                    </span>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <NavLink to="/category/gaming" onClick={dismiss}>
            Gaming
          </NavLink>
          <NavLink to="/category/processors" onClick={dismiss}>
            PC components
          </NavLink>
          <NavLink to="/category/laptop-parts" onClick={dismiss}>
            Laptop parts
          </NavLink>
          <NavLink to="/category/mobile" onClick={dismiss}>
            Mobile
          </NavLink>
          <NavLink
            to="/shop?filter=sale"
            className={({ isActive }) =>
              isActive && isDealsPage ? "nav-deals active" : "nav-deals"
            }
            onClick={dismiss}
          >
            <FlameIcon /> Deals
          </NavLink>
        </nav>
        <AnimatePresence>
          {searchOpen &&
            (suggestions.length > 0 || (!query && recent.length > 0)) && (
              <motion.div
                className="search-popover"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className="search-popover-inner">
                  {suggestions.length ? (
                    <>
                      <span className="popover-label">PRODUCT MATCHES</span>
                      {suggestions.map((product) => (
                        <Link
                          key={product.id}
                          to={`/product/${product.slug}`}
                          onClick={() => setSearchOpen(false)}
                        >
                          <img src={product.images[0]} alt="" />
                          <span>
                            {product.name}
                            <small>
                              {product.brand} · {product.model}
                            </small>
                          </span>
                          <strong>${product.price}</strong>
                        </Link>
                      ))}
                    </>
                  ) : (
                    <>
                      <span className="popover-label">RECENT SEARCHES</span>
                      <div className="recent-searches">
                        {recent.map((item) => (
                          <button
                            key={item}
                            onClick={() => {
                              setQuery(item);
                              navigate(`/search?q=${encodeURIComponent(item)}`);
                              setSearchOpen(false);
                            }}
                          >
                            {item}
                          </button>
                        ))}
                        <button
                          className="clear-recent"
                          onClick={() => {
                            setRecent([]);
                            localStorage.removeItem("nexa-recent-searches");
                          }}
                        >
                          Clear
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
        </AnimatePresence>
      </header>
      {(navOpen || menuOpen) && (
        <button
          className="nav-scrim"
          aria-label="Close navigation"
          onClick={dismiss}
        />
      )}
    </>
  );
}

function readRecent(): string[] {
  try {
    return JSON.parse(
      localStorage.getItem("nexa-recent-searches") || "[]",
    ) as string[];
  } catch {
    return [];
  }
}
