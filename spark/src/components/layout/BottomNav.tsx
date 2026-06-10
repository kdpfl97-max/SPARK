'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Plus, Camera, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/home', icon: Home, label: '홈' },
  { href: '/explore', icon: Search, label: '탐색' },
  { href: '/workout', icon: Plus, label: '운동', isCenter: true },
  { href: '/certify', icon: Camera, label: '인증' },
  { href: '/profile', icon: User, label: '프로필' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-[#0D0D0D] border-t border-[#2E2E2E] z-50">
      <div className="flex items-center justify-around px-2 pb-safe">
        {navItems.map(({ href, icon: Icon, label, isCenter }) => {
          const isActive = pathname.startsWith(href);
          if (isCenter) {
            return (
              <Link key={href} href={href} className="flex flex-col items-center py-2 -mt-5">
                <span className="w-14 h-14 rounded-full bg-[#C6F135] flex items-center justify-center shadow-lg shadow-[#C6F13540]">
                  <Icon size={24} color="#0D0D0D" strokeWidth={2.5} />
                </span>
              </Link>
            );
          }
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 py-3 px-3 transition-colors',
                isActive ? 'text-[#C6F135]' : 'text-[#5A5A5A]'
              )}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
