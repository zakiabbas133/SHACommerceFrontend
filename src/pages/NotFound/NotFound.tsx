import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import "../../components/products/products.css";
import "./NotFound.css";

export function NotFound() {
  return (
    <div className="not-found page-width">
      <span className="eyebrow">SIGNAL LOST</span>
      <strong>404</strong>
      <h1>
        This page left
        <br />
        <em>the building.</em>
      </h1>
      <p>
        We couldn’t find what you’re looking for. Let’s get you back to your
        next upgrade.
      </p>
      <Link className="button button-primary" to="/">
        Back to NexaTech <ArrowRight size={15} />
      </Link>
    </div>
  );
}
