import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: product, error } = await supabase
      .from('products')
      .select(
        `
        *,
        categories(id, name, slug),
        product_images(id, image_url, alt_text, sort_order, is_primary),
        product_variants(id, sku, color, size, stock, price_override, is_active)
        `
      )
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error || !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Sort images and variants
    product.product_images?.sort(
      (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order
    );
    product.product_variants?.sort((a: { size: string }, b: { size: string }) =>
      a.size?.localeCompare(b.size ?? '') ?? 0
    );

    return NextResponse.json({ product });
  } catch (err) {
    console.error('Product detail error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
