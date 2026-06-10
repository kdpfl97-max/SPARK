'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';

export default function RootPage() {
  const router = useRouter();
  const { isOnboarded } = useUserStore();

  useEffect(() => {
    if (isOnboarded) {
      router.replace('/home');
    } else {
      router.replace('/onboarding');
    }
  }, [isOnboarded, router]);

  return (
    <div className="min-h-dvh bg-[#0D0D0D] flex items-center justify-center">
      <span className="text-[#C6F135] text-4xl font-black tracking-tight">SPARK ⚡</span>
    </div>
  );
}
