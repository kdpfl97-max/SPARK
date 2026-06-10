import { TrustGrade } from '@/types';
import { TRUST_GRADE_LABELS, TRUST_GRADE_COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface TrustBadgeProps {
  grade: TrustGrade;
  score?: number;
  className?: string;
}

const TRUST_GRADE_BG: Record<TrustGrade, string> = {
  sprout: '#1A1A1A',
  normal: '#1A2020',
  manner: '#1A2E1A',
  excellent: '#2A2010',
  champion: '#2A1020',
};

export default function TrustBadge({ grade, score, className }: TrustBadgeProps) {
  return (
    <span
      className={cn('inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg', className)}
      style={{ backgroundColor: TRUST_GRADE_BG[grade], color: TRUST_GRADE_COLORS[grade] }}
    >
      ⭐ {TRUST_GRADE_LABELS[grade]}
      {score !== undefined && <span className="opacity-70">{score}점</span>}
    </span>
  );
}
