'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { formatPrice, formatDate } from '@/lib/utils';
import { ROUTES, ORDER_STATUSES } from '@banovani/config';
import { Button } from '@/components/ui/button';
import type { OrderStatus } from '@banovani/types';
import { Suspense } from 'react';

type Order = {
  id: string;
  order_number: string;
  customer_first_name: string;
  customer_last_name: string | null;
  customer_phone: string;
  status: string;
  payment_status: string;
  total: number;
  created_at: string;
  delivery_method: string | null;
};

function OrdersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const status = searchParams.get('status') ?? '';
  const search = searchParams.get('search') ?? '';
  const page = Number(searchParams.get('page') ?? '1');

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    if (key !== 'page') params.delete('page');
    router.push(`${ROUTES.admin.orders}?${params.toString()}`);
  }

  useEffect(() => {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (search) params.set('search', search);
    params.set('page', String(page));

    setLoading(true);
    fetch(`/api/admin/orders?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setOrders(data.orders ?? []);
        setTotal(data.pagination?.total ?? 0);
      })
      .finally(() => setLoading(false));
  }, [status, search, page]);

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-brand text-2xl text-[--color-deep-brown]">Orders</h1>
        <span className="text-sm text-[--color-secondary-text]">{total} total</span>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap gap-3">
        <div className="relative min-w-48 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[--color-secondary-text]" />
          <Input
            placeholder="Search by name or phone..."
            className="pl-9"
            value={search}
            onChange={(e) => updateParam('search', e.target.value || null)}
          />
        </div>
        <select
          value={status}
          onChange={(e) => updateParam('status', e.target.value || null)}
          className="h-10 rounded-md border border-[--color-border] bg-[--color-surface] px-3 text-sm focus:outline-none"
        >
          <option value="">All Statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[--color-border] bg-[--color-surface]">
        {loading ? (
          <div className="p-8 text-center text-sm text-[--color-secondary-text]">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-sm text-[--color-secondary-text]">
            No orders found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[--color-border] bg-[--color-muted]">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-[--color-secondary-text]">Order</th>
                  <th className="px-4 py-3 text-left font-medium text-[--color-secondary-text]">Customer</th>
                  <th className="px-4 py-3 text-left font-medium text-[--color-secondary-text]">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-[--color-secondary-text]">Total</th>
                  <th className="px-4 py-3 text-left font-medium text-[--color-secondary-text]">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-[--color-border] last:border-none hover:bg-[--color-muted]"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={ROUTES.admin.orderDetail(order.id)}
                        className="font-medium text-[--color-deep-brown] hover:underline"
                      >
                        #{order.order_number}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{order.customer_first_name} {order.customer_last_name}</p>
                      <p className="text-xs text-[--color-secondary-text]">{order.customer_phone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <AdminStatusBadge status={order.status as OrderStatus} />
                    </td>
                    <td className="px-4 py-3 font-medium">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3 text-[--color-secondary-text]">
                      {formatDate(order.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => updateParam('page', String(page - 1))}
          >
            Previous
          </Button>
          <span className="text-sm text-[--color-secondary-text]">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => updateParam('page', String(page + 1))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm">Loading...</div>}>
      <OrdersContent />
    </Suspense>
  );
}
