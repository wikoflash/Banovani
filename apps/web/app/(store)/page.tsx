import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Instagram, Truck, Star, Shield, MessageCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@banovani/config';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: "Banovani — Elegant Women's Fashion",
  description:
    "Elegant clothing for everyday beauty and special moments. Shop women's dresses, tops, sets, and accessories in Georgia.",
};

async function getFeaturedProducts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('products')
    .select('id, name, slug, price, sale_price, is_new, is_sale, product_images(image_url, is_primary, sort_order)')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('sort_order', { ascending: false })
    .limit(4);
  return data ?? [];
}

async function getNewArrivals() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('products')
    .select('id, name, slug, price, sale_price, is_new, is_sale, product_images(image_url, is_primary, sort_order)')
    .eq('is_active', true)
    .eq('is_new', true)
    .order('created_at', { ascending: false })
    .limit(4);
  return data ?? [];
}

const CATEGORIES = [
  { label: 'Dresses', slug: 'dresses', emoji: '👗' },
  { label: 'Tops', slug: 'tops', emoji: '👕' },
  { label: 'Sets', slug: 'sets', emoji: '✨' },
  { label: 'Pants', slug: 'pants', emoji: '👖' },
  { label: 'New Arrivals', slug: 'new-arrivals', emoji: '🆕' },
  { label: 'Sale', slug: 'sale', emoji: '🏷️' },
];

const TRUST_BADGES = [
  { icon: Truck, label: 'Fast Local Delivery' },
  { icon: Star, label: 'Carefully Selected Fabrics' },
  { icon: Shield, label: 'Secure Orders' },
  { icon: MessageCircle, label: 'Direct Support' },
];

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  sale_price: number | null;
  is_new: boolean;
  is_sale: boolean;
  product_images: Array<{ image_url: string; is_primary: boolean; sort_order: number }>;
};

function ProductCard({ product }: { product: Product }) {
  const primaryImage =
    product.product_images?.find((i) => i.is_primary)?.image_url ??
    product.product_images?.[0]?.image_url;

  return (
    <Link href={ROUTES.product(product.slug)} className="group block">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[--color-muted]">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[--color-secondary-text]">
            <Sparkles className="h-8 w-8" />
          </div>
        )}
        {(product.is_new || product.is_sale) && (
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {product.is_new && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                New
              </span>
            )}
            {product.is_sale && (
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                Sale
              </span>
            )}
          </div>
        )}
      </div>
      <div className="mt-3 px-0.5">
        <h3 className="text-sm font-medium text-[--color-primary-text] group-hover:underline">
          {product.name}
        </h3>
        <div className="mt-1 flex items-center gap-2">
          {product.sale_price ? (
            <>
              <span className="text-sm font-semibold text-[--color-error]">
                {product.sale_price} ₾
              </span>
              <span className="text-xs text-[--color-secondary-text] line-through">
                {product.price} ₾
              </span>
            </>
          ) : (
            <span className="text-sm font-medium text-[--color-primary-text]">
              {product.price} ₾
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default async function HomePage() {
  const [featuredProducts, newArrivals] = await Promise.all([
    getFeaturedProducts(),
    getNewArrivals(),
  ]);

  return (
    <div className="min-h-screen">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[85vh] flex-col items-center justify-center bg-gradient-to-b from-[#F5EFE8] to-[--color-background] px-4 text-center sm:px-6">
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-[--color-secondary-text]">
          New Collection
        </p>
        <h1 className="font-brand max-w-2xl text-4xl leading-tight text-[--color-deep-brown] sm:text-5xl lg:text-6xl">
          Elegant clothing for everyday beauty
        </h1>
        <p className="mt-4 max-w-lg text-base text-[--color-secondary-text]">
          ელეგანტური სამოსი ყოველდღიური სილამაზისა და განსაკუთრებული მომენტებისთვის.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href={ROUTES.shop}>
              Shop Collection <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href={`${ROUTES.shop}?filter=new`}>New Arrivals</Link>
          </Button>
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center font-brand text-2xl text-[--color-deep-brown] sm:text-3xl">
          Shop by Category
        </h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={ROUTES.category(cat.slug)}
              className="group flex flex-col items-center gap-2 rounded-xl border border-[--color-border] bg-[--color-surface] p-4 text-center transition-shadow hover:shadow-md"
            >
              <span className="text-2xl">{cat.emoji}</span>
              <span className="text-xs font-medium text-[--color-primary-text]">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── New Arrivals ──────────────────────────────────────────────────── */}
      {newArrivals.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-brand text-2xl text-[--color-deep-brown] sm:text-3xl">
              New Arrivals
            </h2>
            <Button variant="link" asChild>
              <Link href={`${ROUTES.shop}?filter=new`} className="text-sm">
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ── Featured / Best Sellers ───────────────────────────────────────── */}
      {featuredProducts.length > 0 && (
        <section className="bg-[--color-surface] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="font-brand text-2xl text-[--color-deep-brown] sm:text-3xl">
                Best Sellers
              </h2>
              <Button variant="link" asChild>
                <Link href={ROUTES.shop} className="text-sm">
                  View all <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Brand Story ───────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="font-brand text-2xl text-[--color-deep-brown] sm:text-3xl">
          About Banovani
        </h2>
        <p className="mt-6 text-base leading-relaxed text-[--color-secondary-text]">
          Banovani creates elegant, comfortable, and timeless pieces for women who want to feel
          confident in both everyday and special moments. Each piece is carefully selected for
          quality, style, and wearability.
        </p>
        <Button variant="outline" className="mt-8" asChild>
          <Link href={ROUTES.about}>Our Story</Link>
        </Button>
      </section>

      {/* ── Trust Badges ──────────────────────────────────────────────────── */}
      <section className="border-y border-[--color-border] bg-[--color-surface]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-[--color-border] px-4 sm:grid-cols-4 sm:divide-y-0 lg:px-8">
          {TRUST_BADGES.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 px-6 py-8 text-center">
              <Icon className="h-5 w-5 text-[--color-accent-beige]" />
              <span className="text-xs font-medium text-[--color-secondary-text]">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Instagram CTA ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <Instagram className="mx-auto mb-4 h-6 w-6 text-[--color-secondary-text]" />
        <h2 className="font-brand text-xl text-[--color-deep-brown]">Follow Banovani</h2>
        <p className="mt-3 text-sm text-[--color-secondary-text]">
          Follow us on Instagram for new drops, styling ideas, and limited pieces.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <a
              href={process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="mr-2 h-4 w-4" />
              Follow on Instagram
            </a>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a
              href={process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
            >
              Order via Instagram
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
