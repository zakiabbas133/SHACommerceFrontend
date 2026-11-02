import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function SectionHeading({
  eyebrow,
  title,
  action,
  to = "/shop",
}: {
  eyebrow?: string;
  title: string;
  action?: string;
  to?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
      </div>
      {action && (
        <Link className="text-link" to={to}>
          {action}
          <ArrowRight size={15} />
        </Link>
      )}
    </div>
  );
}
