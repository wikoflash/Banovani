import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createServiceClient();
  const { data, error } = await supabase.from('settings').select('key, value').order('key');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ settings: data });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const settingsMap: Record<string, string> = body.settings ?? {};
  const supabase = createServiceClient();

  const upserts = Object.entries(settingsMap).map(([key, value]) => ({ key, value }));
  const { error } = await supabase
    .from('settings')
    .upsert(upserts, { onConflict: 'key' });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
