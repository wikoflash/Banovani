import * as React from 'react';
import { cn } from '@/lib/utils';

const Badge = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & {
    variant?: 'default' | 'new' | 'sale' | 'bestseller' | 'limited' | 'lowstock' | 'outline';
  }
>(({ className, variant = 'default', ...props }, ref) => {
  const variantClasses = {
    default: 'bg-[--color-muted] text-[--color-primary-text]',
    new: 'bg-blue-100 text-blue-800',
    sale: 'bg-red-100 text-[--color-error]',
    bestseller: 'bg-amber-100 text-amber-800',
    limited: 'bg-purple-100 text-purple-800',
    lowstock: 'bg-orange-100 text-orange-800',
    outline: 'border border-[--color-border] bg-transparent text-[--color-secondary-text]',
  };
  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
});
Badge.displayName = 'Badge';

export { Badge };
