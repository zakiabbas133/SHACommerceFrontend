import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function EmptyState({
  title,
  text,
  to = "/shop",
  showIcon = true,
  showButton = true,
}: {
  title: string;
  text: string;
  to?: string;
  showIcon: boolean;
  showButton: boolean;
}) {
  return (
    <div className="empty-state">
      {showIcon && (
        <span className="empty-icon">
          <Sparkles size={23} />
        </span>
      )}
      <h2>{title}</h2>
      <p>{text}</p>
      {showButton && (
        <Link className="text-link" to={to}>
          Explore products <ArrowRight size={15} />
        </Link>
      )}
    </div>
  );
}
