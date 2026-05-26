'use client';

import { useState, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { productSchema, type ProductInput } from '@banovani/validation';
import { z } from 'zod';

// Extended schema for the admin product form — includes variants and images
const variantRowSchema = z.object({
  size: z.string().optional(),
  color: z.string().optional(),
  stock: z.number().int().min(0).default(0),
  price_override: z.number().positive().optional(),
});

const imageRowSchema = z.object({
  image_url: z.string().url(),
  is_primary: z.boolean().default(false),
  sort_order: z.number().default(0),
  alt_text: z.string().optional(),
});

const productFormSchema = productSchema.extend({
  variants: z.array(variantRowSchema).default([]),
  images: z.array(imageRowSchema).default([]),
});

type ProductFormInput = z.infer<typeof productFormSchema>;
import { STANDARD_SIZES } from '@banovani/config';

type Category = { id: string; name: string; slug: string };

type Props = {
  defaultValues?: Partial<ProductFormInput>;
  categories: Category[];
  onSubmit: (data: ProductFormInput) => Promise<void>;
  submitLabel?: string;
};

const COLORS = ['Black', 'White', 'Beige', 'Navy', 'Green', 'Red', 'Pink', 'Brown', 'Grey', 'Blue'];

export function AdminProductForm({ defaultValues, categories, onSubmit, submitLabel = 'Save' }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>(
    defaultValues?.images?.map((i: any) => i.image_url) ?? []
  );

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormInput>({
    resolver: zodResolver(productFormSchema) as any,
    defaultValues: {
      ...defaultValues,
      is_active: defaultValues?.is_active ?? true,
      is_featured: defaultValues?.is_featured ?? false,
      is_new: defaultValues?.is_new ?? true,
      is_sale: defaultValues?.is_sale ?? false,
      variants: defaultValues?.variants ?? [],
      images: defaultValues?.images ?? [],
    },
  });

  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control,
    name: 'variants',
  });

  function addVariantRow() {
    appendVariant({ size: '', color: '', stock: 0, price_override: undefined });
  }

  function addColorSizeMatrix() {
    const color = (document.getElementById('bulk-color') as HTMLInputElement)?.value;
    if (!color) return;
    STANDARD_SIZES.forEach((size) => {
      appendVariant({ size, color, stock: 0, price_override: undefined });
    });
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        if (res.ok) {
          const { url } = await res.json();
          uploaded.push(url);
        }
      }
      const newUrls = [...imageUrls, ...uploaded];
      setImageUrls(newUrls);
      setValue(
        'images',
        newUrls.map((url, i) => ({ image_url: url, is_primary: i === 0, sort_order: i, alt_text: '' }))
      );
    } finally {
      setUploading(false);
    }
  }

  function removeImage(index: number) {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls);
    setValue(
      'images',
      newUrls.map((url, i) => ({ image_url: url, is_primary: i === 0, sort_order: i, alt_text: '' }))
    );
  }

  async function handleFormSubmit(data: ProductFormInput) {
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(data);
    } catch (err: any) {
      setError(err.message ?? 'Failed to save product.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-6">
      {/* Basic Info */}
      <section className="rounded-xl border border-[--color-border] bg-[--color-surface] p-5">
        <h2 className="mb-4 text-sm font-semibold">Basic Information</h2>
        <div className="grid gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Product Name *</label>
            <Input {...register('name')} placeholder="Floral Summer Dress" />
            {errors.name && <p className="mt-1 text-xs text-[--color-error]">{errors.name.message}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Slug *</label>
            <Input {...register('slug')} placeholder="floral-summer-dress" />
            {errors.slug && <p className="mt-1 text-xs text-[--color-error]">{errors.slug.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Price (₾) *</label>
              <Input {...register('price', { valueAsNumber: true })} type="number" min="0" step="0.01" />
              {errors.price && <p className="mt-1 text-xs text-[--color-error]">{errors.price.message}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Sale Price (₾)</label>
              <Input {...register('sale_price', { valueAsNumber: true, setValueAs: v => v === '' || isNaN(v) ? undefined : v })} type="number" min="0" step="0.01" placeholder="Optional" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Category</label>
            <select
              {...register('category_id')}
              className="w-full rounded-md border border-[--color-border] bg-[--color-surface] px-3 py-2 text-sm focus:outline-none"
            >
              <option value="">No category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Short Description</label>
            <Textarea {...register('short_description')} rows={2} placeholder="Brief product description..." />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Full Description</label>
            <Textarea {...register('description')} rows={4} placeholder="Detailed product description..." />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Fabric Info</label>
            <Input {...register('fabric_info')} placeholder="e.g. 95% Cotton, 5% Elastane" />
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-wrap gap-4">
          {[
            { name: 'is_active', label: 'Published' },
            { name: 'is_new', label: 'New Arrival' },
            { name: 'is_featured', label: 'Featured' },
            { name: 'is_sale', label: 'On Sale' },
          ].map(({ name, label }) => (
            <label key={name} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                {...register(name as keyof ProductInput)}
                className="accent-[--color-deep-brown] h-4 w-4"
              />
              {label}
            </label>
          ))}
        </div>
      </section>

      {/* Images */}
      <section className="rounded-xl border border-[--color-border] bg-[--color-surface] p-5">
        <h2 className="mb-4 text-sm font-semibold">Images</h2>
        <div className="flex flex-wrap gap-3 mb-4">
          {imageUrls.map((url, i) => (
            <div key={url} className="relative">
              <div className="relative h-20 w-16 overflow-hidden rounded-lg border border-[--color-border]">
                <Image src={url} alt={`Product image ${i + 1}`} fill className="object-cover" />
                {i === 0 && (
                  <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-center text-[10px] text-white py-0.5">
                    Primary
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -right-1.5 -top-1.5 rounded-full bg-white p-0.5 shadow"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <label className="flex h-20 w-16 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[--color-border] text-[--color-secondary-text] hover:border-[--color-accent-beige]">
            <Upload className="h-5 w-5" />
            <span className="mt-1 text-[10px]">{uploading ? 'Uploading...' : 'Add'}</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </label>
        </div>
      </section>

      {/* Variants */}
      <section className="rounded-xl border border-[--color-border] bg-[--color-surface] p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Variants (Size × Color)</h2>
          <div className="flex items-center gap-2">
            <input
              id="bulk-color"
              placeholder="Color name"
              className="h-8 w-28 rounded-md border border-[--color-border] px-2 text-xs focus:outline-none"
            />
            <Button type="button" variant="outline" size="sm" onClick={addColorSizeMatrix}>
              + All Sizes
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={addVariantRow}>
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {variantFields.length === 0 ? (
          <p className="py-4 text-center text-sm text-[--color-secondary-text]">
            No variants yet. Add a color and click &quot;+ All Sizes&quot; to generate a full matrix.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[--color-border]">
                  <th className="pb-2 text-left font-medium text-xs text-[--color-secondary-text]">Color</th>
                  <th className="pb-2 text-left font-medium text-xs text-[--color-secondary-text]">Size</th>
                  <th className="pb-2 text-left font-medium text-xs text-[--color-secondary-text]">Stock</th>
                  <th className="pb-2 text-left font-medium text-xs text-[--color-secondary-text]">Override ₾</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {variantFields.map((field, i) => (
                  <tr key={field.id} className="border-b border-[--color-border] last:border-none">
                    <td className="py-1.5 pr-2">
                      <Input
                        {...register(`variants.${i}.color`)}
                        placeholder="Black"
                        className="h-8 text-xs"
                      />
                    </td>
                    <td className="py-1.5 pr-2">
                      <Input
                        {...register(`variants.${i}.size`)}
                        placeholder="S"
                        className="h-8 text-xs"
                      />
                    </td>
                    <td className="py-1.5 pr-2">
                      <Input
                        {...register(`variants.${i}.stock`, { valueAsNumber: true })}
                        type="number"
                        min="0"
                        className="h-8 w-20 text-xs"
                      />
                    </td>
                    <td className="py-1.5 pr-2">
                      <Input
                        {...register(`variants.${i}.price_override`, {
                          valueAsNumber: true,
                          setValueAs: v => v === '' || isNaN(v) ? undefined : v,
                        })}
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="-"
                        className="h-8 w-20 text-xs"
                      />
                    </td>
                    <td className="py-1.5">
                      <button
                        type="button"
                        onClick={() => removeVariant(i)}
                        className="text-[--color-secondary-text] hover:text-[--color-error]"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-[--color-error]">{error}</p>
      )}

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => history.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
