import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact — Banovani',
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-brand text-3xl text-[--color-deep-brown]">Contact Us</h1>
      <p className="mt-4 text-sm text-[--color-secondary-text] leading-relaxed">
        We&apos;d love to hear from you. Reach out via any of the channels below — we typically
        respond within a few hours during business hours.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        <a
          href={process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 rounded-xl border border-[--color-border] bg-[--color-surface] p-5 transition-shadow hover:shadow-md"
        >
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
            <span className="text-lg text-white">📸</span>
          </div>
          <div>
            <p className="font-medium">Instagram</p>
            <p className="text-sm text-[--color-secondary-text]">DM us — fastest response</p>
          </div>
        </a>

        <a
          href={process.env.NEXT_PUBLIC_WHATSAPP_URL ?? '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 rounded-xl border border-[--color-border] bg-[--color-surface] p-5 transition-shadow hover:shadow-md"
        >
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-500">
            <span className="text-lg text-white">💬</span>
          </div>
          <div>
            <p className="font-medium">WhatsApp</p>
            <p className="text-sm text-[--color-secondary-text]">Message or call</p>
          </div>
        </a>

        <div className="flex items-center gap-4 rounded-xl border border-[--color-border] bg-[--color-surface] p-5">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
            <span className="text-lg">📧</span>
          </div>
          <div>
            <p className="font-medium">Email</p>
            <p className="text-sm text-[--color-secondary-text]">
              {process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? 'Contact via Instagram or WhatsApp'}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-xl bg-[--color-muted] p-5 text-sm text-[--color-secondary-text]">
        <strong className="text-[--color-primary-text]">Business Hours:</strong> Monday – Saturday,
        10:00 – 20:00 (Tbilisi time)
      </div>
    </div>
  );
}
