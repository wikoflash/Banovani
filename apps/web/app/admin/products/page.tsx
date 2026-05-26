'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Eye, EyeOff, Pencil, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/lib/utils';
import { ROUTES } from '@banovani/config';

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  is_active: boolean;
  is_featured: boolean;
  is_new: boolean;
  is_sale: boolean;
  created_at: string;
  product_images: Array<{ image_url: string; is_primary: boolean }>;
  product_variants: Array<{ stock: number; is_active: boolean }>;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products?limit=50&includeInactive=true', {
      headers: { 'x-admin': '1' },
    })
      .then((r) => r.json())
      .then((d) => setProducts(d.products ?? []))
      .finally(() => setLoading(false));
  }, []);

  async function toggleActive(productId: string, currentlyActive: boolean) {
    const res = await fetch(`/api/admin/products/${productId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !currentlyActive }),
    });
    if (res.ok) {
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, is_active: !currentlyActive } : p))
      );
    }
  }

  return (
    <div className="max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-brand text-2xl text-[--color-deep-brown]">Products</h1>
        <Button asChild>
          <Link href={ROUTES.admin.productNew}>
            <Plus className="mr-1.5 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-[--color-border] bg-[--color-surface] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[--color-border] bg-[--color-muted]">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-[--color-secondary-text] w-10"></th>
                  <th className="px-4 py-3 text-left font-medium text-[--color-secondary-text]">Product</th>
                  <th className="px-4 py-3 text-left font-medium text-[--color-secondary-text]">Price</th>
                  <th className="px-4 py-3 text-left font-medium text-[--color-secondary-text]">Stock</th>
                  <th className="px-4 py-3 text-left font-medium text-[--color-secondary-text]">Labels</th>
                  <th className="px-4 py-3 text-left font-medium text-[--color-secondary-text]">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-[--color-secondary-text]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const img = product.product_images?.find((i) => i.is_primary)?.image_url ?? product.product_images?.[0]?.image_url;
                  const totalStock = product.product_variants?.filter((v) => v.is_active).reduce((s, v) => s + v.stock, 0) ?? 0;

                  return (
                    <tr key={product.id} className="border-b border-[--color-border] last:border-none hover:bg-[--color-muted]">
                      <td className="px-4 py-3">
                        <div className="relative h-10 w-8 flex-shrink-0 overflow-hidden rounded bg-[--color-muted]">
                          {img ? (
                            <Image src={img} alt={product.name} fill className="object-cover" />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <Sparkles className="h-3 w-3 text-[--color-secondary-text]" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-[--color-secondary-text]">{product.slug}</p>
                      </td>
                      <td className="px-4 py-3">{formatPrice(product.price)}</td>
                      <td className="px-4 py-3">
                        <span className={totalStock === 0 ? 'text-[--color-error]' : totalStock <= 5 ? 'text-amber-600' : 'text-[--color-success]'}>
                          {totalStock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {product.is_new && <Badge variant="new" className="text-[10px]">New</Badge>}
                          {product.is_sale && <Badge variant="sale" className="text-[10px]">Sale</Badge>}
                          {product.is_featured && <Badge variant="bestseller" className="text-[10px]">Featured</Badge>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleActive(product.id, product.is_active)}
                          className={`text-sm ${product.is_active ? 'text-[--color-success]' : 'text-[--color-secondary-text]'}`}
                          title={product.is_active ? 'Published' : 'Hidden'}
                        >
                          {product.is_active ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={ROUTES.admin.productEdit(product.id)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
