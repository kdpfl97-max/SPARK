import { Meetup } from '@/types';
import { SPORT_EMOJIS, SPORT_LABELS } from '@/lib/constants';
import { formatDistance, formatDate, formatTime } from '@/lib/utils';
import LevelBadge from '@/components/ui/LevelBadge';
import { MapPin, Clock, Users } from 'lucide-react';
import Link from 'next/link';

interface MeetupCardProps {
  meetup: Meetup;
}

export default function MeetupCard({ meetup }: MeetupCardProps) {
  const isFull = meetup.currentParticipants >= meetup.maxParticipants;
  const spotsLeft = meetup.maxParticipants - meetup.currentParticipants;

  return (
    <Link href={`/meetup/${meetup.id}`}>
      <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-2xl p-4 active:scale-[0.98] transition-transform">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{SPORT_EMOJIS[meetup.sportType]}</span>
            <div>
              <p className="text-white font-semibold text-base leading-tight">{meetup.title}</p>
              <p className="text-[#A0A0A0] text-xs mt-0.5">{SPORT_LABELS[meetup.sportType]}</p>
            </div>
          </div>
          {isFull ? (
            <span className="text-xs text-[#F87171] bg-[#2A1010] px-2 py-1 rounded-full">마감</span>
          ) : (
            <span className="text-xs text-[#C6F135] bg-[#3D4A10] px-2 py-1 rounded-full">
              {spotsLeft}자리 남음
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5 mb-3">
          <div className="flex items-center gap-1.5 text-[#A0A0A0] text-sm">
            <MapPin size={13} />
            <span>{meetup.location.district}</span>
            {meetup.distanceMeters !== undefined && (
              <span className="text-[#C6F135]">· {formatDistance(meetup.distanceMeters)}</span>
            )}
          </div>
          <div className="flex items-center gap-3 text-[#A0A0A0] text-sm">
            <span className="flex items-center gap-1.5">
              <Clock size={13} />
              {formatDate(meetup.scheduledAt)} {formatTime(meetup.scheduledAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Users size={13} />
              {meetup.currentParticipants}/{meetup.maxParticipants}명
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-3 border-t border-[#2E2E2E]">
          <LevelBadge level={meetup.minLevel} />
          {meetup.minTrustScore > 0 ? (
            <span className="text-xs text-[#A0A0A0] bg-[#242424] px-2.5 py-1 rounded-lg">
              신뢰도 {meetup.minTrustScore}점 이상
            </span>
          ) : (
            <span className="text-xs text-[#A0A0A0] bg-[#242424] px-2.5 py-1 rounded-lg">
              누구나 가능
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
