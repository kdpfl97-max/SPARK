'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { supabase } from '@/lib/supabase';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { loadUser, setUser } = useUserStore();

  useEffect(() => {
    loadUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') loadUser();
      if (event === 'SIGNED_OUT') setUser(null);
    });

    return () => subscription.unsubscribe();
  }, [loadUser, setUser]);

  return <>{children}</>;
}
