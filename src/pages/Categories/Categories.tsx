import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { categories, productsInCategory } from "../../data/products";
import { CategoryCard } from "../../components/products/CategoryCard";
import "./Categories.css";

export function Categories() {
  return (
    <div className="categories-page page-width">
      <div className="page-intro">
        <span className="eyebrow">A BETTER WAY TO BROWSE</span>
        <h1>Find your next upgrade.</h1>
        <p>
          From core components to the little things that make your setup yours.
        </p>
      </div>
      <div className="categories-grid">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            count={productsInCategory(category.id).length}
          />
        ))}
      </div>
      <div className="category-help">
        <span>Not sure where to start?</span>
        <p>
          Search by brand, model or spec and find the right gear for your setup.
        </p>
        <Link to="/shop">
          Browse all products <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
