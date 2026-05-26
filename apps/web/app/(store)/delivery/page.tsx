import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Delivery — Banovani',
  description: 'Banovani delivery information — Tbilisi, regional Georgia, and pickup.',
};

export default function DeliveryPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-brand text-3xl text-[--color-deep-brown]">Delivery</h1>

      <div className="mt-8 flex flex-col gap-6">
        <section className="rounded-xl border border-[--color-border] bg-[--color-surface] p-6">
          <h2 className="text-base font-semibold">Tbilisi Delivery</h2>
          <p className="mt-2 text-sm text-[--color-secondary-text]">
            1–2 business days · ₾5
          </p>
          <p className="mt-3 text-sm text-[--color-secondary-text] leading-relaxed">
            We deliver to all districts of Tbilisi. Our courier will contact you before delivery to
            confirm the time and address.
          </p>
        </section>

        <section className="rounded-xl border border-[--color-border] bg-[--color-surface] p-6">
          <h2 className="text-base font-semibold">Regional Delivery</h2>
          <p className="mt-2 text-sm text-[--color-secondary-text]">
            2–4 business days · ₾10
          </p>
          <p className="mt-3 text-sm text-[--color-secondary-text] leading-relaxed">
            We ship to all regions of Georgia via courier service. You will receive a tracking
            number once your order is dispatched.
          </p>
        </section>

        <section className="rounded-xl border border-[--color-border] bg-[--color-surface] p-6">
          <h2 className="text-base font-semibold">Pickup</h2>
          <p className="mt-2 text-sm text-[--color-secondary-text]">Free</p>
          <p className="mt-3 text-sm text-[--color-secondary-text] leading-relaxed">
            Contact us via Instagram or WhatsApp to arrange a pickup. We will provide you with the
            address and available times.
          </p>
        </section>

        <section className="rounded-xl bg-[--color-muted] p-6">
          <h2 className="text-base font-semibold">Free Delivery</h2>
          <p className="mt-2 text-sm text-[--color-secondary-text] leading-relaxed">
            Enjoy free delivery on all orders over ₾150 — no code needed.
          </p>
        </section>
      </div>
    </div>
  );
}
