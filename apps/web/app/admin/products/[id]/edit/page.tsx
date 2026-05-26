'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AdminProductForm } from '@/components/admin/admin-product-form';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@banovani/config';
import type { ProductInput } from '@banovani/validation';
import type { Category } from '@banovani/types';

export default function AdminEditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [categories, setCategories] = useState<Array<{ id: string; name: string; slug: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/products/${id}`).then((r) => r.json()),
      fetch('/api/categories').then((r) => r.json()),
    ])
      .then(([productData, catData]) => {
        setProduct(productData.product);
        setCategories(catData.categories ?? []);
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(data: ProductInput) {
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? 'Failed to update product');
    }
    router.push(ROUTES.admin.products);
  }

  if (loading) {
    return (
      <div className="max-w-3xl">
        <Skeleton className="mb-6 h-8 w-48" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-20 text-[--color-secondary-text]">Product not found.</div>;
  }

  // Map product DB shape to form shape
  const defaultValues = {
    name: product.name,
    slug: product.slug,
    price: product.price,
    sale_price: product.sale_price ?? undefined,
    category_id: product.category_id ?? undefined,
    short_description: product.short_description ?? undefined,
    description: product.description ?? undefined,
    fabric_info: product.fabric_info ?? undefined,
    is_active: product.is_active,
    is_new: product.is_new,
    is_featured: product.is_featured,
    is_sale: product.is_sale,
    images: product.product_images?.map((img: any, i: number) => ({
      image_url: img.image_url,
      is_primary: img.is_primary,
      sort_order: img.sort_order ?? i,
      alt_text: img.alt_text ?? '',
    })) ?? [],
    variants: product.product_variants?.map((v: any) => ({
      size: v.size ?? '',
      color: v.color ?? '',
      stock: v.stock,
      price_override: v.price_override ?? undefined,
    })) ?? [],
  };

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 font-brand text-2xl text-[--color-deep-brown]">Edit Product</h1>
      <AdminProductForm
        categories={categories}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
      />
    </div>
  );
}
