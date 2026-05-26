import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Returns & Exchanges — Banovani',
};

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-brand text-3xl text-[--color-deep-brown]">Returns & Exchanges</h1>

      <div className="mt-8 flex flex-col gap-6 text-sm text-[--color-secondary-text] leading-relaxed">
        <section className="rounded-xl border border-[--color-border] bg-[--color-surface] p-6">
          <h2 className="mb-3 text-base font-semibold text-[--color-primary-text]">Exchange Policy</h2>
          <p>
            We accept exchanges within 14 days of receiving your order. Items must be unworn,
            unwashed, and in original condition with all tags attached.
          </p>
          <p className="mt-3">
            To initiate an exchange, please contact us via Instagram or WhatsApp with your order
            number and the item you would like to exchange.
          </p>
        </section>

        <section className="rounded-xl border border-[--color-border] bg-[--color-surface] p-6">
          <h2 className="mb-3 text-base font-semibold text-[--color-primary-text]">Non-Returnable Items</h2>
          <ul className="list-disc pl-4 flex flex-col gap-1">
            <li>Sale or discounted items</li>
            <li>Items that have been worn, washed, or altered</li>
            <li>Items without original tags</li>
          </ul>
        </section>

        <section className="rounded-xl border border-[--color-border] bg-[--color-surface] p-6">
          <h2 className="mb-3 text-base font-semibold text-[--color-primary-text]">Defective Items</h2>
          <p>
            If you receive a defective or incorrect item, please contact us within 48 hours of
            receiving your order. We will arrange a replacement or full refund at no additional
            cost to you.
          </p>
        </section>

        <section className="rounded-xl bg-[--color-muted] p-6">
          <h2 className="mb-2 text-base font-semibold text-[--color-primary-text]">Contact Us</h2>
          <p>
            For any return or exchange inquiries, reach us via Instagram DM or WhatsApp. We
            respond within 24 hours.
          </p>
        </section>
      </div>
    </div>
  );
}
