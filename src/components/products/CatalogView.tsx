import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import {
  categories,
  categoryBySlug,
  discountPercent,
  formatPrice,
  products,
} from "../../data/products";
import { ProductGrid } from "./ProductGrid";
import "./catalog.css";

export function CatalogView({ categorySlug }: { categorySlug?: string }) {
  const [params, setParams] = useSearchParams();
  const [drawer, setDrawer] = useState(false);
  const category = categorySlug ? categoryBySlug(categorySlug) : undefined;
  const query = params.get("q") || "";
  const preset = params.get("filter");
  const brand = params.get("brand") || "";
  const subcategory = params.get("subcategory") || "";
  const spec = params.get("spec") || "";
  const minPrice = Number(params.get("min") || 0);
  const maxPrice = Number(params.get("max") || 5000);
  const rating = Number(params.get("rating") || 0);
  const sort = params.get("sort") || "featured";
  const inStock = params.get("stock") === "true";
  const sale = preset === "sale" || params.get("sale") === "true";
  const setFilter = (key: string, value: string | null) => {
    const updated = new URLSearchParams(params);
    if (value) updated.set(key, value);
    else updated.delete(key);
    if (key !== "filter" && key !== "q") updated.delete("filter");
    setParams(updated, { replace: true });
  };
  const categoryIds = category
    ? new Set([category.id, ...category.subcategories.map((sub) => sub.id)])
    : null;
  const term = query.toLowerCase().trim();
  const result = products.filter((product) => {
    const searchable =
      `${product.name} ${product.brand} ${product.model} ${product.sku} ${product.categoryId} ${product.description} ${Object.entries(product.specs).flat().join(" ")} ${(product.tags || []).join(" ")} ${(product.compatibility || []).join(" ")}`.toLowerCase();
    return (
      (!categoryIds || categoryIds.has(product.categoryId)) &&
      (!term || searchable.includes(term)) &&
      (!brand || product.brand === brand) &&
      (!subcategory || product.categoryId === subcategory) &&
      (!spec || searchable.includes(spec.toLowerCase())) &&
      product.price >= minPrice &&
      product.price <= maxPrice &&
      product.rating >= rating &&
      (!inStock || product.stock > 0) &&
      (!sale || !!product.originalPrice) &&
      (preset !== "new" || !!product.isNew) &&
      (preset !== "featured" || !!product.featured)
    );
  });
  const sorters: Record<
    string,
    (a: (typeof products)[number], b: (typeof products)[number]) => number
  > = {
    featured: (a, b) => Number(!!b.featured) - Number(!!a.featured),
    priceAsc: (a, b) => a.price - b.price,
    priceDesc: (a, b) => b.price - a.price,
    popular: (a, b) => b.reviews - a.reviews,
    newest: (a, b) => Number(!!b.isNew) - Number(!!a.isNew),
    discount: (a, b) => discountPercent(b) - discountPercent(a),
    rating: (a, b) => b.rating - a.rating,
  };
  const visible = [...result].sort(sorters[sort] || sorters.featured);

  const clearFilters = () =>
    setParams(query ? { q: query } : {}, { replace: true });
  const filters = (
    <div className="filter-stack">
      {category && category.subcategories.length > 1 && (
        <div className="filter-block">
          <h3>Subcategory</h3>
          <select
            value={subcategory}
            onChange={(event) =>
              setFilter("subcategory", event.target.value || null)
            }
          >
            <option value="">All in {category.name}</option>
            {category.subcategories.map((sub) => (
              <option value={sub.id} key={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="filter-block">
        <h3>Brand</h3>
        <select
          value={brand}
          onChange={(event) => setFilter("brand", event.target.value || null)}
        >
          <option value="">All brands</option>
          {[...new Set(products.map((product) => product.brand))]
            .sort()
            .map((name) => (
              <option key={name}>{name}</option>
            ))}
        </select>
      </div>
      <div className="filter-block">
        <div className="filter-range-heading">
          <h3>Price range</h3>
          <span>
            {formatPrice(minPrice)}–{formatPrice(maxPrice)}
          </span>
        </div>
        <label className="range-control">
          <span>Minimum</span>
          <input
            type="range"
            min="0"
            max={Math.max(0, maxPrice - 50)}
            step="10"
            value={minPrice}
            onChange={(event) =>
              setFilter(
                "min",
                Number(event.target.value) ? event.target.value : null,
              )
            }
          />
        </label>
        <label className="range-control">
          <span>Maximum</span>
          <input
            type="range"
            min={minPrice}
            max="5000"
            step="50"
            value={maxPrice}
            onChange={(event) =>
              setFilter(
                "max",
                Number(event.target.value) < 5000 ? event.target.value : null,
              )
            }
          />
        </label>
      </div>
      <div className="filter-block">
        <h3>Minimum rating</h3>
        <select
          value={rating}
          onChange={(event) =>
            setFilter(
              "rating",
              Number(event.target.value) ? event.target.value : null,
            )
          }
        >
          <option value={0}>Any rating</option>
          <option value={4}>4.0 and up</option>
          <option value={4.5}>4.5 and up</option>
          <option value={4.8}>4.8 and up</option>
        </select>
      </div>
      <div className="filter-block">
        <h3>Specifications</h3>
        <input
          className="spec-filter-input"
          value={spec}
          onChange={(event) => setFilter("spec", event.target.value || null)}
          placeholder="e.g. DDR5, AM5, 1440p"
          aria-label="Filter by specifications"
        />
        <span className="filter-hint">
          Search specs, socket, memory or resolution.
        </span>
      </div>
      <div className="filter-checks">
        <label>
          <input
            type="checkbox"
            checked={inStock}
            onChange={(event) =>
              setFilter("stock", event.target.checked ? "true" : null)
            }
          />{" "}
          In stock
        </label>
        <label>
          <input
            type="checkbox"
            checked={sale}
            onChange={(event) =>
              setFilter("sale", event.target.checked ? "true" : null)
            }
          />{" "}
          On sale
        </label>
      </div>
      <button className="clear-filters" onClick={clearFilters}>
        Clear all filters
      </button>
    </div>
  );
  return (
    <div className="catalog-page page-width">
      <div className="breadcrumbs">
        <Link to="/">Home</Link>
        <ChevronRight size={13} />
        <span>
          {category?.name || (query ? "Search results" : "All products")}
        </span>
      </div>
      <header className="catalog-heading">
        <div>
          <span className="eyebrow">
            {query
              ? "Search results"
              : category
                ? "Shop by category"
                : preset === "sale"
                  ? "Limited-time offers"
                  : "The complete range"}
          </span>
          <h1>
            {query
              ? `Results for “${query}”`
              : category?.name ||
                (preset === "sale"
                  ? "Deals worth a closer look."
                  : "Find your next upgrade.")}
          </h1>
          <p>
            {category?.description ||
              (query
                ? "Search across names, brands, models, SKUs and product specifications."
                : "Powerful components, precise peripherals and everyday essentials.")}
          </p>
        </div>
        {category && <img src={category.image} alt="" />}
      </header>
      <div className="catalog-toolbar">
        <span>
          <strong>{visible.length}</strong> products{" "}
          <span className="muted">matched to your search</span>
        </span>
        <div className="catalog-actions">
          <button className="filter-trigger" onClick={() => setDrawer(true)}>
            <SlidersHorizontal size={15} /> Filters
          </button>
          <label className="sort-control">
            Sort by{" "}
            <select
              value={sort}
              onChange={(event) =>
                setFilter(
                  "sort",
                  event.target.value === "featured" ? null : event.target.value,
                )
              }
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="priceAsc">Price: low to high</option>
              <option value="priceDesc">Price: high to low</option>
              <option value="popular">Most popular</option>
              <option value="rating">Best rated</option>
              <option value="discount">Biggest discount</option>
            </select>
            <ChevronDown size={13} />
          </label>
        </div>
      </div>
      <div className="catalog-layout">
        <aside className="catalog-sidebar">
          <div className="sidebar-heading">
            <h2>Refine products</h2>
            <SlidersHorizontal size={15} />
          </div>
          {filters}
        </aside>
        <div className="catalog-results">
          <div className="active-filters">
            {brand && (
              <FilterChip
                label={brand}
                remove={() => setFilter("brand", null)}
              />
            )}
            {subcategory && (
              <FilterChip
                label={
                  categories
                    .flatMap((item) => item.subcategories)
                    .find((sub) => sub.id === subcategory)?.name || subcategory
                }
                remove={() => setFilter("subcategory", null)}
              />
            )}
            {sale && (
              <FilterChip
                label="On sale"
                remove={() => {
                  setFilter("sale", null);
                  if (preset === "sale") setFilter("filter", null);
                }}
              />
            )}
            {inStock && (
              <FilterChip
                label="In stock"
                remove={() => setFilter("stock", null)}
              />
            )}
            {spec && (
              <FilterChip
                label={`Spec: ${spec}`}
                remove={() => setFilter("spec", null)}
              />
            )}
          </div>
          <ProductGrid items={visible} />
        </div>
      </div>
      <AnimatePresence>
        {drawer && (
          <motion.div
            className="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDrawer(false)}
          >
            <motion.aside
              className="filter-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="drawer-heading">
                <h2>Filters</h2>
                <button
                  className="icon-button"
                  onClick={() => setDrawer(false)}
                  aria-label="Close filters"
                >
                  <X />
                </button>
              </div>
              {filters}
              <button
                className="button button-primary filter-apply"
                onClick={() => setDrawer(false)}
              >
                Show {visible.length} products
              </button>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterChip({ label, remove }: { label: string; remove: () => void }) {
  return (
    <span className="filter-chip">
      {label}
      <button onClick={remove} aria-label={`Remove ${label} filter`}>
        <X size={12} />
      </button>
    </span>
  );
}
