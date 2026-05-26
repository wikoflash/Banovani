// ─── Database row types (mirrors Supabase schema 1:1) ───────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  price: number;
  sale_price: number | null;
  fabric_info: string | null;
  care_info: string | null;
  delivery_info: string | null;
  return_info: string | null;
  seo_title: string | null;
  seo_description: string | null;
  is_active: boolean;
  is_featured: boolean;
  is_new: boolean;
  is_sale: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string | null;
  color: string | null;
  size: string | null;
  stock: number;
  price_override: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_first_name: string;
  customer_last_name: string | null;
  customer_phone: string;
  customer_email: string | null;
  city: string;
  address: string;
  comment: string | null;
  delivery_method: string | null;
  payment_method: string | null;
  payment_status: PaymentStatus;
  delivery_status: DeliveryStatus;
  status: OrderStatus;
  subtotal: number;
  delivery_fee: number;
  discount_total: number;
  total: number;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name: string;
  product_image: string | null;
  color: string | null;
  size: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface Settings {
  id: string;
  key: string;
  value: unknown;
  created_at: string;
  updated_at: string;
}

// ─── Status enums ────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'new'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'completed'
  | 'cancelled'
  | 'returned';

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'manual_transfer_pending';

export type DeliveryStatus =
  | 'not_started'
  | 'preparing'
  | 'sent'
  | 'delivered'
  | 'failed'
  | 'returned';

// ─── Client / application types ──────────────────────────────────────────────

/** Product with eager-loaded relations — used on storefront */
export interface ProductWithDetails extends Product {
  category: Category | null;
  images: ProductImage[];
  variants: ProductVariant[];
}

/** Lightweight product card shape for listings */
export interface ProductCard {
  id: string;
  name: string;
  slug: string;
  price: number;
  sale_price: number | null;
  is_new: boolean;
  is_sale: boolean;
  is_featured: boolean;
  primary_image: string | null;
  hover_image: string | null;
  available_sizes: string[];
  available_colors: string[];
  has_stock: boolean;
}

/** Cart item stored in localStorage / Zustand */
export interface CartItem {
  productId: string;
  variantId: string;
  name: string;
  slug: string;
  image: string;
  color?: string;
  size?: string;
  quantity: number;
  unitPrice: number;
}

/** Order with items — used on admin order detail & order-success page */
export interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

/** Admin dashboard metrics */
export interface DashboardMetrics {
  today_orders: number;
  total_orders: number;
  pending_orders: number;
  completed_orders: number;
  estimated_revenue: number;
  average_order_value: number;
}

/** Low-stock variant info for dashboard alert */
export interface LowStockVariant {
  variant_id: string;
  product_name: string;
  color: string | null;
  size: string | null;
  stock: number;
  sku: string | null;
}

// ─── API request / response shapes ──────────────────────────────────────────

export interface CheckoutPayload {
  firstName: string;
  lastName?: string;
  phone: string;
  email?: string;
  city: string;
  address: string;
  comment?: string;
  deliveryMethod: string;
  paymentMethod: string;
  items: Array<{
    variantId: string;
    quantity: number;
  }>;
}

export interface CheckoutResponse {
  orderId: string;
  orderNumber: string;
}

export interface ApiError {
  error: string;
  details?: unknown;
}

// ─── Filter / sort shapes ────────────────────────────────────────────────────

export interface ProductFilters {
  category?: string;
  sizes?: string[];
  colors?: string[];
  minPrice?: number;
  maxPrice?: number;
  onlyAvailable?: boolean;
  isNew?: boolean;
  isSale?: boolean;
}

export type ProductSortOption =
  | 'newest'
  | 'popular'
  | 'price_asc'
  | 'price_desc'
  | 'sale';
