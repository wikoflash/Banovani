import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    // Verify the user is an authenticated admin
    const supabaseAuth = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabaseAuth.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, WebP, AVIF' },
        { status: 400 }
      );
    }

    // Validate file size — max 10 MB
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum size is 10MB' }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Generate a unique file path
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
    const filePath = `products/${fileName}`;

    const bytes = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, bytes, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('product-images').getPublicUrl(filePath);

    return NextResponse.json({ url: publicUrl, path: filePath }, { status: 201 });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
