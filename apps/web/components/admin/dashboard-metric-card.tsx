import { TrendingUp, TrendingDown } from 'lucide-react';

type MetricCardProps = {
  label: string;
  value: string | number;
  sub?: string;
  trend?: 'up' | 'down' | 'neutral';
};

export function DashboardMetricCard({ label, value, sub, trend }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-[--color-border] bg-[--color-surface] p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-[--color-secondary-text]">
        {label}
      </p>
      <div className="mt-2 flex items-end justify-between">
        <p className="text-2xl font-bold text-[--color-primary-text]">{value}</p>
        {trend && trend !== 'neutral' && (
          <div
            className={`flex items-center gap-1 text-xs ${
              trend === 'up' ? 'text-[--color-success]' : 'text-[--color-error]'
            }`}
          >
            {trend === 'up' ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
          </div>
        )}
      </div>
      {sub && <p className="mt-1 text-xs text-[--color-secondary-text]">{sub}</p>}
    </div>
  );
}
