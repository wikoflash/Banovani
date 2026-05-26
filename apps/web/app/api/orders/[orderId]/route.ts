import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const supabase = createServiceClient();

    const { data: order, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Return minimal public-safe fields only (no admin_note, no internal status history)
    return NextResponse.json({
      order: {
        id: order.id,
        order_number: order.order_number,
        customer_first_name: order.customer_first_name,
        customer_last_name: order.customer_last_name,
        customer_phone: order.customer_phone,
        customer_email: order.customer_email,
        city: order.city,
        address: order.address,
        status: order.status,
        payment_method: order.payment_method,
        delivery_method: order.delivery_method,
        subtotal: order.subtotal,
        delivery_fee: order.delivery_fee,
        total: order.total,
        comment: order.comment,
        created_at: order.created_at,
        order_items: order.order_items,
      },
    });
  } catch (err) {
    console.error('Order lookup error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
