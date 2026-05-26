// ─── Brand color palette ─────────────────────────────────────────────────────

export const colors = {
  background: '#FAF7F2',
  surface: '#FFFFFF',
  primaryText: '#1F1F1F',
  secondaryText: '#6F6A64',
  accentBeige: '#D8C3A5',
  accentRose: '#E8C7C8',
  deepBrown: '#2B2420',
  border: '#E8E1D8',
  success: '#2F7D4F',
  error: '#B42318',
} as const;

export type ColorKey = keyof typeof colors;

// ─── Order statuses ──────────────────────────────────────────────────────────

export const ORDER_STATUSES = [
  'new',
  'confirmed',
  'processing',
  'shipped',
  'completed',
  'cancelled',
  'returned',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: 'New',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  completed: 'Completed',
  cancelled: 'Cancelled',
  returned: 'Returned',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  new: '#3B82F6',
  confirmed: '#8B5CF6',
  processing: '#F59E0B',
  shipped: '#06B6D4',
  completed: '#2F7D4F',
  cancelled: '#B42318',
  returned: '#6F6A64',
};

// ─── Payment statuses ────────────────────────────────────────────────────────

export const PAYMENT_STATUSES = [
  'pending',
  'paid',
  'failed',
  'refunded',
  'manual_transfer_pending',
] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: 'Pending',
  paid: 'Paid',
  failed: 'Failed',
  refunded: 'Refunded',
  manual_transfer_pending: 'Transfer Pending',
};

// ─── Delivery statuses ───────────────────────────────────────────────────────

export const DELIVERY_STATUSES = [
  'not_started',
  'preparing',
  'sent',
  'delivered',
  'failed',
  'returned',
] as const;

export type DeliveryStatus = (typeof DELIVERY_STATUSES)[number];

export const DELIVERY_STATUS_LABELS: Record<DeliveryStatus, string> = {
  not_started: 'Not Started',
  preparing: 'Preparing',
  sent: 'Sent',
  delivered: 'Delivered',
  failed: 'Failed',
  returned: 'Returned',
};

// ─── Delivery methods ────────────────────────────────────────────────────────

export const DELIVERY_METHODS = [
  { value: 'tbilisi', label: 'Tbilisi Delivery', labelKa: 'თბილისში მიტანა', fee: 5 },
  { value: 'regional', label: 'Regional Delivery', labelKa: 'რეგიონებში მიტანა', fee: 10 },
  { value: 'pickup', label: 'Pickup / Arranged', labelKa: 'გამოტანა / შეთანხმებით', fee: 0 },
] as const;

export type DeliveryMethodValue = (typeof DELIVERY_METHODS)[number]['value'];

// ─── Payment methods ─────────────────────────────────────────────────────────

export const PAYMENT_METHODS = [
  { value: 'cash_on_delivery', label: 'Cash on Delivery', labelKa: 'გადახდა მიწოდებისას' },
  {
    value: 'bank_transfer',
    label: 'Bank Transfer',
    labelKa: 'საბანკო გადარიცხვა',
    description: 'Send transfer confirmation after payment',
  },
  {
    value: 'card',
    label: 'Card Payment',
    labelKa: 'ბარათით გადახდა',
    description: 'Coming soon',
    disabled: true,
  },
] as const;

export type PaymentMethodValue = (typeof PAYMENT_METHODS)[number]['value'];

// ─── Product labels ──────────────────────────────────────────────────────────

export const PRODUCT_LABELS = [
  { value: 'new', label: 'New', color: '#3B82F6' },
  { value: 'sale', label: 'Sale', color: '#B42318' },
  { value: 'bestseller', label: 'Bestseller', color: '#F59E0B' },
  { value: 'limited', label: 'Limited', color: '#8B5CF6' },
  { value: 'low_stock', label: 'Low Stock', color: '#EA580C' },
  { value: 'coming_soon', label: 'Coming Soon', color: '#6F6A64' },
] as const;

// ─── Categories (initial seeded data) ────────────────────────────────────────

export const INITIAL_CATEGORIES = [
  { name: 'Dresses', slug: 'dresses', nameKa: 'კაბები', sort_order: 1 },
  { name: 'Tops', slug: 'tops', nameKa: 'ტოპები', sort_order: 2 },
  { name: 'Sets', slug: 'sets', nameKa: 'კომპლექტები', sort_order: 3 },
  { name: 'Pants', slug: 'pants', nameKa: 'შარვლები', sort_order: 4 },
  { name: 'Skirts', slug: 'skirts', nameKa: 'კაბ-ქვედა', sort_order: 5 },
  { name: 'Accessories', slug: 'accessories', nameKa: 'აქსესუარები', sort_order: 6 },
  { name: 'New Arrivals', slug: 'new-arrivals', nameKa: 'სიახლეები', sort_order: 7 },
  { name: 'Sale', slug: 'sale', nameKa: 'ფასდაკლება', sort_order: 8 },
] as const;

// ─── Standard sizes ──────────────────────────────────────────────────────────

export const STANDARD_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;
export type StandardSize = (typeof STANDARD_SIZES)[number];

// ─── Low-stock threshold ─────────────────────────────────────────────────────

export const LOW_STOCK_THRESHOLD = 3;

// ─── Free delivery threshold (GEL) ──────────────────────────────────────────

export const FREE_DELIVERY_THRESHOLD = 150;

// ─── Order number prefix ─────────────────────────────────────────────────────

export const ORDER_NUMBER_PREFIX = 'BNV';

// ─── Admin dashboard metric labels ──────────────────────────────────────────

export const DASHBOARD_METRIC_LABELS = {
  today_orders: "Today's Orders",
  total_orders: 'Total Orders',
  pending_orders: 'Pending Orders',
  completed_orders: 'Completed Orders',
  estimated_revenue: 'Est. Revenue (GEL)',
  average_order_value: 'Avg. Order Value',
} as const;

// ─── Route constants ─────────────────────────────────────────────────────────

export const ROUTES = {
  home: '/',
  shop: '/shop',
  product: (slug: string) => `/product/${slug}`,
  category: (slug: string) => `/shop?category=${slug}`,
  cart: '/cart',
  checkout: '/checkout',
  orderSuccess: (id: string) => `/order-success/${id}`,
  about: '/about',
  contact: '/contact',
  delivery: '/delivery',
  returns: '/returns',
  admin: {
    login: '/admin/login',
    dashboard: '/admin/dashboard',
    products: '/admin/products',
    productNew: '/admin/products/new',
    productEdit: (id: string) => `/admin/products/${id}/edit`,
    orders: '/admin/orders',
    orderDetail: (id: string) => `/admin/orders/${id}`,
    categories: '/admin/categories',
    settings: '/admin/settings',
  },
} as const;

// ─── API routes ──────────────────────────────────────────────────────────────

export const API_ROUTES = {
  products: '/api/products',
  product: (slug: string) => `/api/products/${slug}`,
  categories: '/api/categories',
  checkout: '/api/checkout',
  upload: '/api/upload',
  order: (id: string) => `/api/orders/${id}`,
  admin: {
    orders: '/api/admin/orders',
    order: (id: string) => `/api/admin/orders/${id}`,
    variantStock: (id: string) => `/api/admin/variants/${id}/stock`,
  },
} as const;
