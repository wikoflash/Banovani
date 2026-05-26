import { NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { orderStatusSchema } from '@banovani/validation';

type Params = { params: Promise<{ id: string }> };

/** GET /api/admin/orders/[id] — order detail */
export async function GET(_request: Request, { params }: Params) {
  try {
    const authClient = await createClient();
    const { data: { user }, error: authError } = await authClient.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const supabase = createServiceClient();

    const { data: order, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', id)
      .single();

    if (error || !order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    return NextResponse.json({ order });
  } catch (err) {
    console.error('Admin order detail error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/** PATCH /api/admin/orders/[id] — update status, payment, delivery, note */
export async function PATCH(request: Request, { params }: Params) {
  try {
    const authClient = await createClient();
    const { data: { user }, error: authError } = await authClient.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body: unknown = await request.json();

    const parsed = orderStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Remove undefined fields so we don't overwrite with null unintentionally
    const updatePayload = Object.fromEntries(
      Object.entries(parsed.data).filter(([, v]) => v !== undefined)
    );

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data: order, error } = await supabase
      .from('orders')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error || !order) {
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }

    return NextResponse.json({ order });
  } catch (err) {
    console.error('Admin order update error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
