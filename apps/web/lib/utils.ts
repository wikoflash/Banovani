import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind class names safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format price in Georgian Lari */
export function formatPrice(amount: number, currency = 'GEL'): string {
  if (currency === 'GEL') {
    return `${amount.toFixed(2)} ₾`;
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

/** Generate a URL-safe slug from a string */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/** Truncate text to a maximum length */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/** Return "Only X left" or null based on stock */
export function stockLabel(stock: number, threshold = 3): string | null {
  if (stock === 0) return null;
  if (stock <= threshold) return `Only ${stock} left`;
  return null;
}

/** Build Supabase Storage public URL */
export function storageUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/object/public/product-images/${path}`;
}

/** Format a date string nicely */
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
}
