import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, Number(searchParams.get('page') ?? '1'));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') ?? '24')));
    const offset = (page - 1) * limit;

    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sizes = searchParams.get('sizes')?.split(',').filter(Boolean) ?? [];
    const colors = searchParams.get('colors')?.split(',').filter(Boolean) ?? [];
    const sort = searchParams.get('sort') ?? 'newest';
    const onlyNew = searchParams.get('new') === 'true';
    const onlySale = searchParams.get('sale') === 'true';

    const supabase = await createClient();

    let query = supabase
      .from('products')
      .select(
        `
        id, name, slug, price, sale_price, is_new, is_sale, is_featured,
        product_images!inner(image_url, is_primary, sort_order),
        product_variants(size, color, stock, is_active),
        categories(slug, name)
        `,
        { count: 'exact' }
      )
      .eq('is_active', true);

    if (category) {
      query = query.eq('categories.slug', category);
    }
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }
    if (onlyNew) query = query.eq('is_new', true);
    if (onlySale) query = query.eq('is_sale', true);

    // Sort
    switch (sort) {
      case 'price_asc':
        query = query.order('price', { ascending: true });
        break;
      case 'price_desc':
        query = query.order('price', { ascending: false });
        break;
      case 'popular':
        query = query.order('sort_order', { ascending: false });
        break;
      case 'sale':
        query = query.eq('is_sale', true).order('created_at', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    query = query.range(offset, offset + limit - 1);

    const { data: products, error, count } = await query;

    if (error) {
      console.error('Products fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }

    // Filter by size/color client-side (Supabase doesn't support nested array filters easily)
    let filtered = products ?? [];
    if (sizes.length > 0) {
      filtered = filtered.filter((p) =>
        p.product_variants?.some(
          (v: { size: string | null; is_active: boolean; stock: number }) =>
            v.is_active && v.stock > 0 && sizes.includes(v.size ?? '')
        )
      );
    }
    if (colors.length > 0) {
      filtered = filtered.filter((p) =>
        p.product_variants?.some(
          (v: { color: string | null; is_active: boolean; stock: number }) =>
            v.is_active && v.stock > 0 && colors.includes(v.color ?? '')
        )
      );
    }

    return NextResponse.json({
      products: filtered,
      pagination: { page, limit, total: count ?? 0, pages: Math.ceil((count ?? 0) / limit) },
    });
  } catch (err) {
    console.error('Products error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
