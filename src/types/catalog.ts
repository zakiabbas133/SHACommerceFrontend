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
  createdAt: string;
  total: number;
  subtotal: number;
  discount: number;
  shippingCost: number;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  fullName: string;
  address: string;
  apartment: string;
  city: string;
  postalCode: string;
  country: string;
  billingAddress: string | null;
  shippingMethod: string;
  paymentMethod: string;
  items: {
    productId: string;
    name?: string;
    brand?: string;
    model?: string;
    quantity: number;
    unitPrice?: number;
    lineTotal?: number;
    image?: string;
    color?: string;
    size?: string;
  }[];
};
