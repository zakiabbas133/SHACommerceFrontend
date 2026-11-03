// import { useState, type SubmitEvent } from "react";
// import { ArrowRight, ArrowUpRight, ShieldCheck } from "lucide-react";
// import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { categories } from "../../data/products";

export function Footer() {
  // const [subscribed, setSubscribed] = useState(false);
  // const [email, setEmail] = useState("");
  // const subscribe = (event: SubmitEvent) => {
  //   event.preventDefault();
  //   if (email.includes("@")) setSubscribed(true);
  // };
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link to="/" className="brand-lockup">
            <span className="brand-symbol">N</span>
            <span>
              nexa<span className="brand-tech">tech</span>
              <i>.</i>
            </span>
          </Link>
          <p>
            Better tech. Better together.
            <br />
            Powering what comes next.
          </p>
          <div className="footer-trust">
            <ShieldCheck size={16} /> Authorized products. Real warranty.
          </div>
          <div className="social-links">
            <a href="https://instagram.com" aria-label="Instagram">
              ig
            </a>
            <a href="https://youtube.com" aria-label="YouTube">
              yt
            </a>
            <a href="https://facebook.com" aria-label="Facebook">
              fb
            </a>
          </div>
        </div>
        <div className="footer-links">
          <h4>Shop</h4>
          <Link to="/shop">All products</Link>
          <Link to="/category/gaming">Gaming gear</Link>
          {/* <Link to="/category/graphics-cards">Graphics cards</Link> */}
          <Link to="/category/laptop-parts">Laptop parts</Link>
          <Link to="/shop?filter=sale">Deals & offers</Link>
        </div>
        <div className="footer-links">
          <h4>Categories</h4>
          {categories.slice(0, 5).map((category) => (
            <Link key={category.id} to={`/category/${category.slug}`}>
              {category.name}
            </Link>
          ))}
        </div>
        <div className="footer-links">
          <h4>Customer care</h4>
          <Link to="/account/orders">Order tracking</Link>
          <Link to="/account">Shipping & returns</Link>
          <Link to="/account">Warranty & support</Link>
          <Link to="/account">Contact us</Link>
          <Link to="/account">FAQs</Link>
        </div>
        {/* <div className="footer-news">
          <h4>Stay in the know.</h4>
          <p>New gear, honest advice and member-only deals. No noise.</p>
          {subscribed ? (
            <span className="subscribed-note">
              You’re on the list. Welcome aboard.
            </span>
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
              <button aria-label="Subscribe">
                <ArrowRight size={17} />
              </button>
            </form>
          )}
          <span className="newsletter-privacy">
            By subscribing, you agree to our privacy policy.
          </span>
        </div> */}
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} NexaTech. All rights reserved.</span>
        <span>Secure checkout · Genuine products · Local support</span>
        {/* <span>
          USD · English <ArrowUpRight size={11} />
        </span> */}
      </div>
    </footer>
  );
}
