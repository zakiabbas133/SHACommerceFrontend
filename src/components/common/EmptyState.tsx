import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function EmptyState({
  title,
  text,
  to = "/shop",
}: {
  title: string;
  text: string;
  to?: string;
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Sparkles size={23} />
      </span>
      <h2>{title}</h2>
      <p>{text}</p>
      <Link className="text-link" to={to}>
        Explore products <ArrowRight size={15} />
      </Link>
    </div>
  );
}
