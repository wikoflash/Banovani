'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@banovani/config';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError('Invalid email or password.');
      setLoading(false);
      return;
    }

    router.push(ROUTES.admin.dashboard);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[--color-background] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-[--color-border] bg-[--color-surface] p-8 shadow-sm">
        <h1 className="font-brand text-2xl text-[--color-deep-brown]">Banovani Admin</h1>
        <p className="mt-1 text-sm text-[--color-secondary-text]">Sign in to manage your store</p>

        <form onSubmit={handleLogin} className="mt-8 flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-[--color-error]">{error}</p>
          )}

          <Button type="submit" size="lg" className="mt-2 w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
}
