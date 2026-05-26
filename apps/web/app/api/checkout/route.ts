import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { checkoutSchema } from '@banovani/validation';
import { ORDER_NUMBER_PREFIX } from '@banovani/config';
import type { ProductVariant } from '@banovani/types';

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    // 1. Validate request shape
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const supabase = createServiceClient();

    // 2. Fetch variants from DB — never trust client-side prices
    const variantIds = data.items.map((i) => i.variantId);
    const { data: variants, error: variantsError } = await supabase
      .from('product_variants')
      .select('id, product_id, stock, price_override, is_active, color, size, products(name, price, sale_price, is_active, product_images(image_url, is_primary))')
      .in('id', variantIds);

    if (variantsError) {
      console.error('Variant fetch error:', variantsError);
      return NextResponse.json({ error: 'Failed to validate cart' }, { status: 500 });
    }

    // 3. Validate each item: stock, activity
    const variantMap = new Map<string, (typeof variants)[number]>();
    for (const v of variants ?? []) {
      variantMap.set(v.id, v);
    }

    for (const item of data.items) {
      const variant = variantMap.get(item.variantId);
      if (!variant) {
        return NextResponse.json(
          { error: `Product variant not found: ${item.variantId}` },
          { status: 400 }
        );
      }
      if (!variant.is_active) {
        return NextResponse.json(
          { error: `Variant is no longer available: ${item.variantId}` },
          { status: 400 }
        );
      }
      if (variant.stock < item.quantity) {
        return NextResponse.json(
          {
            error: 'Insufficient stock',
            variantId: item.variantId,
            available: variant.stock,
            requested: item.quantity,
          },
          { status: 409 }
        );
      }
    }

    // 4. Calculate totals server-side
    let subtotal = 0;
    const orderItemsPayload: Array<{
      product_id: string;
      variant_id: string;
      product_name: string;
      product_image: string | null;
      color: string | null;
      size: string | null;
      quantity: number;
      unit_price: number;
      total_price: number;
    }> = [];

    for (const item of data.items) {
      const variant = variantMap.get(item.variantId)!;
      const product = variant.products as unknown as {
        name: string;
        price: number;
        sale_price: number | null;
        is_active: boolean;
        product_images: Array<{ image_url: string; is_primary: boolean }>;
      };

      if (!product.is_active) {
        return NextResponse.json(
          { error: `Product is no longer available` },
          { status: 400 }
        );
      }

      const unitPrice = variant.price_override ?? product.sale_price ?? product.price;
      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;

      const primaryImage =
        product.product_images?.find((img) => img.is_primary)?.image_url ??
        product.product_images?.[0]?.image_url ??
        null;

      orderItemsPayload.push({
        product_id: variant.product_id,
        variant_id: item.variantId,
        product_name: product.name,
        product_image: primaryImage,
        color: variant.color,
        size: variant.size,
        quantity: item.quantity,
        unit_price: unitPrice,
        total_price: totalPrice,
      });
    }

    // 5. Get delivery fee from settings
    const deliveryFeeKey =
      data.deliveryMethod === 'tbilisi'
        ? 'delivery_fee_tbilisi'
        : data.deliveryMethod === 'regional'
          ? 'delivery_fee_regional'
          : null;

    let deliveryFee = 0;
    if (deliveryFeeKey) {
      const { data: setting } = await supabase
        .from('settings')
        .select('value')
        .eq('key', deliveryFeeKey)
        .single();
      deliveryFee = setting ? Number(setting.value) : 0;

      // Free delivery threshold check
      const { data: threshold } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'free_delivery_threshold')
        .single();
      if (threshold && subtotal >= Number(threshold.value)) {
        deliveryFee = 0;
      }
    }

    const total = subtotal + deliveryFee;

    // 6. Generate order number
    const { data: orderNumberResult } = await supabase.rpc('generate_order_number');
    const orderNumber = orderNumberResult ?? `${ORDER_NUMBER_PREFIX}-${Date.now()}`;

    // 7. Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_first_name: data.firstName,
        customer_last_name: data.lastName ?? null,
        customer_phone: data.phone,
        customer_email: data.email ?? null,
        city: data.city,
        address: data.address,
        comment: data.comment ?? null,
        delivery_method: data.deliveryMethod,
        payment_method: data.paymentMethod,
        subtotal,
        delivery_fee: deliveryFee,
        discount_total: 0,
        total,
        status: 'new',
        payment_status: 'pending',
        delivery_status: 'not_started',
      })
      .select('id, order_number')
      .single();

    if (orderError || !order) {
      console.error('Order creation error:', orderError);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    // 8. Create order items
    const { error: itemsError } = await supabase.from('order_items').insert(
      orderItemsPayload.map((item) => ({ ...item, order_id: order.id }))
    );

    if (itemsError) {
      console.error('Order items error:', itemsError);
      // Rollback order
      await supabase.from('orders').delete().eq('id', order.id);
      return NextResponse.json({ error: 'Failed to create order items' }, { status: 500 });
    }

    // 9. Decrement stock for each variant
    for (const item of data.items) {
      const variant = variantMap.get(item.variantId)!;
      const { error: stockError } = await supabase
        .from('product_variants')
        .update({ stock: variant.stock - item.quantity })
        .eq('id', item.variantId);

      if (stockError) {
        console.error('Stock update error for variant', item.variantId, stockError);
        // Don't rollback — order is created, log the error for manual fix
      }
    }

    return NextResponse.json(
      { orderId: order.id, orderNumber: order.order_number },
      { status: 201 }
    );
  } catch (err) {
    console.error('Checkout error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
