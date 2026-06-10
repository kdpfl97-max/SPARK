import { supabase } from '../supabase';
import { SportType, ExerciseLevel } from '@/types';

export async function getMeetups(filters?: { sportType?: SportType; district?: string }) {
  let query = supabase
    .from('meetups')
    .select('*, host:profiles!host_id(id, nickname, exercise_level, trust_score, trust_grade)')
    .gte('scheduled_at', new Date().toISOString())
    .order('scheduled_at', { ascending: true });

  if (filters?.sportType) query = query.eq('sport_type', filters.sportType);
  if (filters?.district) query = query.eq('district', filters.district);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getMeetup(meetupId: string) {
  const { data, error } = await supabase
    .from('meetups')
    .select('*, host:profiles!host_id(id, nickname, exercise_level, trust_score, trust_grade, noshow_count), meetup_participants(user_id, status)')
    .eq('id', meetupId)
    .single();
  if (error) throw error;
  return data;
}

export async function createMeetup(payload: {
  hostId: string;
  title: string;
  sportType: SportType;
  address: string;
  district: string;
  lat: number;
  lng: number;
  scheduledAt: string;
  maxParticipants: number;
  minLevel: ExerciseLevel;
  maxLevel: ExerciseLevel;
  minTrustScore: number;
  description?: string;
}) {
  const { data, error } = await supabase
    .from('meetups')
    .insert({
      host_id: payload.hostId,
      title: payload.title,
      sport_type: payload.sportType,
      address: payload.address,
      district: payload.district,
      lat: payload.lat,
      lng: payload.lng,
      scheduled_at: payload.scheduledAt,
      max_participants: payload.maxParticipants,
      current_participants: 1,
      min_level: payload.minLevel,
      max_level: payload.maxLevel,
      min_trust_score: payload.minTrustScore,
      description: payload.description ?? null,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function joinMeetup(meetupId: string, userId: string) {
  const { error: participantError } = await supabase
    .from('meetup_participants')
    .insert({ meetup_id: meetupId, user_id: userId, status: 'joined' });
  if (participantError) throw participantError;

  const { data: meetup } = await supabase
    .from('meetups')
    .select('current_participants')
    .eq('id', meetupId)
    .single();

  if (meetup) {
    await supabase
      .from('meetups')
      .update({ current_participants: (meetup.current_participants ?? 0) + 1 })
      .eq('id', meetupId);
  }
}

export async function leaveMeetup(meetupId: string, userId: string) {
  const { error } = await supabase
    .from('meetup_participants')
    .update({ status: 'cancelled' })
    .eq('meetup_id', meetupId)
    .eq('user_id', userId);
  if (error) throw error;

  const { data: meetup } = await supabase
    .from('meetups')
    .select('current_participants')
    .eq('id', meetupId)
    .single();

  if (meetup) {
    await supabase
      .from('meetups')
      .update({ current_participants: Math.max(0, (meetup.current_participants ?? 1) - 1) })
      .eq('id', meetupId);
  }
}

export async function getMyMeetups(userId: string) {
  const { data, error } = await supabase
    .from('meetup_participants')
    .select('meetup_id')
    .eq('user_id', userId)
    .eq('status', 'joined');
  if (error) throw error;

  if (!data?.length) return [];

  const meetupIds = data.map((d) => d.meetup_id);
  const { data: meetups } = await supabase
    .from('meetups')
    .select('*')
    .in('id', meetupIds);
  return meetups ?? [];
}
