import { z } from 'zod';

// ─── Checkout ────────────────────────────────────────────────────────────────

export const checkoutSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().optional(),
  phone: z
    .string()
    .min(8, 'Phone number must be at least 8 digits')
    .regex(/^[+\d\s\-()]+$/, 'Invalid phone number format'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  city: z.string().min(2, 'City must be at least 2 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  comment: z.string().max(500, 'Comment too long').optional(),
  deliveryMethod: z.string().min(1, 'Please select a delivery method'),
  paymentMethod: z.string().min(1, 'Please select a payment method'),
  items: z
    .array(
      z.object({
        variantId: z.string().uuid('Invalid variant ID'),
        quantity: z.number().int().positive('Quantity must be positive'),
      })
    )
    .min(1, 'Cart cannot be empty'),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

// ─── Product (admin create/edit) ─────────────────────────────────────────────

export const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  category_id: z.string().uuid('Invalid category ID').optional().nullable(),
  short_description: z.string().max(300).optional().nullable(),
  description: z.string().optional().nullable(),
  price: z.number().positive('Price must be positive'),
  sale_price: z.number().positive('Sale price must be positive').optional().nullable(),
  fabric_info: z.string().optional().nullable(),
  care_info: z.string().optional().nullable(),
  delivery_info: z.string().optional().nullable(),
  return_info: z.string().optional().nullable(),
  seo_title: z.string().max(70).optional().nullable(),
  seo_description: z.string().max(160).optional().nullable(),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  is_new: z.boolean().default(false),
  is_sale: z.boolean().default(false),
  sort_order: z.number().int().min(0).default(0),
});

export type ProductInput = z.infer<typeof productSchema>;

// ─── Product Variant ─────────────────────────────────────────────────────────

export const variantSchema = z.object({
  product_id: z.string().uuid('Invalid product ID'),
  sku: z
    .string()
    .min(1)
    .regex(/^[A-Z0-9-]+$/, 'SKU must be uppercase letters, numbers, and hyphens')
    .optional()
    .nullable(),
  color: z.string().min(1).max(50).optional().nullable(),
  size: z.string().min(1).max(20).optional().nullable(),
  stock: z.number().int().min(0, 'Stock cannot be negative').default(0),
  price_override: z.number().positive().optional().nullable(),
  is_active: z.boolean().default(true),
});

export type VariantInput = z.infer<typeof variantSchema>;

/** Bulk variant generation from color × size matrix */
export const bulkVariantSchema = z.object({
  product_id: z.string().uuid(),
  colors: z.array(z.string().min(1)).min(1, 'Add at least one color'),
  sizes: z.array(z.string().min(1)).min(1, 'Add at least one size'),
  default_stock: z.number().int().min(0).default(0),
});

export type BulkVariantInput = z.infer<typeof bulkVariantSchema>;

// ─── Category ────────────────────────────────────────────────────────────────

export const categorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().optional().nullable(),
  image_url: z.string().url().optional().nullable(),
  sort_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
});

export type CategoryInput = z.infer<typeof categorySchema>;

// ─── Order status update (admin) ─────────────────────────────────────────────

export const orderStatusSchema = z.object({
  status: z
    .enum(['new', 'confirmed', 'processing', 'shipped', 'completed', 'cancelled', 'returned'])
    .optional(),
  payment_status: z
    .enum(['pending', 'paid', 'failed', 'refunded', 'manual_transfer_pending'])
    .optional(),
  delivery_status: z
    .enum(['not_started', 'preparing', 'sent', 'delivered', 'failed', 'returned'])
    .optional(),
  admin_note: z.string().max(1000).optional().nullable(),
});

export type OrderStatusInput = z.infer<typeof orderStatusSchema>;

// ─── Stock update (admin) ────────────────────────────────────────────────────

export const stockUpdateSchema = z.object({
  stock: z.number().int().min(0, 'Stock cannot be negative'),
});

export type StockUpdateInput = z.infer<typeof stockUpdateSchema>;

// ─── Settings ────────────────────────────────────────────────────────────────

export const settingsSchema = z.object({
  key: z.string().min(1),
  value: z.unknown(),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
