'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/lib/cart/store';
import { formatPrice } from '@/lib/utils';
import { ROUTES } from '@banovani/config';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center justify-center px-4 py-24 text-center">
        <ShoppingBag className="mb-4 h-12 w-12 text-[--color-accent-beige]" />
        <h1 className="font-brand text-xl text-[--color-deep-brown]">Your cart is empty</h1>
        <p className="mt-2 text-sm text-[--color-secondary-text]">
          Add some beautiful pieces to get started.
        </p>
        <Button className="mt-8" asChild>
          <Link href={ROUTES.shop}>Shop Now</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-brand text-2xl text-[--color-deep-brown]">Your Cart</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Items */}
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div key={item.variantId} className="flex gap-4 rounded-xl border border-[--color-border] bg-[--color-surface] p-4">
              <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-[--color-muted]">
                {item.image && (
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      href={ROUTES.product(item.slug)}
                      className="text-sm font-medium hover:underline"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-[--color-secondary-text]">
                      {[item.color, item.size].filter(Boolean).join(' / ')}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.variantId)}
                    className="text-[--color-secondary-text] hover:text-[--color-error]"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-md border border-[--color-border]">
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      className="px-2 py-1 hover:bg-[--color-muted]"
                      aria-label="Decrease"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="min-w-6 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      className="px-2 py-1 hover:bg-[--color-muted]"
                      aria-label="Increase"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="text-sm font-medium">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <div className="mt-2">
            <Button variant="link" asChild className="text-sm">
              <Link href={ROUTES.shop}>← Continue Shopping</Link>
            </Button>
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-xl border border-[--color-border] bg-[--color-surface] p-6 h-fit">
          <h2 className="mb-4 text-base font-semibold">Order Summary</h2>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[--color-secondary-text]">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[--color-secondary-text]">Delivery</span>
              <span className="text-[--color-secondary-text]">Calculated at checkout</span>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <Button size="xl" className="mt-6 w-full" asChild>
            <Link href={ROUTES.checkout}>Proceed to Checkout</Link>
          </Button>
          <p className="mt-3 text-center text-xs text-[--color-secondary-text]">
            Free delivery on orders over ₾150
          </p>
        </div>
      </div>
    </div>
  );
}
