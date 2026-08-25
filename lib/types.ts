export type ProductCategory =
  | "Gowns"
  | "Dresses"
  | "Tops"
  | "Two-Piece"
  | "Jeans"
  | "Skirts"
  | "Casual";

export type ProductSize = "S" | "M" | "L" | "XL" | "XXL";

export interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number; // Nigerian Naira
  category: ProductCategory;
  sizes: ProductSize[];
  colors: string[];
  image_url: string;
  image_urls: string[];
  in_stock: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomOrderRequest {
  id: string;
  full_name: string;
  phone_number: string;
  measurements: string | null;
  fabric_choice: string | null;
  event_date: string | null;
  notes: string | null;
  status: "new" | "contacted" | "closed";
  created_at: string;
}

export interface WhatsAppRouter {
  id: number;
  last_index: 0 | 1;
  updated_at: string;
}

export interface OrderDetails {
  title: string;
  size: string;
  color?: string;
  price: number; // in Naira
  isRestockRequest?: boolean; // true when product.in_stock === false
}
