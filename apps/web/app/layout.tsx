import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: "Banovani — Elegant Women's Fashion",
    template: '%s | Banovani',
  },
  description:
    "Elegant clothing for everyday beauty and special moments. Shop women's dresses, tops, sets, and accessories.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://banovani.ge'),
  openGraph: {
    type: 'website',
    locale: 'ka_GE',
    alternateLocale: 'en_US',
    siteName: 'Banovani',
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ka">
      <body className="antialiased">{children}</body>
    </html>
  );
}
