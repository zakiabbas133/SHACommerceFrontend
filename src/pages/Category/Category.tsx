import { useParams } from "react-router-dom";
import { CatalogView } from "../../components/products/CatalogView";

export function Category() {
  const { slug } = useParams();
  return <CatalogView categorySlug={slug} />;
}
