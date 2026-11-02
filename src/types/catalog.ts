export type Product = {
  id: string;
  slug: string;
  name: string;
  model: string;
  sku: string;
  categoryId: string;
  brand: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  stock: number;
  featured?: boolean;
  bestseller?: boolean;
  isNew?: boolean;
  images: string[];
  specs: Record<string, string>;
  compatibility?: string[];
  tags?: string[];
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  subcategories: { id: string; name: string; slug: string }[];
};

export type DemoOrder = {
  id: string;
  date: string;
  total: number;
  email: string;
  items: { productId: string; quantity: number }[];
};
