import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { productSchema } from '@banovani/validation';
import { z } from 'zod';

// Extended schema: productSchema + variants + images
const adminProductSchema = productSchema.extend({
  variants: z.array(z.object({
    size: z.string().optional(),
    color: z.string().optional(),
    stock: z.number().int().min(0).default(0),
    price_override: z.number().positive().optional(),
  })).optional().default([]),
  images: z.array(z.object({
    image_url: z.string().url(),
    is_primary: z.boolean().default(false),
    sort_order: z.number().default(0),
    alt_text: z.string().optional(),
  })).optional().default([]),
});

// GET /api/admin/products — list all products for admin (including inactive)
export async function GET(req: NextRequest) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*), product_variants(*), categories(name,slug)')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data });
}

// POST /api/admin/products — create a new product
export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = adminProductSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { variants, images, ...productData } = parsed.data;

  const { data: product, error } = await supabase
    .from('products')
    .insert(productData)
    .select()
    .single();

  if (error || !product) return NextResponse.json({ error: error?.message ?? 'Insert failed' }, { status: 500 });

  if (images?.length) {
    await supabase.from('product_images').insert(
      images.map((img) => ({ ...img, product_id: product.id }))
    );
  }

  if (variants?.length) {
    await supabase.from('product_variants').insert(
      variants.map((v) => ({ ...v, product_id: product.id, is_active: true }))
    );
  }

  return NextResponse.json({ product }, { status: 201 });
}
