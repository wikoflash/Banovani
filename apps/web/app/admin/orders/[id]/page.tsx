'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AdminStatusBadge, AdminPaymentBadge } from '@/components/admin/admin-status-badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice, formatDate } from '@/lib/utils';
import { ROUTES, ORDER_STATUSES, ORDER_STATUS_LABELS, PAYMENT_STATUSES } from '@banovani/config';
import type { OrderStatus, PaymentStatus } from '@banovani/types';

type OrderDetail = {
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
  status: string;
  payment_status: string;
  delivery_status: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  comment: string | null;
  admin_note: string | null;
  created_at: string;
  order_items: Array<{
    id: string;
    quantity: number;
    unit_price: number;
    product_name: string;
    size: string | null;
    color: string | null;
  }>;
};

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editStatus, setEditStatus] = useState('');
  const [editPayment, setEditPayment] = useState('');
  const [editNote, setEditNote] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setOrder(data.order);
        setEditStatus(data.order?.status ?? '');
        setEditPayment(data.order?.payment_status ?? '');
        setEditNote(data.order?.admin_note ?? '');
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editStatus,
          payment_status: editPayment,
          admin_note: editNote,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl">
        <Skeleton className="mb-4 h-8 w-1/3" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-[--color-secondary-text]">Order not found.</p>
        <Button asChild className="mt-4">
          <Link href={ROUTES.admin.orders}>Back to Orders</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href={ROUTES.admin.orders}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Orders
        </Link>
      </Button>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-brand text-2xl text-[--color-deep-brown]">
            #{order.order_number}
          </h1>
          <p className="mt-1 text-sm text-[--color-secondary-text]">{formatDate(order.created_at)}</p>
        </div>
        <AdminStatusBadge status={order.status as OrderStatus} />
      </div>

      <div className="grid gap-5">
        {/* Order Items */}
        <section className="rounded-xl border border-[--color-border] bg-[--color-surface] p-5">
          <h2 className="mb-4 text-sm font-semibold">Items</h2>
          <div className="flex flex-col gap-3">
            {order.order_items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div>
                  <p className="font-medium">{item.product_name}</p>
                  <p className="text-xs text-[--color-secondary-text]">
                    {[item.color, item.size].filter(Boolean).join(' / ')} × {item.quantity}
                  </p>
                </div>
                <span className="font-medium">{formatPrice(item.unit_price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[--color-secondary-text]">Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[--color-secondary-text]">Delivery</span>
              <span>{order.delivery_fee === 0 ? 'Free' : formatPrice(order.delivery_fee)}</span>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between text-base font-bold">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </section>

        {/* Customer */}
        <section className="rounded-xl border border-[--color-border] bg-[--color-surface] p-5">
          <h2 className="mb-3 text-sm font-semibold">Customer</h2>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[--color-secondary-text]">Name</span>
              <span>{order.customer_first_name} {order.customer_last_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[--color-secondary-text]">Phone</span>
              <a href={`tel:${order.customer_phone}`} className="font-medium hover:underline">{order.customer_phone}</a>
            </div>
            {order.customer_email && (
              <div className="flex justify-between">
                <span className="text-[--color-secondary-text]">Email</span>
                <span>{order.customer_email}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[--color-secondary-text]">Address</span>
              <span className="text-right">{order.address}, {order.city}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[--color-secondary-text]">Delivery</span>
              <span>{order.delivery_method}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[--color-secondary-text]">Payment</span>
              <span>{order.payment_method}</span>
            </div>
          </div>
          {order.comment && (
            <>
              <Separator className="my-3" />
              <p className="text-sm text-[--color-secondary-text]">
                <strong>Customer note:</strong> {order.comment}
              </p>
            </>
          )}
        </section>

        {/* Status Management */}
        <section className="rounded-xl border border-[--color-border] bg-[--color-surface] p-5">
          <h2 className="mb-4 text-sm font-semibold">Manage Order</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm">Order Status</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="w-full rounded-md border border-[--color-border] bg-[--color-surface] px-3 py-2 text-sm focus:outline-none"
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {ORDER_STATUS_LABELS[s as OrderStatus] ?? s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm">Payment Status</label>
              <select
                value={editPayment}
                onChange={(e) => setEditPayment(e.target.value)}
                className="w-full rounded-md border border-[--color-border] bg-[--color-surface] px-3 py-2 text-sm focus:outline-none"
              >
                {PAYMENT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-1.5 block text-sm">Admin Note</label>
            <textarea
              value={editNote}
              onChange={(e) => setEditNote(e.target.value)}
              rows={3}
              placeholder="Internal note..."
              className="w-full rounded-md border border-[--color-border] bg-[--color-surface] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[--color-accent-beige]"
            />
          </div>
          <Button className="mt-3" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : success ? 'Saved!' : 'Save Changes'}
          </Button>
        </section>
      </div>
    </div>
  );
}
