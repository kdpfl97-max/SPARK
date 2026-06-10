import { SportType } from '@/types';
import { SPORT_LABELS, SPORT_EMOJIS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface SportTagProps {
  sport: SportType;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function SportTag({ sport, selected, onClick, className }: SportTagProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-all',
        selected
          ? 'bg-[#3D4A10] text-[#C6F135] border border-[#C6F135]'
          : 'bg-[#242424] text-white border border-transparent hover:border-[#3E3E3E]',
        className
      )}
    >
      <span>{SPORT_EMOJIS[sport]}</span>
      <span>{SPORT_LABELS[sport]}</span>
    </button>
  );
}
