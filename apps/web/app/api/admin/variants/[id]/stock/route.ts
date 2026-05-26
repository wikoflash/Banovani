import { NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { stockUpdateSchema } from '@banovani/validation';

type Params = { params: Promise<{ id: string }> };

/** PATCH /api/admin/variants/[id]/stock — update stock */
export async function PATCH(request: Request, { params }: Params) {
  try {
    const authClient = await createClient();
    const { data: { user }, error: authError } = await authClient.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body: unknown = await request.json();

    const parsed = stockUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();
    const { data: variant, error } = await supabase
      .from('product_variants')
      .update({ stock: parsed.data.stock })
      .eq('id', id)
      .select()
      .single();

    if (error || !variant) {
      return NextResponse.json({ error: 'Failed to update stock' }, { status: 500 });
    }

    return NextResponse.json({ variant });
  } catch (err) {
    console.error('Stock update error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
