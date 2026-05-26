import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { productSchema } from '@banovani/validation';

// GET /api/admin/products/[id] — get single product with full details
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();

  const { data: product, error } = await supabase
    .from('products')
    .select('*, product_images(*), product_variants(*), categories(name,slug)')
    .eq('id', id)
    .single();

  if (error || !product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ product });
}

// PATCH /api/admin/products/[id] — update product
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const supabase = createServiceClient();

  const { variants, images, ...productData } = body;

  const { data: product, error } = await supabase
    .from('products')
    .update(productData)
    .eq('id', id)
    .select()
    .single();

  if (error || !product) return NextResponse.json({ error: error?.message ?? 'Update failed' }, { status: 500 });

  // Replace images if provided
  if (images !== undefined) {
    await supabase.from('product_images').delete().eq('product_id', id);
    if (images.length > 0) {
      await supabase.from('product_images').insert(images.map((img: any) => ({ ...img, product_id: id })));
    }
  }

  // Replace variants if provided
  if (variants !== undefined) {
    await supabase.from('product_variants').delete().eq('product_id', id);
    if (variants.length > 0) {
      await supabase.from('product_variants').insert(
        variants.map((v: any) => ({ ...v, product_id: id, is_active: true }))
      );
    }
  }

  return NextResponse.json({ product });
}

// DELETE /api/admin/products/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
