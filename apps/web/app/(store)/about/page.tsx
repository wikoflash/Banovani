import type { Metadata } from 'next';
import Link from 'next/link';
import { ROUTES } from '@banovani/config';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'About — Banovani',
  description: 'The story behind Banovani — elegant clothing for Georgian women.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-brand text-3xl text-[--color-deep-brown] sm:text-4xl">About Banovani</h1>

      <p className="mt-6 text-lg leading-relaxed text-[--color-secondary-text]">
        Banovani is a Georgian women&apos;s clothing brand dedicated to creating pieces that blend
        elegance, comfort, and everyday wearability.
      </p>

      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        <div className="rounded-xl bg-[--color-surface] border border-[--color-border] p-6">
          <h2 className="font-brand text-xl text-[--color-deep-brown]">Our Mission</h2>
          <p className="mt-3 text-sm leading-relaxed text-[--color-secondary-text]">
            We believe every woman deserves to feel confident and beautiful — whether she&apos;s heading
            to work, a dinner, or simply going about her day. Our collections are carefully curated
            to serve exactly that purpose.
          </p>
        </div>
        <div className="rounded-xl bg-[--color-surface] border border-[--color-border] p-6">
          <h2 className="font-brand text-xl text-[--color-deep-brown]">Our Style</h2>
          <p className="mt-3 text-sm leading-relaxed text-[--color-secondary-text]">
            Timeless silhouettes, quality fabrics, and thoughtful details define every Banovani
            piece. From flowing dresses to structured sets — each item is chosen with care and
            attention to both style and comfort.
          </p>
        </div>
      </div>

      <div className="mt-10 rounded-xl bg-gradient-to-r from-[#F5EFE8] to-[#EFE8DE] p-8 text-center">
        <h2 className="font-brand text-xl text-[--color-deep-brown]">
          ბანოვანი — ელეგანტურობა ყოველდღიურ ცხოვრებაში
        </h2>
        <p className="mt-3 text-sm text-[--color-secondary-text]">
          Banovani (ბანოვანი) — a Georgian word meaning &quot;noblewoman&quot; — reflects our core belief
          that every woman carries inherent grace and dignity.
        </p>
      </div>

      <div className="mt-12 flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-center">
        <Button asChild>
          <Link href={ROUTES.shop}>Shop Collection</Link>
        </Button>
        <Button variant="outline" asChild>
          <a
            href={process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
          >
            Follow on Instagram
          </a>
        </Button>
      </div>
    </div>
  );
}
