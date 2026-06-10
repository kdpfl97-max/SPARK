import { supabase } from '../supabase';
import { SportType } from '@/types';

export async function saveWorkout(payload: {
  userId: string;
  meetupId?: string;
  sportType: SportType;
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
  distanceMeters?: number;
  calories?: number;
  avgHeartRate?: number;
  comment?: string;
  address?: string;
  district?: string;
  lat?: number;
  lng?: number;
  isCertified?: boolean;
}) {
  const { data, error } = await supabase
    .from('workout_records')
    .insert({
      user_id: payload.userId,
      meetup_id: payload.meetupId ?? null,
      sport_type: payload.sportType,
      started_at: payload.startedAt,
      ended_at: payload.endedAt,
      duration_seconds: payload.durationSeconds,
      distance_meters: payload.distanceMeters ?? null,
      calories: payload.calories ?? null,
      avg_heart_rate: payload.avgHeartRate ?? null,
      comment: payload.comment ?? null,
      address: payload.address ?? null,
      district: payload.district ?? null,
      lat: payload.lat ?? null,
      lng: payload.lng ?? null,
      is_certified: payload.isCertified ?? false,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getWorkoutFeed(userId: string, limit = 20) {
  const { data, error } = await supabase
    .from('workout_records')
    .select('*')
    .eq('user_id', userId)
    .order('started_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function getWorkoutStats(userId: string) {
  const { data, error } = await supabase
    .from('workout_records')
    .select('sport_type, duration_seconds, distance_meters, calories, started_at')
    .eq('user_id', userId);
  if (error) throw error;

  const records = data ?? [];
  const totalCount = records.length;
  const totalSeconds = records.reduce((s, r) => s + r.duration_seconds, 0);
  const totalDistance = records.reduce((s, r) => s + (r.distance_meters ?? 0), 0);
  const totalCalories = records.reduce((s, r) => s + (r.calories ?? 0), 0);

  const sportCounts: Record<string, number> = {};
  records.forEach((r) => {
    sportCounts[r.sport_type] = (sportCounts[r.sport_type] ?? 0) + 1;
  });

  return { totalCount, totalSeconds, totalDistance, totalCalories, sportCounts };
}
