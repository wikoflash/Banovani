import { NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';

/** GET /api/admin/orders — list with filters */
export async function GET(request: Request) {
  try {
    const authClient = await createClient();
    const { data: { user }, error: authError } = await authClient.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = Math.max(1, Number(searchParams.get('page') ?? '1'));
    const limit = Math.min(100, Number(searchParams.get('limit') ?? '20'));
    const offset = (page - 1) * limit;

    const supabase = createServiceClient();
    let query = supabase
      .from('orders')
      .select('*, order_items(count)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) query = query.eq('status', status);
    if (search) {
      query = query.or(
        `customer_first_name.ilike.%${search}%,customer_last_name.ilike.%${search}%,customer_phone.ilike.%${search}%,order_number.ilike.%${search}%`
      );
    }

    const { data: orders, error, count } = await query;
    if (error) return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });

    return NextResponse.json({
      orders,
      pagination: { page, limit, total: count ?? 0, pages: Math.ceil((count ?? 0) / limit) },
    });
  } catch (err) {
    console.error('Admin orders error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
