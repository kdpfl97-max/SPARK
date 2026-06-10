import { supabase } from '../supabase';

export async function getChallenges(userId?: string) {
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .gte('end_date', new Date().toISOString().split('T')[0])
    .order('participant_count', { ascending: false });
  if (error) throw error;

  const challenges = data ?? [];

  if (!userId) return challenges.map((c) => ({ ...c, isJoined: false, myProgress: 0, isCompleted: false }));

  const { data: myParticipations } = await supabase
    .from('challenge_participants')
    .select('challenge_id, progress, completed_at')
    .eq('user_id', userId);

  const myMap: Record<string, { progress: number; completed_at: string | null }> = {};
  (myParticipations ?? []).forEach((p) => {
    myMap[p.challenge_id] = { progress: p.progress, completed_at: p.completed_at };
  });

  return challenges.map((c) => ({
    ...c,
    isJoined: !!myMap[c.id],
    myProgress: myMap[c.id]?.progress ?? 0,
    isCompleted: !!myMap[c.id]?.completed_at,
  }));
}

export async function joinChallenge(challengeId: string, userId: string) {
  const { error } = await supabase
    .from('challenge_participants')
    .insert({ challenge_id: challengeId, user_id: userId, progress: 0 });
  if (error) throw error;

  const { data: challenge } = await supabase
    .from('challenges')
    .select('participant_count')
    .eq('id', challengeId)
    .single();

  if (challenge) {
    await supabase
      .from('challenges')
      .update({ participant_count: (challenge.participant_count ?? 0) + 1 })
      .eq('id', challengeId);
  }
}
