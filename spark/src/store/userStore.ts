import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, ExerciseLevel } from '@/types';
import { getTrustGrade } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import { getProfile, createProfile, updateTrustScore as apiUpdateTrust } from '@/lib/api/profiles';

interface UserStore {
  user: User | null;
  isOnboarded: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  loadUser: () => Promise<void>;
  completeOnboarding: (nickname: string, level: ExerciseLevel) => Promise<void>;
  updateTrustScore: (delta: number) => Promise<void>;
  logout: () => Promise<void>;
}

function dbRowToUser(row: {
  id: string;
  nickname: string;
  avatar_url: string | null;
  exercise_level: number;
  trust_score: number;
  trust_grade: string;
  join_count: number;
  cert_count: number;
  noshow_count: number;
  created_at: string;
}): User {
  return {
    id: row.id,
    nickname: row.nickname,
    avatarUrl: row.avatar_url ?? undefined,
    exerciseLevel: row.exercise_level as ExerciseLevel,
    trustScore: row.trust_score,
    trustGrade: row.trust_grade as User['trustGrade'],
    joinCount: row.join_count,
    certCount: row.cert_count,
    noshowCount: row.noshow_count,
    createdAt: row.created_at,
  };
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      isOnboarded: false,
      isLoading: false,

      setUser: (user) => set({ user }),

      loadUser: async () => {
        set({ isLoading: true });
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session?.user) {
            set({ user: null, isOnboarded: false, isLoading: false });
            return;
          }
          const profile = await getProfile(session.user.id);
          set({ user: dbRowToUser(profile), isOnboarded: true, isLoading: false });
        } catch {
          set({ isLoading: false });
        }
      },

      completeOnboarding: async (nickname, level) => {
        set({ isLoading: true });
        try {
          const { data: { session } } = await supabase.auth.getSession();

          if (session?.user) {
            let profile;
            try {
              profile = await getProfile(session.user.id);
            } catch {
              profile = await createProfile(session.user.id, nickname, level);
            }
            set({ user: dbRowToUser(profile), isOnboarded: true, isLoading: false });
          } else {
            // 로그인 없이 둘러보기 — 로컬 임시 유저
            const guestUser: User = {
              id: 'guest',
              nickname: nickname || '운동러',
              exerciseLevel: level,
              trustScore: 30,
              trustGrade: 'normal',
              joinCount: 0,
              certCount: 0,
              noshowCount: 0,
              createdAt: new Date().toISOString(),
            };
            set({ user: guestUser, isOnboarded: true, isLoading: false });
          }
        } catch (e) {
          set({ isLoading: false });
          throw e;
        }
      },

      updateTrustScore: async (delta) => {
        const user = get().user;
        if (!user) return;
        try {
          const updated = await apiUpdateTrust(user.id, delta);
          set({ user: dbRowToUser(updated) });
        } catch {
          // 낙관적 업데이트 폴백
          const newScore = Math.max(0, Math.min(100, user.trustScore + delta));
          set({ user: { ...user, trustScore: newScore, trustGrade: getTrustGrade(newScore) } });
        }
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, isOnboarded: false });
      },
    }),
    {
      name: 'spark-user',
      partialize: (state) => ({ isOnboarded: state.isOnboarded }),
    }
  )
);
