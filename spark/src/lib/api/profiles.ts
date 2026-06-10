import { supabase } from '../supabase';
import { ExerciseLevel } from '@/types';
import { getTrustGrade } from '../constants';

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

export async function createProfile(userId: string, nickname: string, level: ExerciseLevel) {
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      nickname,
      exercise_level: level,
      trust_score: 0,
      trust_grade: 'sprout',
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, updates: { nickname?: string; exercise_level?: number; avatar_url?: string }) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTrustScore(userId: string, delta: number) {
  const profile = await getProfile(userId);
  const newScore = Math.max(0, Math.min(100, profile.trust_score + delta));
  const { data, error } = await supabase
    .from('profiles')
    .update({ trust_score: newScore, trust_grade: getTrustGrade(newScore) })
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}
