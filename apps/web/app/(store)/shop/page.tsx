'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Search, SlidersHorizontal, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@banovani/config';
import { formatPrice } from '@/lib/utils';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Popular' },
  { value: 'sale', label: 'On Sale' },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  sale_price: number | null;
  is_new: boolean;
  is_sale: boolean;
  product_images: Array<{ image_url: string; is_primary: boolean }>;
  product_variants: Array<{ size: string | null; color: string | null; stock: number; is_active: boolean }>;
};

function ProductCard({ product }: { product: Product }) {
  const primaryImage =
    product.product_images?.find((i) => i.is_primary)?.image_url ??
    product.product_images?.[0]?.image_url;

  const availableSizes = [
    ...new Set(
      product.product_variants
        ?.filter((v) => v.is_active && v.stock > 0)
        .map((v) => v.size)
        .filter(Boolean) as string[]
    ),
  ];

  return (
    <Link href={ROUTES.product(product.slug)} className="group block">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[--color-muted]">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[--color-secondary-text]">
            <Sparkles className="h-8 w-8" />
          </div>
        )}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.is_new && <Badge variant="new">New</Badge>}
          {product.is_sale && <Badge variant="sale">Sale</Badge>}
        </div>
      </div>
      <div className="mt-3">
        <h3 className="text-sm font-medium text-[--color-primary-text] group-hover:underline line-clamp-1">
          {product.name}
        </h3>
        <div className="mt-1 flex items-center gap-2">
          {product.sale_price ? (
            <>
              <span className="text-sm font-semibold text-[--color-error]">
                {formatPrice(product.sale_price)}
              </span>
              <span className="text-xs text-[--color-secondary-text] line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="text-sm font-medium">{formatPrice(product.price)}</span>
          )}
        </div>
        {availableSizes.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {availableSizes.slice(0, 4).map((size) => (
              <span
                key={size}
                className="rounded border border-[--color-border] px-1.5 py-0.5 text-[10px] text-[--color-secondary-text]"
              >
                {size}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i}>
          <Skeleton className="aspect-[3/4] w-full rounded-xl" />
          <Skeleton className="mt-3 h-4 w-3/4" />
          <Skeleton className="mt-1.5 h-3 w-1/3" />
        </div>
      ))}
    </div>
  );
}

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);

  const search = searchParams.get('search') ?? '';
  const sort = searchParams.get('sort') ?? 'newest';
  const activeSizes = searchParams.get('sizes')?.split(',').filter(Boolean) ?? [];
  const filter = searchParams.get('filter');

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${ROUTES.shop}?${params.toString()}`);
  }

  function toggleSize(size: string) {
    const current = new Set(activeSizes);
    if (current.has(size)) current.delete(size);
    else current.add(size);
    updateParam('sizes', current.size > 0 ? [...current].join(',') : null);
  }

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (sort) params.set('sort', sort);
    if (activeSizes.length > 0) params.set('sizes', activeSizes.join(','));
    if (filter === 'new') params.set('new', 'true');
    if (filter === 'sale') params.set('sale', 'true');

    setLoading(true);
    fetch(`/api/products?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products ?? []);
        setTotal(data.pagination?.total ?? 0);
      })
      .finally(() => setLoading(false));
  }, [search, sort, activeSizes.join(','), filter]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-brand text-2xl text-[--color-deep-brown]">
          {filter === 'new' ? 'New Arrivals' : filter === 'sale' ? 'Sale' : 'Shop'}
        </h1>
        <p className="text-sm text-[--color-secondary-text]">{total} products</p>
      </div>

      {/* Search + Sort + Filter bar */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[--color-secondary-text]" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-9"
            value={search}
            onChange={(e) => updateParam('search', e.target.value || null)}
          />
        </div>
        <select
          value={sort}
          onChange={(e) => updateParam('sort', e.target.value)}
          className="h-10 rounded-md border border-[--color-border] bg-[--color-surface] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[--color-accent-beige]"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => setFilterOpen((v) => !v)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeSizes.length > 0 && (
            <span className="rounded-full bg-[--color-deep-brown] px-1.5 py-0.5 text-[10px] text-white">
              {activeSizes.length}
            </span>
          )}
        </Button>
      </div>

      {/* Filter drawer */}
      {filterOpen && (
        <div className="mb-6 rounded-xl border border-[--color-border] bg-[--color-surface] p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Size</h3>
            {activeSizes.length > 0 && (
              <button
                onClick={() => updateParam('sizes', null)}
                className="text-xs text-[--color-secondary-text] hover:text-[--color-primary-text]"
              >
                Clear
              </button>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {SIZES.map((size) => (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                  activeSizes.includes(size)
                    ? 'border-[--color-deep-brown] bg-[--color-deep-brown] text-white'
                    : 'border-[--color-border] hover:border-[--color-accent-beige]'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Products grid */}
      {loading ? (
        <ProductGridSkeleton />
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Sparkles className="mb-4 h-10 w-10 text-[--color-accent-beige]" />
          <h3 className="text-lg font-medium text-[--color-primary-text]">No products found</h3>
          <p className="mt-2 text-sm text-[--color-secondary-text]">
            Try adjusting your filters or search query
          </p>
          <Button variant="outline" className="mt-6" onClick={() => router.push(ROUTES.shop)}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-8"><ProductGridSkeleton /></div>}>
      <ShopContent />
    </Suspense>
  );
}
