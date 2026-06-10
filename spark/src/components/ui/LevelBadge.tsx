import { ExerciseLevel } from '@/types';
import { LEVEL_LABELS, LEVEL_COLORS, LEVEL_BG_COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface LevelBadgeProps {
  level: ExerciseLevel;
  showDots?: boolean;
  className?: string;
}

export default function LevelBadge({ level, showDots = false, className }: LevelBadgeProps) {
  return (
    <span
      className={cn('inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg', className)}
      style={{ backgroundColor: LEVEL_BG_COLORS[level], color: LEVEL_COLORS[level] }}
    >
      Lv.{level} {LEVEL_LABELS[level]}
      {showDots && (
        <span className="flex gap-0.5 ml-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: i <= level ? LEVEL_COLORS[level] : '#2E2E2E' }}
            />
          ))}
        </span>
      )}
    </span>
  );
}
