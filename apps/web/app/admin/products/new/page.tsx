'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminProductForm } from '@/components/admin/admin-product-form';
import { slugify } from '@/lib/utils';
import { ROUTES } from '@banovani/config';
import type { ProductInput } from '@banovani/validation';

export default function AdminNewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Array<{ id: string; name: string; slug: string }>>([]);

  useEffect(() => {
    fetch('/api/categories').then((r) => r.json()).then((d) => setCategories(d.categories ?? []));
  }, []);

  async function handleSubmit(data: ProductInput) {
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? 'Failed to create product');
    }
    const { product } = await res.json();
    router.push(ROUTES.admin.productEdit(product.id));
  }

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 font-brand text-2xl text-[--color-deep-brown]">New Product</h1>
      <AdminProductForm
        categories={categories}
        onSubmit={handleSubmit}
        submitLabel="Create Product"
      />
    </div>
  );
}
