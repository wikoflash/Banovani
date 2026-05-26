'use client';

import Link from 'next/link';
import { ShoppingBag, Search, Menu, X, Instagram } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '@/lib/cart/store';
import { ROUTES } from '@banovani/config';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'Shop', href: ROUTES.shop },
  { label: 'New Arrivals', href: `${ROUTES.shop}?filter=new` },
  { label: 'Sale', href: `${ROUTES.shop}?filter=sale` },
  { label: 'About', href: ROUTES.about },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const totalItems = useCartStore((s) => s.getTotalItems());

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[--color-border] bg-[--color-background]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href={ROUTES.home}
            className="font-brand text-xl font-semibold tracking-wide text-[--color-deep-brown]"
          >
            Banovani
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[--color-secondary-text] transition-colors hover:text-[--color-primary-text]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Search" asChild>
              <Link href={`${ROUTES.shop}?search=`}>
                <Search className="h-5 w-5" />
              </Link>
            </Button>

            <Button variant="ghost" size="icon" aria-label="Cart" className="relative" asChild>
              <Link href={ROUTES.cart}>
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[--color-deep-brown] text-[10px] font-medium text-white">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 flex flex-col bg-[--color-background] pt-16 md:hidden">
          <nav className="flex flex-col px-6 py-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="border-b border-[--color-border] py-4 text-lg text-[--color-primary-text]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="px-6">
            <a
              href={process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[--color-secondary-text]"
            >
              <Instagram className="h-4 w-4" />
              Follow on Instagram
            </a>
          </div>
        </div>
      )}
    </>
  );
}
