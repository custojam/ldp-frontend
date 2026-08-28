'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { clearToken } from '@/lib/auth';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '▦' },
  { href: '/brokers', label: 'Brokers', icon: '◉' },
  { href: '/forms', label: 'Lead Form', icon: '◫' },
  { href: '/distributions', label: 'Distribution', icon: '⑆' },
  { href: '/leads', label: 'Leads', icon: '≡' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try {
      await authApi.logout();
    } finally {
      clearToken();
      router.push('/login');
    }
  }

  return (
    <aside className="w-56 bg-gray-900 text-white flex flex-col min-h-screen fixed left-0 top-0">
      <div className="p-5 border-b border-gray-700">
        <h1 className="text-sm font-bold text-blue-400 uppercase tracking-wider">Lead Platform</h1>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <span>⏻</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
