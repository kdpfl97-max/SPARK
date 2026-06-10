'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SportType } from '@/types';
import { SPORT_EMOJIS, SPORT_LABELS } from '@/lib/constants';
import Button from '@/components/ui/Button';
import { ChevronLeft, Zap, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const SPORT_OPTIONS: SportType[] = ['running', 'gym', 'climbing', 'cycling', 'swimming', 'soccer', 'tennis', 'other'];

export default function WorkoutStartPage() {
  const router = useRouter();
  const [selectedSport, setSelectedSport] = useState<SportType | null>(null);
  const [goalDistance, setGoalDistance] = useState('');
  const [goalMinutes, setGoalMinutes] = useState('');

  const handleSolo = () => {
    if (!selectedSport) return;
    router.push(`/workout/active?sport=${selectedSport}&solo=true`);
  };

  const handleMeetup = () => {
    if (!selectedSport) return;
    router.push(`/meetup/create?sport=${selectedSport}`);
  };

  return (
    <div className="min-h-dvh bg-[#0D0D0D] flex flex-col px-5 pt-14 pb-10">
      <button onClick={() => router.back()} className="flex items-center gap-1 text-[#A0A0A0] mb-6">
        <ChevronLeft size={20} />
        <span className="text-sm">뒤로</span>
      </button>

      <h1 className="text-white text-2xl font-black mb-2">운동 시작</h1>
      <p className="text-[#A0A0A0] text-sm mb-8">종목을 선택하고 바로 시작해요</p>

      {/* 종목 선택 */}
      <p className="text-[#A0A0A0] text-xs font-medium mb-3 uppercase tracking-wider">운동 종목</p>
      <div className="grid grid-cols-2 gap-3 mb-8">
        {SPORT_OPTIONS.map((sport) => (
          <button
            key={sport}
            onClick={() => setSelectedSport(sport)}
            className={cn(
              'flex items-center gap-3 px-4 py-4 rounded-2xl border transition-all active:scale-95',
              selectedSport === sport
                ? 'bg-[#3D4A10] border-[#C6F135] text-[#C6F135]'
                : 'bg-[#1A1A1A] border-[#2E2E2E] text-white'
            )}
          >
            <span className="text-2xl">{SPORT_EMOJIS[sport]}</span>
            <span className="font-medium text-sm">{SPORT_LABELS[sport]}</span>
          </button>
        ))}
      </div>

      {/* 목표 설정 */}
      <p className="text-[#A0A0A0] text-xs font-medium mb-3 uppercase tracking-wider">목표 설정 (선택)</p>
      <div className="flex gap-3 mb-10">
        <div className="flex-1 bg-[#1A1A1A] border border-[#2E2E2E] rounded-2xl px-4 py-3">
          <p className="text-[#5A5A5A] text-xs mb-1">거리</p>
          <div className="flex items-baseline gap-1">
            <input
              type="number"
              value={goalDistance}
              onChange={(e) => setGoalDistance(e.target.value)}
              placeholder="--"
              className="bg-transparent text-white font-bold text-lg w-16 outline-none"
            />
            <span className="text-[#A0A0A0] text-sm">km</span>
          </div>
        </div>
        <div className="flex-1 bg-[#1A1A1A] border border-[#2E2E2E] rounded-2xl px-4 py-3">
          <p className="text-[#5A5A5A] text-xs mb-1">시간</p>
          <div className="flex items-baseline gap-1">
            <input
              type="number"
              value={goalMinutes}
              onChange={(e) => setGoalMinutes(e.target.value)}
              placeholder="--"
              className="bg-transparent text-white font-bold text-lg w-16 outline-none"
            />
            <span className="text-[#A0A0A0] text-sm">분</span>
          </div>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex flex-col gap-3 mt-auto">
        <Button fullWidth size="lg" disabled={!selectedSport} onClick={handleSolo}>
          <Zap size={18} className="mr-2" />
          혼자 시작하기
        </Button>
        <Button fullWidth size="lg" variant="secondary" disabled={!selectedSport} onClick={handleMeetup}>
          <Users size={18} className="mr-2" />
          번개 모임 열기
        </Button>
      </div>
    </div>
  );
}
