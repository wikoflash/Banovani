'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, Minus, Plus, ShoppingBag, MessageCircle, Instagram, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useCartStore } from '@/lib/cart/store';
import { formatPrice, stockLabel } from '@/lib/utils';
import { ROUTES } from '@banovani/config';
import type { ProductWithDetails, ProductVariant } from '@banovani/types';

function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<ProductWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return;
        setProduct(data.product);
        const firstColor = data.product.variants?.[0]?.color ?? null;
        setSelectedColor(firstColor);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <ProductDetailSkeleton />;
  if (!product) return notFound();

  // Immutable reference to avoid TypeScript null issues in closures
  const p = product;

  const colors = [...new Set(p.variants?.map((v) => v.color).filter(Boolean) as string[])];
  const sizes = [...new Set(p.variants?.map((v) => v.size).filter(Boolean) as string[])];

  const selectedVariant: ProductVariant | undefined = p.variants?.find(
    (v) =>
      v.is_active &&
      (selectedColor ? v.color === selectedColor : true) &&
      (selectedSize ? v.size === selectedSize : true)
  );

  const isVariantOutOfStock = selectedVariant ? selectedVariant.stock === 0 : false;
  const canAddToCart = selectedVariant && !isVariantOutOfStock && selectedSize !== null;
  const stock = selectedVariant?.stock ?? 0;
  const stockMsg = stockLabel(stock);
  const effectivePrice = selectedVariant?.price_override ?? p.sale_price ?? p.price;

  function isSizeAvailableForColor(size: string, color: string | null) {
    return p.variants?.some(
      (v) => v.is_active && v.size === size && (color ? v.color === color : true) && v.stock > 0
    );
  }

  function handleAddToCart() {
    if (!canAddToCart || !selectedVariant) return;
    const primaryImage =
      p.images?.find((i) => i.is_primary)?.image_url ?? p.images?.[0]?.image_url ?? '';
    addItem({
      productId: p.id,
      variantId: selectedVariant.id,
      name: p.name,
      slug: p.slug,
      image: primaryImage,
      color: selectedColor ?? undefined,
      size: selectedSize ?? undefined,
      quantity,
      unitPrice: effectivePrice,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const sortedImages = [...(p.images ?? [])].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-[--color-secondary-text]">
        <Link href={ROUTES.shop} className="hover:text-[--color-primary-text]">Shop</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-[--color-primary-text]">{p.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image Gallery */}
        <div className="flex gap-3">
          {sortedImages.length > 1 && (
            <div className="flex flex-col gap-2 overflow-y-auto">
              {sortedImages.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                    activeImage === i ? 'border-[--color-deep-brown]' : 'border-transparent'
                  }`}
                >
                  <Image src={img.image_url} alt={img.alt_text ?? p.name} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
          <div className="relative aspect-[3/4] flex-1 overflow-hidden rounded-2xl bg-[--color-muted]">
            {sortedImages[activeImage] ? (
              <Image
                src={sortedImages[activeImage].image_url}
                alt={sortedImages[activeImage].alt_text ?? p.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-[--color-secondary-text]">
                No image
              </div>
            )}
            {sortedImages.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImage((i) => Math.max(0, i - 1))}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow-md"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setActiveImage((i) => Math.min(sortedImages.length - 1, i + 1))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow-md"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="flex flex-wrap gap-2">
            {p.is_new && <Badge variant="new">New</Badge>}
            {p.is_sale && <Badge variant="sale">Sale</Badge>}
            {p.is_featured && <Badge variant="bestseller">Bestseller</Badge>}
          </div>

          <h1 className="mt-3 font-brand text-2xl text-[--color-deep-brown] sm:text-3xl">{p.name}</h1>

          <div className="mt-3 flex items-center gap-3">
            <span className="text-2xl font-semibold text-[--color-primary-text]">
              {formatPrice(effectivePrice)}
            </span>
            {p.sale_price && (
              <span className="text-base text-[--color-secondary-text] line-through">
                {formatPrice(p.price)}
              </span>
            )}
          </div>

          {p.short_description && (
            <p className="mt-4 text-sm leading-relaxed text-[--color-secondary-text]">
              {p.short_description}
            </p>
          )}

          <Separator className="my-6" />

          {/* Color Selector */}
          {colors.length > 0 && (
            <div className="mb-5">
              <p className="mb-2 text-sm font-medium">
                Color: <span className="font-normal text-[--color-secondary-text]">{selectedColor}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => { setSelectedColor(color); setSelectedSize(null); }}
                    className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                      selectedColor === color
                        ? 'border-[--color-deep-brown] bg-[--color-deep-brown] text-white'
                        : 'border-[--color-border] hover:border-[--color-accent-beige]'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {sizes.length > 0 && (
            <div className="mb-5">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium">
                  Size: <span className="font-normal text-[--color-secondary-text]">{selectedSize ?? 'Select'}</span>
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => {
                  const available = isSizeAvailableForColor(size, selectedColor);
                  return (
                    <button
                      key={size}
                      disabled={!available}
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-md border px-3 py-1.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                        selectedSize === size
                          ? 'border-[--color-deep-brown] bg-[--color-deep-brown] text-white'
                          : 'border-[--color-border] hover:border-[--color-accent-beige]'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stock indicator */}
          {selectedVariant && (
            <p className={`mb-4 text-sm ${isVariantOutOfStock ? 'text-[--color-error]' : 'text-[--color-success]'}`}>
              {isVariantOutOfStock ? 'Out of stock' : stockMsg ?? 'In stock'}
            </p>
          )}

          {/* Quantity + Add to cart */}
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-md border border-[--color-border]">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2 hover:bg-[--color-muted]"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-8 text-center text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(stock || 99, q + 1))}
                className="px-3 py-2 hover:bg-[--color-muted]"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <Button
              size="lg"
              className="flex-1"
              disabled={!canAddToCart}
              onClick={handleAddToCart}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              {added ? 'Added!' : isVariantOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>

          {/* WhatsApp / Instagram CTAs */}
          <div className="mt-3 flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 gap-1.5" asChild>
              <a href={process.env.NEXT_PUBLIC_WHATSAPP_URL ?? '#'} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" />
                Order via WhatsApp
              </a>
            </Button>
            <Button variant="outline" size="sm" className="flex-1 gap-1.5" asChild>
              <a href={process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? '#'} target="_blank" rel="noopener noreferrer">
                <Instagram className="h-4 w-4" />
                Order via Instagram
              </a>
            </Button>
          </div>

          <Separator className="my-6" />

          {/* Details accordion */}
          <div className="flex flex-col gap-3 text-sm">
            {p.description && (
              <details className="group">
                <summary className="flex cursor-pointer items-center justify-between py-2 font-medium">
                  Description
                  <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
                </summary>
                <p className="pb-3 text-[--color-secondary-text] leading-relaxed">{p.description}</p>
              </details>
            )}
            {p.fabric_info && (
              <details className="group border-t border-[--color-border]">
                <summary className="flex cursor-pointer items-center justify-between py-2 font-medium">
                  Fabric & Care
                  <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
                </summary>
                <p className="pb-3 text-[--color-secondary-text]">{p.fabric_info}</p>
              </details>
            )}
            <details className="group border-t border-[--color-border]">
              <summary className="flex cursor-pointer items-center justify-between py-2 font-medium">
                Delivery
                <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
              </summary>
              <p className="pb-3 text-[--color-secondary-text]">
                {p.delivery_info ?? 'Tbilisi: 1-2 business days. Regions: 2-4 business days. Free delivery on orders over ₾150.'}
              </p>
            </details>
            <details className="group border-t border-[--color-border]">
              <summary className="flex cursor-pointer items-center justify-between py-2 font-medium">
                Returns
                <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
              </summary>
              <p className="pb-3 text-[--color-secondary-text]">
                {p.return_info ?? 'Items can be exchanged within 14 days. Contact us via Instagram or WhatsApp.'}
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
