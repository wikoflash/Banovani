import type { OrderStatus, PaymentStatus } from '@banovani/types';

const ORDER_STATUS_BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  new: { bg: '#DBEAFE', text: '#1D4ED8' },
  confirmed: { bg: '#EDE9FE', text: '#6D28D9' },
  processing: { bg: '#FEF3C7', text: '#92400E' },
  shipped: { bg: '#CFFAFE', text: '#0E7490' },
  completed: { bg: '#D1FAE5', text: '#065F46' },
  cancelled: { bg: '#FEE2E2', text: '#991B1B' },
  returned: { bg: '#F3F4F6', text: '#374151' },
};

const ORDER_STATUS_DISPLAY: Record<string, string> = {
  new: 'New',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  completed: 'Completed',
  cancelled: 'Cancelled',
  returned: 'Returned',
};

export function AdminStatusBadge({ status }: { status: OrderStatus }) {
  const label = ORDER_STATUS_DISPLAY[status] ?? status;
  const color = ORDER_STATUS_BADGE_COLORS[status] ?? { bg: '#f3f4f6', text: '#374151' };
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ backgroundColor: color.bg, color: color.text }}
    >
      {label}
    </span>
  );
}

export function AdminPaymentBadge({ status }: { status: PaymentStatus }) {
  const labels: Record<string, string> = {
    pending: 'Pending',
    paid: 'Paid',
    failed: 'Failed',
    refunded: 'Refunded',
    manual_transfer_pending: 'Transfer Pending',
  };
  const label = labels[status] ?? status;
  const colors: Record<string, { bg: string; text: string }> = {
    pending: { bg: '#FEF3C7', text: '#92400E' },
    paid: { bg: '#D1FAE5', text: '#065F46' },
    failed: { bg: '#FEE2E2', text: '#991B1B' },
    refunded: { bg: '#E0E7FF', text: '#3730A3' },
  };
  const color = colors[status] ?? { bg: '#f3f4f6', text: '#374151' };
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ backgroundColor: color.bg, color: color.text }}
    >
      {label}
    </span>
  );
}
