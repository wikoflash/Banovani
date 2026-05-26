import Link from 'next/link';
import { Instagram } from 'lucide-react';
import { ROUTES } from '@banovani/config';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[--color-border] bg-[--color-surface]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link
              href={ROUTES.home}
              className="font-brand text-xl font-semibold text-[--color-deep-brown]"
            >
              Banovani
            </Link>
            <p className="mt-3 text-sm text-[--color-secondary-text]">
              Elegant clothing for everyday beauty and special moments.
            </p>
            <a
              href={process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-sm text-[--color-secondary-text] hover:text-[--color-primary-text]"
            >
              <Instagram className="h-4 w-4" />
              @banovani
            </a>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold text-[--color-primary-text]">Shop</h3>
            <ul className="mt-4 space-y-2">
              {[
                { label: 'All Products', href: ROUTES.shop },
                { label: 'New Arrivals', href: `${ROUTES.shop}?filter=new` },
                { label: 'Sale', href: `${ROUTES.shop}?filter=sale` },
                { label: 'Dresses', href: ROUTES.category('dresses') },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-[--color-secondary-text] hover:text-[--color-primary-text]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-sm font-semibold text-[--color-primary-text]">Info</h3>
            <ul className="mt-4 space-y-2">
              {[
                { label: 'About', href: ROUTES.about },
                { label: 'Delivery', href: ROUTES.delivery },
                { label: 'Returns', href: ROUTES.returns },
                { label: 'Contact', href: ROUTES.contact },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-[--color-secondary-text] hover:text-[--color-primary-text]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-[--color-primary-text]">Contact</h3>
            <ul className="mt-4 space-y-2 text-sm text-[--color-secondary-text]">
              <li>
                <a
                  href={process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[--color-primary-text]"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={process.env.NEXT_PUBLIC_WHATSAPP_URL ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[--color-primary-text]"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[--color-border] pt-6 text-center text-xs text-[--color-secondary-text]">
          © {year} Banovani. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
