# Banovani E-Commerce Web App — Master Product Requirements & AI Build Prompt

**Project name:** Banovani  
**Brand type:** Women’s clothing / fashion brand  
**Primary market:** Georgia, with future international expansion  
**Primary traffic source:** Instagram, TikTok, Facebook, direct links, search engines  
**Primary goal:** Build a beautiful, mobile-first, easy-to-manage online store that can support Banovani’s first real product sales.

---

## 0. How to Use This Document

Use this document as the main instruction file for building the Banovani online store.

It can be used in:

- VS Code
- Cursor
- Windsurf
- Lovable
- Bolt
- Replit
- ChatGPT
- Claude
- Any AI coding agent

The expected output is a working MVP e-commerce web application with a clean architecture, modern UI, admin dashboard, product variants, cart, checkout, order management, and future-ready foundations.

---

# 1. Executive Summary

Create a modern, elegant, mobile-first e-commerce website/web app for **Banovani**, a women’s clothing brand.

Banovani sells dresses, tops, pants, sets, accessories, and future seasonal collections. The website should feel premium, clean, feminine, warm, trustworthy, and easy to use.

The first version should be simple enough to launch quickly, but structured well enough to grow into a serious online fashion business.

The platform must allow customers to:

- Browse products easily
- Search and filter products
- View product photos and details
- Select size, color, and product variants
- Check availability by variant
- Add products to cart
- Place an order without creating an account
- Contact Banovani through Instagram or WhatsApp
- Receive clear order confirmation

The admin must be able to:

- Add, edit, hide, and delete products
- Upload and manage product images
- Manage sizes, colors, variants, and stock
- Add sale prices and promotional labels
- View and manage orders
- Change order statuses
- Track basic business metrics
- Prepare the store for future online payment integration

---

# 2. Brand Direction

## 2.1 Brand Personality

Banovani should feel:

- Elegant
- Feminine
- Clean
- Minimal
- Warm
- Premium but approachable
- Modern Georgian
- Soft, stylish, and trustworthy

## 2.2 Visual Mood

The interface should use:

- Warm neutral backgrounds
- White space
- Soft shadows
- Rounded corners
- Large product photography
- Calm, elegant typography
- Smooth transitions
- Fashion editorial feeling

## 2.3 Suggested Color Palette

Use a soft and elegant palette:

```txt
Background: #FAF7F2
Surface: #FFFFFF
Primary text: #1F1F1F
Secondary text: #6F6A64
Accent beige: #D8C3A5
Accent rose: #E8C7C8
Deep brown/black: #2B2420
Border: #E8E1D8
Success: #2F7D4F
Error: #B42318
```

## 2.4 Typography

The website must support Georgian text perfectly.

Recommended fonts:

- English: Inter, Playfair Display, Cormorant Garamond, or similar
- Georgian: Noto Sans Georgian, Noto Serif Georgian, or a high-quality Georgian-compatible font

Use serif-style typography only for selected brand/editorial headings if it looks elegant. Main UI text should remain highly readable.

---

# 3. Recommended Tech Stack

## 3.1 Frontend

Use:

- **Next.js 15+**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Framer Motion**
- **Lucide React icons**

## 3.2 Backend

Use:

- **Supabase**
  - PostgreSQL database
  - Authentication for admin users
  - Storage for product images
  - Row Level Security
  - Realtime optional for orders

## 3.3 Deployment

Use:

- **Vercel** for frontend deployment
- **Supabase** for backend/database/storage
- Optional future CDN optimization through Vercel image optimization

## 3.4 Future Integrations

Prepare the architecture for:

- Online card payments
- Bank transfer upload confirmation
- TBC/BOG payment gateway
- WhatsApp notifications
- Telegram order notifications
- Email notifications
- Meta Pixel
- Google Analytics
- TikTok Pixel
- Klaviyo/Mailchimp or local email marketing
- AI product recommendations
- AI search
- Multi-language support

---

# 4. Main Product Goal

Build a production-ready MVP online store for Banovani.

The MVP should include:

1. Home page
2. Product catalog
3. Product detail page
4. Cart
5. Checkout form
6. Order confirmation
7. Admin login
8. Admin dashboard
9. Product management
10. Variant/stock management
11. Order management
12. Basic analytics dashboard
13. SEO-friendly structure
14. Mobile-first UX

---

# 5. User Types

## 5.1 Customer

A customer is usually coming from Instagram or another social channel. They are likely using a mobile phone.

The customer wants to:

- Quickly understand the brand
- See beautiful product photos
- Check price and availability
- Choose size/color
- Place an order easily
- Trust the seller
- Contact the brand if needed

## 5.2 Admin

The admin is Banovani’s team/founder.

The admin wants to:

- Add new products without developer help
- Upload product photos
- Manage stock
- See new orders
- Update order statuses
- Track what is selling
- Keep the website simple and clean

---

# 6. Core Pages

## 6.1 Home Page

Create a beautiful landing/home page.

Sections:

### Hero Section

Include:

- Large fashion-style brand image or video placeholder
- Brand name: **Banovani**
- Main headline:

```txt
Banovani — Elegant clothing for everyday beauty and special moments.
```

Alternative Georgian version:

```txt
Banovani — ელეგანტური სამოსი ყოველდღიური სილამაზისა და განსაკუთრებული მომენტებისთვის.
```

Buttons:

- Shop Collection
- New Arrivals

### Featured Categories

Show category cards:

- Dresses
- Tops
- Sets
- Pants
- New Arrivals
- Sale

### New Arrivals

Show latest products.

Each product card should include:

- Image
- Product name
- Price
- Sale price if available
- Available sizes
- Quick add / view button

### Best Sellers / Featured Products

Show products marked as featured.

### Brand Story Section

Short brand text:

```txt
Banovani creates elegant, comfortable, and timeless pieces for women who want to feel confident in both everyday and special moments.
```

### Trust Section

Include trust badges:

- Fast local delivery
- Carefully selected fabrics
- Easy size selection
- Direct support
- Secure order handling

### Instagram / Social Section

Show Instagram CTA:

```txt
Follow Banovani on Instagram for new drops, styling ideas, and limited pieces.
```

Add link/button:

- Follow on Instagram
- Order via Instagram

---

## 6.2 Product Catalog Page

URL:

```txt
/shop
```

The catalog page should be clean, fast, and mobile-friendly.

Features:

- Product grid
- Category filtering
- Size filtering
- Color filtering
- Price range filtering
- Availability filter
- Sort by:
  - Newest
  - Popular
  - Price low to high
  - Price high to low
  - Sale
- Search by product name
- Mobile filter drawer
- Sticky sort/filter button on mobile
- Empty state when no products match

Product card should show:

- Primary product image
- Hover/second image on desktop
- Product name
- Price
- Sale price
- New/Sale/Low stock badges
- Available sizes
- Quick view
- Add to cart if product has simple/default variant
- View product if variant selection is required

---

## 6.3 Product Detail Page

URL:

```txt
/product/[slug]
```

This is one of the most important pages.

Product page must include:

- Image gallery
- Zoomable product images
- Product name
- Product price
- Sale price
- Short description
- Long description
- Size selector
- Color selector
- Variant availability
- Quantity selector
- Add to cart button
- Buy / order now button
- WhatsApp/Instagram order button
- Size guide
- Delivery information
- Return/exchange policy
- Fabric/care details
- Similar products
- Recently viewed products

## 6.4 Product Variant Logic

A product can have multiple variants.

Example:

```txt
Product: Nino Dress
Color: Black, Cream
Size: S, M, L
```

Each variant must have independent stock:

```txt
Black / S = 2 items
Black / M = 0 items
Cream / S = 1 item
Cream / M = 3 items
```

Rules:

- Customer must select required options before adding to cart
- If selected variant stock is 0, disable Add to Cart
- Show "Out of stock" for unavailable variants
- Show "Only X left" when stock is low
- Prevent checkout if requested quantity is greater than stock
- Reduce stock after successful order creation
- Admin can update variant stock from dashboard

---

# 7. Cart

URL:

```txt
/cart
```

Cart must include:

- Product image
- Product name
- Selected size
- Selected color
- Quantity
- Unit price
- Line total
- Remove item button
- Increase/decrease quantity
- Cart subtotal
- Delivery fee placeholder
- Total
- Continue shopping button
- Checkout button

Cart should persist:

- Use localStorage for guest users
- Keep selected variant IDs
- Revalidate stock before checkout

Mobile UX:

- Cart should be simple, card-based, and easy to edit
- Checkout button should be obvious and sticky if needed

---

# 8. Checkout

URL:

```txt
/checkout
```

The first version should support guest checkout.

## 8.1 Required Customer Fields

- First name
- Last name
- Phone number
- City
- Delivery address
- Optional comment

## 8.2 Delivery Methods

Initial options:

- Tbilisi delivery
- Regional delivery
- Pickup / arranged delivery

Admin should be able to edit delivery text/prices later.

## 8.3 Payment Methods

Initial options:

- Cash on delivery
- Bank transfer
- Manual confirmation
- Future card payment placeholder

Do not build complex payment gateway in the first MVP unless specifically requested.

## 8.4 Checkout UX Requirements

Checkout should be:

- Short
- Clear
- Mobile-first
- Fast
- Trustworthy
- No unnecessary account creation
- No hidden costs
- Clear confirmation message

After order submission, show:

```txt
Thank you for your order. Banovani will contact you soon to confirm the details.
```

Georgian version:

```txt
მადლობა შეკვეთისთვის. Banovani მალე დაგიკავშირდებათ დეტალების დასადასტურებლად.
```

---

# 9. Order Confirmation Page

URL:

```txt
/order-success/[orderId]
```

Show:

- Thank you message
- Order number
- Customer name
- Ordered items
- Total
- Selected payment method
- Selected delivery method
- Contact CTA

Include:

- Back to shop button
- Instagram button
- WhatsApp button

---

# 10. Admin Dashboard

URL:

```txt
/admin
```

Admin area must be protected by Supabase Auth.

## 10.1 Admin Pages

Create these admin pages:

```txt
/admin/login
/admin/dashboard
/admin/products
/admin/products/new
/admin/products/[id]/edit
/admin/orders
/admin/orders/[id]
/admin/categories
/admin/settings
```

## 10.2 Dashboard Overview

Show:

- Total orders
- New orders
- Revenue estimate
- Best selling products
- Low-stock products
- Recent orders

## 10.3 Product Management

Admin must be able to:

- Create product
- Edit product
- Delete product
- Hide/show product
- Upload images
- Reorder images
- Set product name
- Set slug
- Set category
- Set price
- Set sale price
- Add description
- Add fabric/care information
- Add delivery/return notes
- Add sizes
- Add colors
- Add variants
- Set stock per variant
- Mark product as:
  - active
  - featured
  - new
  - sale
  - archived

## 10.4 Order Management

Admin must be able to:

- View orders
- Filter by status
- Search by customer name/phone/order number
- Open order details
- Change status
- Add internal notes
- Mark payment status
- Mark delivery status

Order statuses:

```txt
new
confirmed
processing
shipped
completed
cancelled
returned
```

Payment statuses:

```txt
pending
paid
failed
refunded
manual_transfer_pending
```

Delivery statuses:

```txt
not_started
preparing
sent
delivered
failed
returned
```

---

# 11. Database Schema

Use Supabase PostgreSQL.

## 11.1 Tables

Recommended tables:

```txt
profiles
categories
products
product_images
product_options
product_variants
orders
order_items
settings
coupons
wishlist_items
reviews
```

For MVP, required tables:

```txt
categories
products
product_images
product_variants
orders
order_items
settings
```

---

## 11.2 categories

```sql
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  sort_order integer default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

---

## 11.3 products

```sql
create table products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete set null,
  name text not null,
  slug text unique not null,
  short_description text,
  description text,
  price numeric(10,2) not null,
  sale_price numeric(10,2),
  fabric_info text,
  care_info text,
  delivery_info text,
  return_info text,
  seo_title text,
  seo_description text,
  is_active boolean default true,
  is_featured boolean default false,
  is_new boolean default false,
  is_sale boolean default false,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

---

## 11.4 product_images

```sql
create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  image_url text not null,
  alt_text text,
  sort_order integer default 0,
  is_primary boolean default false,
  created_at timestamptz default now()
);
```

---

## 11.5 product_variants

```sql
create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  sku text unique,
  color text,
  size text,
  stock integer not null default 0,
  price_override numeric(10,2),
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

---

## 11.6 orders

```sql
create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_first_name text not null,
  customer_last_name text,
  customer_phone text not null,
  customer_email text,
  city text not null,
  address text not null,
  comment text,
  delivery_method text,
  payment_method text,
  payment_status text default 'pending',
  delivery_status text default 'not_started',
  status text default 'new',
  subtotal numeric(10,2) not null,
  delivery_fee numeric(10,2) default 0,
  discount_total numeric(10,2) default 0,
  total numeric(10,2) not null,
  admin_note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

---

## 11.7 order_items

```sql
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  variant_id uuid references product_variants(id) on delete set null,
  product_name text not null,
  product_image text,
  color text,
  size text,
  quantity integer not null,
  unit_price numeric(10,2) not null,
  total_price numeric(10,2) not null,
  created_at timestamptz default now()
);
```

---

## 11.8 settings

```sql
create table settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

---

# 12. Example Product Data Structure

Use this shape in frontend/backend logic:

```json
{
  "id": "unique-id",
  "name": "Nino Dress",
  "slug": "nino-dress",
  "category": "Dresses",
  "shortDescription": "Elegant dress for everyday and special occasions.",
  "description": "A comfortable, elegant dress designed for timeless feminine style.",
  "price": 120,
  "salePrice": 99,
  "images": [
    {
      "url": "image1.jpg",
      "alt": "Nino Dress front view",
      "isPrimary": true
    },
    {
      "url": "image2.jpg",
      "alt": "Nino Dress detail view",
      "isPrimary": false
    }
  ],
  "variants": [
    {
      "id": "variant-1",
      "color": "Black",
      "size": "S",
      "stock": 2,
      "sku": "NINO-BLK-S"
    },
    {
      "id": "variant-2",
      "color": "Black",
      "size": "M",
      "stock": 0,
      "sku": "NINO-BLK-M"
    },
    {
      "id": "variant-3",
      "color": "Cream",
      "size": "S",
      "stock": 1,
      "sku": "NINO-CRM-S"
    }
  ],
  "isFeatured": true,
  "isNew": true,
  "isSale": true,
  "isActive": true
}
```

---

# 13. Modern E-Commerce Features to Include

## 13.1 Must-Have MVP Features

Include these in the first version:

- Mobile-first responsive design
- Fast product browsing
- Product search
- Category filters
- Size/color filters
- Product variant selection
- Stock control
- Cart
- Guest checkout
- Order creation
- Admin login
- Admin product management
- Admin order management
- Product image upload
- SEO metadata
- Basic analytics placeholders
- Instagram/WhatsApp contact buttons

## 13.2 Strongly Recommended Features

Add if possible in the first version, or prepare for phase 2:

- Wishlist/favorites
- Recently viewed products
- Similar products
- Size guide modal
- Low-stock badges
- Product labels: New, Sale, Bestseller, Limited
- Promo code support
- Free delivery threshold
- Delivery fee calculation
- Customer reviews
- Instagram feed block
- Sticky mobile add-to-cart button
- Quick view modal
- Back-in-stock notification placeholder
- Newsletter signup
- Meta Pixel integration
- Google Analytics integration

## 13.3 Trend-Forward Features

Prepare architecture for these:

- AI-powered product recommendations
- AI search / natural language search
- Smart product suggestions in cart
- Personalized product sections
- Social commerce landing pages
- Influencer/campaign landing pages
- Video-first product storytelling
- Shoppable Instagram/TikTok-style short videos
- AI-generated outfit/styling suggestions
- Multi-language support
- Multi-currency support
- Headless/composable commerce structure
- PWA support
- Push notifications
- One-click reorder for returning customers
- Loyalty program
- Referral program
- Customer segmentation
- Automated abandoned-cart follow-up

---

# 14. UX Requirements

## 14.1 Mobile-First

Most customers will come from Instagram, so mobile UX is the priority.

Mobile requirements:

- Fast loading
- Big product photos
- Thumb-friendly buttons
- Sticky cart/checkout actions
- Clean product cards
- Minimal checkout steps
- Easy filter drawer
- Clear variant selection
- No tiny buttons
- No clutter

## 14.2 Checkout UX

Checkout should avoid friction.

Rules:

- Do not force account creation
- Ask only necessary fields
- Show total clearly
- Show delivery fee clearly
- Keep checkout on one page if possible
- Validate phone number
- Preserve cart if user leaves page
- Show clear errors
- Show order success confirmation

## 14.3 Trust-Building UX

Add small trust elements:

- Delivery information
- Exchange/return policy
- Contact information
- Instagram link
- Secure order message
- Clear stock availability
- Real product photos
- Size guide
- Brand story

---

# 15. SEO Requirements

Each product page must have:

- SEO title
- SEO description
- Clean slug
- Open Graph image
- Product structured data if possible
- Canonical URL
- Alt text for images

Example:

```txt
Title: Nino Dress | Banovani
Description: Elegant women’s dress by Banovani. Available in selected sizes and colors. Order online in Georgia.
```

Main pages:

```txt
/
 /shop
 /category/dresses
 /product/nino-dress
 /about
 /contact
 /delivery
 /returns
```

---

# 16. Performance Requirements

Target:

- Lighthouse Performance: 90+
- Accessibility: 90+
- SEO: 90+
- Best Practices: 90+
- Mobile-first load speed
- Optimized images
- Lazy-loaded product images
- Compressed images
- Avoid unnecessary heavy libraries
- Use Next.js Image component
- Use server components where appropriate
- Cache product listing data carefully

---

# 17. Accessibility Requirements

The website should be accessible.

Include:

- Semantic HTML
- Keyboard navigation
- Visible focus states
- Proper button labels
- Image alt text
- Color contrast
- Form labels
- Error messages linked to fields
- Accessible modal dialogs
- Accessible mobile menu

---

# 18. Security Requirements

Use secure practices:

- Supabase Row Level Security
- Admin-only write access
- Public read access only for active products/categories
- Validate checkout data on server
- Never trust frontend price values
- Recalculate totals server-side
- Prevent buying out-of-stock variants
- Sanitize user inputs
- Secure environment variables
- Protect admin routes

---

# 19. Supabase RLS Rules — Expected Behavior

## Public users can:

- View active products
- View active categories
- Create orders
- Create order items only through controlled server logic

## Admin users can:

- Create/update/delete products
- Upload images
- Manage categories
- Manage variants
- View and update orders
- Manage settings

For checkout, prefer a server action/API route that:

1. Receives cart/customer data
2. Fetches current product/variant prices from database
3. Checks stock
4. Calculates totals
5. Creates order
6. Creates order items
7. Decreases stock
8. Returns order confirmation

---

# 20. File/Folder Structure

Use this structure:

```txt
banovani/
  app/
    (store)/
      page.tsx
      shop/
        page.tsx
      product/
        [slug]/
          page.tsx
      cart/
        page.tsx
      checkout/
        page.tsx
      order-success/
        [orderId]/
          page.tsx
      about/
        page.tsx
      contact/
        page.tsx
      delivery/
        page.tsx
      returns/
        page.tsx
    admin/
      login/
        page.tsx
      dashboard/
        page.tsx
      products/
        page.tsx
        new/
          page.tsx
        [id]/
          edit/
            page.tsx
      orders/
        page.tsx
        [id]/
          page.tsx
      categories/
        page.tsx
      settings/
        page.tsx
    api/
      checkout/
        route.ts
      upload/
        route.ts
  components/
    layout/
    store/
    product/
    cart/
    checkout/
    admin/
    ui/
  lib/
    supabase/
    cart/
    checkout/
    utils/
    validation/
  hooks/
  types/
  public/
  styles/
```

---

# 21. Important Components

Create reusable components:

```txt
Header
MobileMenu
Footer
ProductCard
ProductGrid
ProductFilters
ProductGallery
VariantSelector
SizeSelector
ColorSelector
QuantitySelector
AddToCartButton
CartDrawer
CartItem
CheckoutForm
OrderSummary
AdminSidebar
AdminProductForm
AdminVariantEditor
AdminImageUploader
AdminOrderTable
AdminStatusBadge
DashboardMetricCard
EmptyState
LoadingSkeleton
```

---

# 22. Cart State

Use a clean cart store.

Recommended:

- Zustand or React Context
- localStorage persistence
- Store variant ID, quantity, product snapshot
- Revalidate from database before checkout

Cart item shape:

```ts
type CartItem = {
  productId: string;
  variantId: string;
  name: string;
  slug: string;
  image: string;
  color?: string;
  size?: string;
  quantity: number;
  unitPrice: number;
};
```

---

# 23. Validation

Use Zod for validation.

Checkout validation:

```ts
const checkoutSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().optional(),
  phone: z.string().min(8),
  city: z.string().min(2),
  address: z.string().min(5),
  comment: z.string().optional(),
  deliveryMethod: z.string().min(1),
  paymentMethod: z.string().min(1)
});
```

Product validation:

```ts
const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  price: z.number().positive(),
  salePrice: z.number().positive().optional(),
  categoryId: z.string().uuid().optional(),
  description: z.string().optional(),
  isActive: z.boolean()
});
```

---

# 24. Admin Product Form Requirements

The product creation/edit form should include:

## Basic Info

- Product name
- Slug auto-generation
- Category
- Short description
- Full description

## Pricing

- Regular price
- Sale price
- Sale toggle

## Media

- Product images
- Primary image selection
- Image order
- Alt text

## Variants

Admin can create variants by adding:

- Color
- Size
- SKU
- Stock
- Optional price override

Admin should be able to quickly create combinations.

Example:

Input:

```txt
Colors: Black, Cream
Sizes: S, M, L
```

Generate variants:

```txt
Black / S
Black / M
Black / L
Cream / S
Cream / M
Cream / L
```

## Status

- Active
- Featured
- New
- Sale
- Archived/hidden

## SEO

- SEO title
- SEO description
- Product slug

---

# 25. Notifications

MVP should support at least one admin notification option.

Recommended:

- Email notification after new order
- Telegram bot message after new order
- WhatsApp manual link fallback

Telegram message example:

```txt
New Banovani order!
Order: #BNV-1001
Customer: Nino
Phone: +995...
Total: 149 GEL
Items: Nino Dress / Black / S x1
```

For first MVP, if notifications are too complex, store orders in dashboard and show a visible "New Orders" badge.

---

# 26. Content Pages

Create basic content pages.

## About Page

Title:

```txt
About Banovani
```

Content idea:

```txt
Banovani is a women’s clothing brand created for elegance, confidence, and everyday beauty. We design and select pieces that help women feel comfortable, stylish, and unique.
```

## Contact Page

Include:

- Instagram link
- WhatsApp link
- Phone number placeholder
- Email placeholder
- Contact form optional

## Delivery Page

Include:

- Delivery in Tbilisi
- Regional delivery
- Estimated delivery time placeholder
- Delivery price placeholder

## Returns Page

Include:

- Exchange policy
- Return conditions
- Contact process

---

# 27. Georgian Copy Examples

Use these text examples where needed.

## Hero

```txt
Banovani — ელეგანტური სამოსი ყოველდღიური სილამაზისა და განსაკუთრებული მომენტებისთვის.
```

## CTA Buttons

```txt
კოლექციის ნახვა
ახალი პროდუქტები
კალათაში დამატება
შეკვეთა
ზომის არჩევა
ფერის არჩევა
```

## Checkout Success

```txt
მადლობა შეკვეთისთვის. Banovani მალე დაგიკავშირდებათ დეტალების დასადასტურებლად.
```

## Out of Stock

```txt
არ არის ხელმისაწვდომი
```

## Low Stock

```txt
დარჩენილია მხოლოდ {count} ცალი
```

## Delivery

```txt
მიტანის დეტალები
```

## Return Policy

```txt
გაცვლისა და დაბრუნების პირობები
```

---

# 28. Future Customer Account System

Do not make customer accounts mandatory in MVP.

Prepare future support for:

- Customer login
- Order history
- Saved addresses
- Wishlist
- Loyalty points
- Birthday offers
- Personalized recommendations

---

# 29. Analytics

Prepare tracking for:

- Product views
- Add to cart
- Checkout started
- Order completed
- Search queries
- Filter usage
- Top products
- Abandoned carts
- Revenue by product/category

Future integrations:

- Google Analytics 4
- Meta Pixel
- TikTok Pixel
- Hotjar / Microsoft Clarity

---

# 30. MVP Build Phases

## Phase 1 — Launch MVP

Build:

- Home page
- Shop page
- Product page
- Cart
- Checkout
- Admin login
- Product management
- Variant/stock management
- Order dashboard
- Basic responsive design
- Supabase database
- Image upload

This phase is enough for first real sales.

## Phase 2 — Growth Features

Add:

- Promo codes
- Wishlist
- Reviews
- Similar products
- Recently viewed products
- Email/Telegram notifications
- Better analytics
- Meta Pixel
- Google Analytics
- Instagram feed

## Phase 3 — Automation & Scale

Add:

- Online card payments
- Customer accounts
- Abandoned cart automation
- Loyalty system
- AI recommendations
- AI search
- Multi-language support
- Multi-currency support
- Inventory reports
- Sales reports
- Supplier/order planning

---

# 31. AI Coding Agent Prompt

Use this section as the direct prompt for an AI coding tool.

```txt
You are a senior full-stack developer and product designer.

Build a production-ready MVP e-commerce web application for Banovani, a Georgian women’s clothing brand.

The app must be built with Next.js, TypeScript, Tailwind CSS, shadcn/ui, Supabase, and Vercel-ready deployment.

The design must be elegant, minimal, feminine, warm, premium, mobile-first, and easy to use. Use a soft neutral color palette with beige, white, black, and soft rose accents. Georgian text support is required.

Core customer features:
- Home page with hero, categories, new arrivals, featured products, brand story, trust badges, and Instagram CTA.
- Product catalog with search, filters, sorting, product cards, mobile filter drawer.
- Product detail page with image gallery, product information, size/color variant selector, stock display, quantity selector, add to cart, WhatsApp/Instagram order CTA, size guide, delivery and return info.
- Products must support variants by size and color, with independent stock per variant.
- Cart with selected variant details, quantity updates, remove item, subtotal, delivery fee placeholder, and total.
- Guest checkout with first name, last name, phone, city, address, comment, delivery method, payment method.
- Order success page with order number and summary.
- The checkout must validate current stock and prices server-side before creating an order.

Core admin features:
- Admin login using Supabase Auth.
- Admin dashboard with order metrics, revenue estimate, recent orders, best-selling products, and low-stock products.
- Product management: create, edit, delete/hide products, upload images, set primary image, set category, price, sale price, description, fabric/care info, SEO metadata, active/featured/new/sale status.
- Variant management: create size/color combinations, SKU, stock, optional price override, active/inactive.
- Order management: view orders, search/filter orders, open order detail, change status, payment status, delivery status, add internal notes.
- Category management.
- Settings page for delivery, contact, social links, and store information.

Database:
Use Supabase PostgreSQL with these tables:
categories, products, product_images, product_variants, orders, order_items, settings.
Create SQL migrations for all required tables.
Enable secure Row Level Security.
Public users can read only active products/categories.
Admin users can manage products, categories, variants, images, orders, and settings.
Checkout should be handled through a secure server action/API route that validates prices and stock.

UX requirements:
- Mobile-first and thumb-friendly.
- Fast checkout.
- No mandatory customer account.
- Clear stock states.
- Clean errors and empty states.
- Sticky mobile add-to-cart where useful.
- Accessible forms and modals.
- Optimized images.
- SEO-friendly pages.

Performance:
Use Next.js Image, lazy loading, server components where appropriate, and clean code organization.
Target Lighthouse scores above 90 for Performance, Accessibility, Best Practices, and SEO.

Architecture:
Use this folder structure:
app/(store), app/admin, app/api, components, lib, hooks, types, public, styles.

Create reusable components:
Header, MobileMenu, Footer, ProductCard, ProductGrid, ProductFilters, ProductGallery, VariantSelector, SizeSelector, ColorSelector, QuantitySelector, AddToCartButton, CartDrawer, CartItem, CheckoutForm, OrderSummary, AdminSidebar, AdminProductForm, AdminVariantEditor, AdminImageUploader, AdminOrderTable, DashboardMetricCard, EmptyState, LoadingSkeleton.

Use Zod for validation.
Use Zustand or React Context for cart state with localStorage persistence.
Revalidate cart stock before checkout.

Deliver the project as clean, commented, production-ready code with clear setup instructions, environment variable examples, and Supabase SQL migrations.
```

---

# 32. Acceptance Criteria

The project is complete when:

## Storefront

- Customer can browse products
- Customer can filter/search products
- Customer can open product details
- Customer can select size/color
- Customer cannot buy out-of-stock variant
- Customer can add product to cart
- Customer can checkout as guest
- Order is saved in Supabase
- Stock is decreased after order
- Customer sees order success page

## Admin

- Admin can log in
- Admin can add product
- Admin can upload product images
- Admin can add variants
- Admin can set stock
- Admin can edit products
- Admin can hide products
- Admin can view orders
- Admin can update order status
- Admin can see low-stock products

## Technical

- App is responsive
- App is deployable to Vercel
- Supabase schema works
- RLS is enabled
- Server-side checkout validation works
- Basic SEO exists
- No critical console errors
- No exposed secrets

---

# 33. Recommended Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_INSTAGRAM_URL=
NEXT_PUBLIC_WHATSAPP_URL=

ADMIN_EMAIL=

# Optional future
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
META_PIXEL_ID=
GOOGLE_ANALYTICS_ID=
```

---

# 34. Suggested Initial Categories

```txt
Dresses
Tops
Sets
Pants
Skirts
Accessories
New Arrivals
Sale
```

---

# 35. Suggested Initial Product Labels

```txt
New
Sale
Bestseller
Limited
Low Stock
Coming Soon
```

---

# 36. Suggested Admin Dashboard Metrics

```txt
Today’s orders
Total orders
Pending orders
Completed orders
Estimated revenue
Best-selling product
Low-stock variants
Average order value
```

---

# 37. Important Business Notes

Banovani should launch with a web app first, not a native mobile app.

Reason:

- Instagram traffic can go directly to the website
- Lower development cost
- Faster launch
- Easier updates
- Better SEO
- Easier product management

A native app can be considered later when Banovani has:

- Repeat customers
- Larger product catalog
- Loyalty program
- Frequent new drops
- Enough order volume

---

# 38. Final Build Instruction

Build the MVP first. Do not overcomplicate the first release.

The first release must focus on:

1. Beautiful product presentation
2. Easy size/color selection
3. Reliable stock logic
4. Smooth cart and checkout
5. Simple admin product management
6. Simple admin order management
7. Mobile-first speed and clarity

After the MVP works, add advanced growth features step by step.

The final result should be a real, usable online store that Banovani can use for first product sales.
