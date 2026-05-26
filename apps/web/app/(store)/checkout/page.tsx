'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/lib/cart/store';
import { formatPrice } from '@/lib/utils';
import { ROUTES, FREE_DELIVERY_THRESHOLD } from '@banovani/config';
import { checkoutSchema, type CheckoutInput } from '@banovani/validation';

const DELIVERY_OPTIONS = [
  { value: 'tbilisi', label: 'Tbilisi Courier', price: 5 },
  { value: 'regional', label: 'Regional Courier', price: 10 },
  { value: 'pickup', label: 'Pickup (Free)', price: 0 },
];

const DELIVERY_FEE_MAP: Record<string, number> = { tbilisi: 5, regional: 10, pickup: 0 };

const PAYMENT_OPTIONS = [
  { value: 'cash_on_delivery', label: 'Cash on Delivery' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'instagram_order', label: 'Order via Instagram' },
  { value: 'whatsapp_order', label: 'Order via WhatsApp' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const subtotal = getSubtotal();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryMethod: 'tbilisi',
      paymentMethod: 'cash_on_delivery',
    },
  });

  const deliveryMethod = watch('deliveryMethod') as string;
  const deliveryFeeMap: Record<string, number> = { tbilisi: 5, regional: 10, pickup: 0 };
  const deliveryFee =
    subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : (deliveryFeeMap[deliveryMethod] ?? 5);
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-brand text-xl text-[--color-deep-brown]">Your cart is empty</h1>
        <Button className="mt-6" asChild>
          <Link href={ROUTES.shop}>Shop Now</Link>
        </Button>
      </div>
    );
  }

  async function onSubmit(data: CheckoutInput) {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          items: items.map((i) => ({
            variantId: i.variantId,
            quantity: i.quantity,
          })),
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? 'Order failed. Please try again.');
        return;
      }
      clearCart();
      router.push(ROUTES.orderSuccess(json.orderId));
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href={ROUTES.cart}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Cart
          </Link>
        </Button>
      </div>

      <h1 className="mb-8 font-brand text-2xl text-[--color-deep-brown]">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* Left: Form */}
        <div className="flex flex-col gap-6">
          {/* Contact */}
          <section className="rounded-xl border border-[--color-border] bg-[--color-surface] p-5">
            <h2 className="mb-4 text-base font-semibold">Contact</h2>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">First Name *</label>
                  <Input {...register('firstName')} placeholder="Ana" />
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-[--color-error]">{errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Last Name</label>
                  <Input {...register('lastName')} placeholder="Beridze" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Phone *</label>
                <Input {...register('phone')} placeholder="+995 555 000 000" type="tel" />
                {errors.phone && (
                  <p className="mt-1 text-xs text-[--color-error]">{errors.phone.message as string}</p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Email (optional)</label>
              <Input {...register('email' as any)} placeholder="ana@example.com" type="email" />
              </div>
            </div>
          </section>

          {/* Delivery Address */}
          <section className="rounded-xl border border-[--color-border] bg-[--color-surface] p-5">
            <h2 className="mb-4 text-base font-semibold">Delivery</h2>
            <div className="mb-4 grid gap-2">
              {DELIVERY_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-[--color-border] p-3 has-[:checked]:border-[--color-deep-brown] has-[:checked]:bg-[--color-muted]"
                >
                  <input
                    type="radio"
                    value={opt.value}
                    {...register('deliveryMethod')}
                    className="accent-[--color-deep-brown]"
                  />
                  <span className="flex-1 text-sm">{opt.label}</span>
                  <span className="text-sm font-medium">
                    {opt.price === 0 ? 'Free' : `₾${opt.price}`}
                  </span>
                </label>
              ))}
            </div>
            <div className="grid gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">City *</label>
                <Input {...register('city')} placeholder="Tbilisi" />
                {errors.city && (
                  <p className="mt-1 text-xs text-[--color-error]">{errors.city.message as string}</p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Address *</label>
                <Input {...register('address')} placeholder="Street, building, apartment" />
                {errors.address && (
                  <p className="mt-1 text-xs text-[--color-error]">{errors.address.message as string}</p>
                )}
              </div>
            </div>
          </section>

          {/* Payment */}
          <section className="rounded-xl border border-[--color-border] bg-[--color-surface] p-5">
            <h2 className="mb-4 text-base font-semibold">Payment</h2>
            <div className="grid gap-2">
              {PAYMENT_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-[--color-border] p-3 has-[:checked]:border-[--color-deep-brown] has-[:checked]:bg-[--color-muted]"
                >
                  <input
                    type="radio"
                    value={opt.value}
                    {...register('paymentMethod')}
                    className="accent-[--color-deep-brown]"
                  />
                  <span className="text-sm">{opt.label}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Notes */}
          <section className="rounded-xl border border-[--color-border] bg-[--color-surface] p-5">
            <h2 className="mb-4 text-base font-semibold">Order Note (optional)</h2>
            <Textarea
              {...register('comment')}
              placeholder="Any special requests or instructions..."
              rows={3}
            />
          </section>
        </div>

        {/* Right: Order Summary */}
        <div className="h-fit rounded-xl border border-[--color-border] bg-[--color-surface] p-6">
          <h2 className="mb-4 text-base font-semibold">Order Summary</h2>
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div key={item.variantId} className="flex items-center gap-3">
                <div className="relative h-12 w-10 flex-shrink-0 overflow-hidden rounded bg-[--color-muted]">
                  {item.image && (
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-xs font-medium">{item.name}</p>
                  <p className="text-xs text-[--color-secondary-text]">
                    {[item.color, item.size].filter(Boolean).join(' / ')} × {item.quantity}
                  </p>
                </div>
                <span className="text-xs font-medium">
                  {formatPrice(item.unitPrice * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[--color-secondary-text]">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[--color-secondary-text]">Delivery</span>
              <span>{deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}</span>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex justify-between text-base font-bold">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>

          {error && (
            <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-[--color-error]">{error}</p>
          )}

          <Button
            type="submit"
            size="xl"
            className="mt-5 w-full"
            disabled={submitting}
          >
            {submitting ? 'Placing Order...' : 'Place Order'}
          </Button>

          <p className="mt-3 text-center text-xs text-[--color-secondary-text]">
            By placing your order you agree to our terms.
          </p>
        </div>
      </form>
    </div>
  );
}
