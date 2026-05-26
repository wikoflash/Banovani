import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ROUTES } from '@banovani/config';
import { formatPrice } from '@/lib/utils';

async function getOrder(orderId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/orders/${orderId}`, { cache: 'no-store' });
  if (!res.ok) return null;
  const data = await res.json();
  return data.order ?? null;
}

type Order = {
  id: string;
  order_number: string;
  customer_first_name: string;
  customer_last_name: string | null;
  customer_phone: string;
  customer_email: string | null;
  city: string;
  address: string;
  delivery_method: string | null;
  payment_method: string | null;
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: string;
  comment: string | null;
  order_items: Array<{
    id: string;
    quantity: number;
    unit_price: number;
    product_name: string;
    size: string | null;
    color: string | null;
  }>;
};

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order: Order | null = await getOrder(orderId);

  if (!order) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-brand text-xl text-[--color-deep-brown]">Order not found</h1>
        <Button className="mt-6" asChild>
          <Link href={ROUTES.shop}>Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  const DELIVERY_LABELS: Record<string, string> = {
    tbilisi: 'Tbilisi Courier',
    regional: 'Regional Courier',
    pickup: 'Pickup',
  };
  const PAYMENT_LABELS: Record<string, string> = {
    cash_on_delivery: 'Cash on Delivery',
    bank_transfer: 'Bank Transfer',
    instagram_order: 'Instagram',
    whatsapp_order: 'WhatsApp',
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      {/* Success header */}
      <div className="mb-8 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-[--color-success]" />
        <h1 className="font-brand text-2xl text-[--color-deep-brown]">Order Placed!</h1>
        <p className="mt-2 text-[--color-secondary-text]">
          Thank you, {order.customer_first_name}! Your order has been received.
        </p>
        <p className="mt-1 text-sm font-medium text-[--color-primary-text]">
          Order #{order.order_number}
        </p>
      </div>

      {/* Order details card */}
      <div className="rounded-xl border border-[--color-border] bg-[--color-surface] p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[--color-secondary-text]">
          Order Details
        </h2>

        {/* Items */}
        <div className="flex flex-col gap-3">
          {order.order_items.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-3 text-sm">
              <div>
                <p className="font-medium">{item.product_name}</p>
                <p className="text-xs text-[--color-secondary-text]">
                  {[item.color, item.size].filter(Boolean).join(' / ')} × {item.quantity}
                </p>
              </div>
              <span>{formatPrice(item.unit_price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        {/* Totals */}
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[--color-secondary-text]">Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[--color-secondary-text]">Delivery</span>
            <span>{formatPrice(order.delivery_fee === 0 ? 0 : order.delivery_fee)}</span>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="flex justify-between text-base font-semibold">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>

        <Separator className="my-4" />

        {/* Delivery info */}
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[--color-secondary-text]">Delivery Method</span>
            <span>{order.delivery_method ? (DELIVERY_LABELS[order.delivery_method] ?? order.delivery_method) : '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[--color-secondary-text]">Payment</span>
            <span>{order.payment_method ? (PAYMENT_LABELS[order.payment_method] ?? order.payment_method) : '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[--color-secondary-text]">Address</span>
            <span className="text-right">
              {order.address}, {order.city}
            </span>
          </div>
        </div>

        {order.comment && (
          <>
            <Separator className="my-4" />
            <p className="text-sm text-[--color-secondary-text]">
              <span className="font-medium">Note:</span> {order.comment}
            </p>
          </>
        )}
      </div>

      {/* Message */}
      <div className="mt-6 rounded-xl bg-[--color-muted] p-4 text-center text-sm text-[--color-secondary-text]">
        We will contact you shortly via phone ({order.customer_phone}) to confirm your order.
        {order.customer_email && ` A confirmation email will also be sent to ${order.customer_email}.`}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button className="flex-1" asChild>
          <Link href={ROUTES.shop}>Continue Shopping</Link>
        </Button>
        <Button variant="outline" className="flex-1" asChild>
          <a
            href={process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
          >
            Follow us on Instagram
          </a>
        </Button>
      </div>
    </div>
  );
}
