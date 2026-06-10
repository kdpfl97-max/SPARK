import { SportType, ExerciseLevel, TrustGrade } from '@/types';

export const SPORT_LABELS: Record<SportType, string> = {
  running: '러닝',
  gym: '헬스',
  climbing: '클라이밍',
  cycling: '자전거',
  swimming: '수영',
  soccer: '축구',
  tennis: '테니스',
  other: '기타',
};

export const SPORT_EMOJIS: Record<SportType, string> = {
  running: '🏃',
  gym: '🏋️',
  climbing: '🧗',
  cycling: '🚴',
  swimming: '🏊',
  soccer: '⚽',
  tennis: '🎾',
  other: '🏅',
};

export const SPORT_COLORS: Record<SportType, string> = {
  running: '#C6F135',
  gym: '#FB923C',
  climbing: '#F87171',
  cycling: '#60A5FA',
  swimming: '#38BDF8',
  soccer: '#4ADE80',
  tennis: '#FACC15',
  other: '#A0A0A0',
};

export const LEVEL_LABELS: Record<ExerciseLevel, string> = {
  1: '입문',
  2: '초급',
  3: '중급',
  4: '고급',
  5: '전문',
};

export const LEVEL_COLORS: Record<ExerciseLevel, string> = {
  1: '#A0A0A0',
  2: '#4ADE80',
  3: '#FACC15',
  4: '#FB923C',
  5: '#C084FC',
};

export const LEVEL_BG_COLORS: Record<ExerciseLevel, string> = {
  1: '#1A1A1A',
  2: '#1A2E1A',
  3: '#2A2A10',
  4: '#2A1A10',
  5: '#2A1020',
};

export const TRUST_GRADE_LABELS: Record<TrustGrade, string> = {
  sprout: '새싹',
  normal: '일반',
  manner: '매너',
  excellent: '우수',
  champion: '챔피언',
};

export const TRUST_GRADE_COLORS: Record<TrustGrade, string> = {
  sprout: '#5A5A5A',
  normal: '#60A5FA',
  manner: '#4ADE80',
  excellent: '#FACC15',
  champion: '#C6F135',
};

export const TRUST_GRADE_MAX_PARTICIPANTS: Record<TrustGrade, number> = {
  sprout: 0,
  normal: 5,
  manner: 10,
  excellent: 20,
  champion: 999,
};

export const MIN_TRUST_SCORE_TO_CREATE = 30;

export function getTrustGrade(score: number): TrustGrade {
  if (score >= 95) return 'champion';
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'manner';
  if (score >= 30) return 'normal';
  return 'sprout';
}

export function canCreateMeetup(trustScore: number): boolean {
  return trustScore >= MIN_TRUST_SCORE_TO_CREATE;
}
