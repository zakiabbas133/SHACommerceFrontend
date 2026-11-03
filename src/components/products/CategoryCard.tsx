import { ArrowUpRight, Cpu } from "lucide-react";
import { Link } from "react-router-dom";
import type { Category } from "../../data/products";
import "./products.css";

export function CategoryCard({
  category,
  // count,
}: {
  category: Category;
  count: number;
}) {
  return (
    <Link to={`/category/${category.slug}`} className="category-card">
      <img src={category.image} alt="" loading="lazy" />
      <span className="category-icon">
        <Cpu size={16} />
      </span>
      <div className="category-card-copy">
        {/* <span>{String(count).padStart(2, "0")} products</span> */}
        <h3>{category.name}</h3>
        {/* <p>{category.description}</p> */}
        <span className="category-explore">
          Shop now <ArrowUpRight size={14} />
        </span>
      </div>
    </Link>
  );
}
