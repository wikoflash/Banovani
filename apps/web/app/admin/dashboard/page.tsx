import Link from 'next/link';
import { ShoppingBag, Package, AlertTriangle } from 'lucide-react';
import { DashboardMetricCard } from '@/components/admin/dashboard-metric-card';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { createServiceClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils';
import { ROUTES, LOW_STOCK_THRESHOLD } from '@banovani/config';
import { Button } from '@/components/ui/button';
import type { OrderStatus } from '@banovani/types';

async function getDashboardData() {
  const supabase = createServiceClient();

  const [ordersRes, lowStockRes] = await Promise.all([
    supabase
      .from('orders')
      .select('id, total, status, created_at, customer_first_name, customer_last_name, order_number')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('product_variants')
      .select('id, size, color, stock, products(name, slug)')
      .eq('is_active', true)
      .lte('stock', LOW_STOCK_THRESHOLD)
      .order('stock', { ascending: true })
      .limit(5),
  ]);

  // Aggregate today's stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { data: todayOrders } = await supabase
    .from('orders')
    .select('total')
    .gte('created_at', today.toISOString());

  const { count: pendingCount } = await supabase
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending');

  const todayRevenue = todayOrders?.reduce((sum, o) => sum + (o.total ?? 0), 0) ?? 0;

  return {
    recentOrders: ordersRes.data ?? [],
    lowStockVariants: lowStockRes.data ?? [],
    todayRevenue,
    pendingCount: pendingCount ?? 0,
    todayOrdersCount: todayOrders?.length ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const { recentOrders, lowStockVariants, todayRevenue, pendingCount, todayOrdersCount } =
    await getDashboardData();

  return (
    <div className="max-w-6xl">
      <h1 className="mb-6 font-brand text-2xl text-[--color-deep-brown]">Dashboard</h1>

      {/* Metric cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <DashboardMetricCard
          label="Today's Revenue"
          value={formatPrice(todayRevenue)}
          sub="Today"
        />
        <DashboardMetricCard
          label="New Orders Today"
          value={todayOrdersCount}
          sub="Orders placed today"
        />
        <DashboardMetricCard
          label="Pending Orders"
          value={pendingCount}
          sub="Awaiting confirmation"
          trend={pendingCount > 0 ? 'up' : 'neutral'}
        />
        <DashboardMetricCard
          label="Low Stock Items"
          value={lowStockVariants.length}
          sub={`≤ ${LOW_STOCK_THRESHOLD} remaining`}
          trend={lowStockVariants.length > 0 ? 'down' : 'neutral'}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <section className="rounded-xl border border-[--color-border] bg-[--color-surface] p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-[--color-secondary-text]" />
              <h2 className="text-sm font-semibold">Recent Orders</h2>
            </div>
            <Button variant="link" size="sm" asChild>
              <Link href={ROUTES.admin.orders}>View all</Link>
            </Button>
          </div>
          <div className="flex flex-col gap-3">
            {recentOrders.length === 0 ? (
              <p className="text-sm text-[--color-secondary-text]">No orders yet.</p>
            ) : (
              recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={ROUTES.admin.orderDetail(order.id)}
                  className="flex items-center justify-between rounded-lg p-2 hover:bg-[--color-muted]"
                >
                  <div>
                    <p className="text-sm font-medium">#{order.order_number}</p>
                    <p className="text-xs text-[--color-secondary-text]">
                      {order.customer_first_name} {order.customer_last_name}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <AdminStatusBadge status={order.status as OrderStatus} />
                    <span className="text-xs font-medium">{formatPrice(order.total)}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* Low Stock */}
        <section className="rounded-xl border border-[--color-border] bg-[--color-surface] p-5">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <h2 className="text-sm font-semibold">Low Stock Alerts</h2>
          </div>
          <div className="flex flex-col gap-3">
            {lowStockVariants.length === 0 ? (
              <p className="text-sm text-[--color-secondary-text]">All items are well stocked.</p>
            ) : (
              lowStockVariants.map((v: any) => (
                <div key={v.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{v.products?.name}</p>
                    <p className="text-xs text-[--color-secondary-text]">
                      {[v.color, v.size].filter(Boolean).join(' / ')}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      v.stock === 0 ? 'text-[--color-error]' : 'text-amber-600'
                    }`}
                  >
                    {v.stock} left
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
