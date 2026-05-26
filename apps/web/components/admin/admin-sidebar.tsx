'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Tag,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { ROUTES } from '@banovani/config';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const NAV = [
  { href: ROUTES.admin.dashboard, label: 'Dashboard', icon: LayoutDashboard },
  { href: ROUTES.admin.orders, label: 'Orders', icon: ShoppingBag },
  { href: ROUTES.admin.products, label: 'Products', icon: Package },
  { href: ROUTES.admin.categories, label: 'Categories', icon: Tag },
  { href: ROUTES.admin.settings, label: 'Settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(ROUTES.admin.login);
  }

  return (
    <aside className="flex h-full w-60 flex-col border-r border-[--color-border] bg-[--color-surface]">
      <div className="border-b border-[--color-border] px-4 py-5">
        <Link href={ROUTES.admin.dashboard} className="font-brand text-lg text-[--color-deep-brown]">
          Banovani Admin
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors mb-0.5 ${
                active
                  ? 'bg-[--color-deep-brown] text-white'
                  : 'text-[--color-secondary-text] hover:bg-[--color-muted] hover:text-[--color-primary-text]'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
              {active && <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-60" />}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[--color-border] p-2">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[--color-secondary-text] hover:bg-red-50 hover:text-[--color-error]"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
