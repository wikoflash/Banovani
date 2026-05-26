import * as React from 'react';
import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[80px] w-full rounded-md border border-[--color-border] bg-[--color-surface] px-3 py-2 text-sm',
        'placeholder:text-[--color-secondary-text]',
        'focus:outline-none focus:ring-2 focus:ring-[--color-accent-beige] focus:ring-offset-1',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'resize-y',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export { Textarea };
