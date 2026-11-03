import { useState, type SubmitEvent } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Cpu,
  HelpingHand,
  ShieldCheck,
  Truck,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import {
  categories,
  formatPrice,
  products,
  productsInCategory,
} from "../../data/products";
import { CategoryCard } from "../../components/products/CategoryCard";
import { ProductGrid } from "../../components/products/ProductGrid";
import { SectionHeading } from "../../components/common/SectionHeading";
import "./Home.css";

const brands = [
  "INTEL",
  "AMD",
  "NVIDIA",
  "ASUS",
  "MSI",
  "GIGABYTE",
  "CORSAIR",
  "SAMSUNG",
  "LOGITECH G",
  "RAZER",
  "HYPERX",
  "JBL",
];

export function Home() {
  const [visibleCategories, setVisibleCategories] = useState(6);
  const [visibleFeatured, setVisibleFeatured] = useState(8);
  const [visibleDeals, setVisibleDeals] = useState(8);
  const [visibleNewArrivals, setVisibleNewArrivals] = useState(8);
  const featured = products.filter((product) => product.featured);
  const deals = products.filter((product) => product.originalPrice);
  const newArrivals = products.filter((product) => product.isNew);
  const gaming = products
    .filter((product) => product.tags?.includes("gaming"))
    .slice(0, 3);
  return (
    <>
      <section className="hero-tech">
        <motion.div
          className="hero-tech-copy"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <span className="hero-kicker">
            <span /> BUILT FOR WHAT'S NEXT
          </span>
          <h1>
            Upgrade your tech.
            <br />
            <em>Elevate your game.</em>
          </h1>
          <p>
            Powerful hardware. Thoughtful advice. Gear that makes every click,
            frame and idea feel better.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/shop">
              Shop the collection <ArrowRight size={16} />
            </Link>
            <Link className="button button-outline" to="/categories">
              Explore categories <ArrowUpRight size={15} />
            </Link>
          </div>
          <div className="hero-proof">
            <span className="proof-star">★★★★★</span>
            <span>Trusted by builders, players & creators</span>
          </div>
        </motion.div>
        <div className="hero-tech-visual">
          <img
            src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1500&q=90"
            alt="Custom PC build with premium computer hardware"
          />
          <div className="hero-tech-overlay" />
          <div className="hero-tech-tag">
            <Cpu size={15} />
            <span>THE NEW STANDARD</span>
          </div>
          <div className="hero-product-chip">
            <span>BUILD SERIES / 07</span>
            <strong>Performance, considered.</strong>
            <Link to="/category/graphics-cards">
              Explore the build <ArrowRight size={14} />
            </Link>
          </div>
          {/* <div className="hero-dots">
            <i />
            <i />
            <i />
            <i />
          </div> */}
        </div>
        <div className="hero-index">
          NEXA / 01 <ChevronRight size={12} /> HARDWARE FOR THE CURIOUS
        </div>
      </section>
      <section className="trust-strip">
        <span>
          <Truck size={17} /> Free shipping on selected orders
        </span>
        <i />
        <span>
          <ShieldCheck size={17} /> Genuine products. Real warranty.
        </span>
        <i />
        <span>
          <Zap size={17} /> New tech, thoughtfully selected
        </span>
        <i />
        <span>
          <HelpingHand size={17} /> Support from people who know their gear
        </span>
      </section>
      <section className="section category-section page-width">
        <SectionHeading
          eyebrow="THE RIGHT PLACE TO START"
          title="Shop by category."
          action="All categories"
          to="/categories"
        />
        <div className="category-grid">
          {categories.slice(0, visibleCategories).map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              count={productsInCategory(category.id).length}
            />
          ))}
        </div>
        <HomeLoadMore
          shown={Math.min(visibleCategories, categories.length)}
          total={categories.length}
          batchSize={visibleCategories}
          onLoadMore={() =>
            setVisibleCategories((count) => count + visibleCategories)
          }
        />
      </section>
      <section className="section featured-section page-width">
        <SectionHeading
          eyebrow="THE GEAR WE RATE"
          title="Standout upgrades."
          action="Shop all products"
        />
        <ProductGrid items={featured.slice(0, visibleFeatured)} />
        <HomeLoadMore
          shown={Math.min(visibleFeatured, featured.length)}
          total={featured.length}
          batchSize={visibleFeatured}
          onLoadMore={() =>
            setVisibleFeatured((count) => count + visibleFeatured)
          }
        />
      </section>
      <section className="deal-banner">
        <div className="deal-copy">
          <span className="eyebrow">THE UPGRADE EVENT · LIMITED TIME</span>
          <h2>
            More power.
            <br />
            <em>Less outlay.</em>
          </h2>
          <p>Smart savings on the hardware that takes your setup further.</p>
          <Link className="button button-primary" to="/shop?filter=sale">
            Explore all deals <ArrowRight size={15} />
          </Link>
          <span className="deal-footnote">
            Offers on selected products while stocks last.
          </span>
        </div>
        <div className="deal-product">
          <div className="deal-orbit" />
          <img src={deals[0]?.images[0]} alt={deals[0]?.name} />
          <div className="deal-price-chip">
            <span>THIS WEEK'S PICK</span>
            <strong>{deals[0] ? formatPrice(deals[0].price) : "Rs. — /-"}</strong>
            <del>
              {deals[0]
                ? formatPrice(deals[0].originalPrice || deals[0].price)
                : ""}
            </del>
          </div>
        </div>
      </section>
      <section className="section deals-products page-width">
        <SectionHeading
          eyebrow="GOOD GEAR, BETTER VALUE"
          title="Deals worth a closer look."
          action="See all offers"
          to="/shop?filter=sale"
        />
        <ProductGrid items={deals.slice(0, visibleDeals)} />
        <HomeLoadMore
          shown={Math.min(visibleDeals, deals.length)}
          total={deals.length}
          batchSize={visibleDeals}
          onLoadMore={() => setVisibleDeals((count) => count + visibleDeals)}
        />
      </section>
      <section className="gaming-feature">
        <div className="gaming-art">
          <img
            src="https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=1300&q=85"
            alt="Gaming monitor and desktop setup"
            loading="lazy"
          />
          <div className="gaming-art-caption">
            <span>GEAR UP. LOCK IN.</span>
            <span>PLAY / 2026</span>
          </div>
        </div>
        <div className="gaming-copy">
          <span className="eyebrow">THE NEXA GAMING ZONE</span>
          <h2>
            Play beyond
            <br />
            the <em>ordinary.</em>
          </h2>
          <p>
            From the GPU in your rig to the headset on your desk, find the
            details that make the difference.
          </p>
          <Link className="button button-primary" to="/category/gaming">
            Explore gaming gear <ArrowRight size={15} />
          </Link>
          <div className="gaming-links">
            {gaming.map((product) => (
              <Link key={product.id} to={`/product/${product.slug}`}>
                <span>{product.brand}</span>
                <strong>{product.name}</strong>
                <ChevronRight size={15} />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section arrivals-section page-width">
        <SectionHeading
          eyebrow="FRESH FROM THE BENCH"
          title="Just landed."
          action="Browse new arrivals"
          to="/shop?filter=new"
        />
        <ProductGrid items={newArrivals.slice(0, visibleNewArrivals)} />
        <HomeLoadMore
          shown={Math.min(visibleNewArrivals, newArrivals.length)}
          total={newArrivals.length}
          batchSize={visibleNewArrivals}
          onLoadMore={() =>
            setVisibleNewArrivals((count) => count + visibleNewArrivals)
          }
        />
      </section>
      <section className="upgrade-panels page-width">
        <Link to="/category/memory" className="upgrade-panel upgrade-laptop">
          <div>
            <span className="eyebrow">THE LAPTOP RESET</span>
            <h2>
              A little more
              <br />
              room to run.
            </h2>
            <span className="panel-link">
              Explore memory <ArrowRight size={14} />
            </span>
          </div>
          <img
            src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=850&q=85"
            alt="Laptop ready for an upgrade"
            loading="lazy"
          />
        </Link>
        <Link to="/category/mobile" className="upgrade-panel upgrade-mobile">
          <div>
            <span className="eyebrow">POWER, WHENEVER</span>
            <h2>
              Ready for
              <br />
              the long run.
            </h2>
            <span className="panel-link">
              Shop mobile essentials <ArrowRight size={14} />
            </span>
          </div>
          <img
            src="https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=850&q=85"
            alt="Modern mobile phone"
            loading="lazy"
          />
        </Link>
      </section>
      <section className="brand-strip page-width">
        <div>
          <span className="eyebrow">THE NAMES BEHIND THE BUILDS</span>
        </div>
        <div className="brand-logos">
          {brands.map((brand) => (
            <span key={brand}>{brand}</span>
          ))}
        </div>
      </section>
      <section className="newsletter-tech">
        <span className="newsletter-icon">
          <Zap size={19} />
        </span>
        <div>
          <span className="eyebrow">THE NEXA SIGNAL</span>
          <h2>Good tech. No noise.</h2>
          <p>
            New gear, honest advice and member-only deals. Straight to your
            inbox.
          </p>
        </div>
        <NewsletterForm />
      </section>
    </>
  );
}

export function HomeLoadMore({
  shown,
  total,
  batchSize,
  onLoadMore,
}: {
  shown: number;
  total: number;
  batchSize: number;
  onLoadMore: () => void;
}) {
  if (total <= batchSize) return null;

  const remaining = total - shown;
  return remaining > 0 ? (
    <div className="load-more">
      <span className="load-more-count">
        Showing <strong>{shown}</strong> of <strong>{total}</strong>{" "}
        {batchSize === 6 ? "categories" : "products"}
      </span>
      <motion.button
        type="button"
        className="load-more-button"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onLoadMore}
      >
        <span>Load more {batchSize === 6 ? "categories" : "products"}</span>
        <ArrowDown size={16} />
      </motion.button>
    </div>
  ) : (
    <div className="load-more load-more-complete" role="status">
      <span className="load-more-count">
        You&apos;ve explored all <strong>{total}</strong>{" "}
        {batchSize === 6 ? "categories" : "products"}
      </span>
      <span className="load-more-complete-mark">
        <Check size={15} />
      </span>
    </div>
  );
}

function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const subscribe = (event: SubmitEvent) => {
    event.preventDefault();
    if (email.includes("@")) setSubmitted(true);
  };
  return submitted ? (
    <p className="newsletter-success">You're on the list. Welcome aboard.</p>
  ) : (
    <form onSubmit={subscribe}>
      <input
        type="email"
        placeholder="Email address"
        aria-label="Email address"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      <button className="button button-primary">
        Keep me posted <ArrowRight size={14} />
      </button>
    </form>
  );
}
