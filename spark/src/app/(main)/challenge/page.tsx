'use client';

import { useState } from 'react';
import { Challenge } from '@/types';
import { cn } from '@/lib/utils';
import { Users, Calendar } from 'lucide-react';
import Button from '@/components/ui/Button';

const MOCK_CHALLENGES: Challenge[] = [
  {
    id: 'c1',
    title: '6월 러닝 챌린지',
    description: '한 달 100km 완주',
    goal: '100km 달리기',
    targetValue: 100,
    unit: 'km',
    startDate: '2026-06-01',
    endDate: '2026-06-30',
    participantCount: 234,
    myProgress: 82,
    isJoined: true,
  },
  {
    id: 'c2',
    title: '30일 운동 습관',
    description: '30일 연속 인증',
    goal: '30일 연속 운동 인증',
    targetValue: 30,
    unit: '일',
    startDate: '2026-06-01',
    endDate: '2026-06-30',
    participantCount: 1204,
    isJoined: false,
  },
  {
    id: 'c3',
    title: '여름 수영 챌린지',
    description: '이번 달 10회 수영',
    goal: '10회 수영',
    targetValue: 10,
    unit: '회',
    startDate: '2026-06-01',
    endDate: '2026-06-30',
    participantCount: 89,
    isJoined: false,
  },
];

const COMPLETED = [
  { title: '5월 러닝', emoji: '🏃' },
  { title: '첫걸음', emoji: '👣' },
  { title: '주 3회', emoji: '💪' },
];

export default function ChallengePage() {
  const [challenges, setChallenges] = useState(MOCK_CHALLENGES);

  const joined = challenges.filter((c) => c.isJoined);
  const recommended = challenges.filter((c) => !c.isJoined && !c.isCompleted);

  const handleJoin = (id: string) => {
    setChallenges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isJoined: true, myProgress: 0, participantCount: c.participantCount + 1 } : c))
    );
  };

  const daysLeft = (endDate: string) => {
    const diff = new Date(endDate).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / 86400000));
  };

  return (
    <div className="min-h-dvh bg-[#0D0D0D]">
      <header className="px-5 pt-14 pb-4">
        <h1 className="text-white text-xl font-black">챌린지</h1>
      </header>

      <div className="px-5 flex flex-col gap-6 pb-8">
        {/* 참가중 */}
        {joined.length > 0 && (
          <section>
            <p className="text-[#A0A0A0] text-sm font-medium mb-3">참가중 ({joined.length})</p>
            <div className="flex flex-col gap-3">
              {joined.map((c) => (
                <div key={c.id} className="bg-[#1A1A1A] border border-[#C6F135]/30 rounded-2xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-white font-bold text-base">{c.title}</p>
                      <p className="text-[#A0A0A0] text-sm mt-0.5">{c.description}</p>
                    </div>
                    <span className="text-xs text-[#C6F135] bg-[#3D4A10] px-2.5 py-1 rounded-full">진행중</span>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-[#A0A0A0]">진행률</span>
                      <span className="text-[#C6F135] font-bold">
                        {c.myProgress}/{c.targetValue}{c.unit}
                      </span>
                    </div>
                    <div className="h-2.5 bg-[#2E2E2E] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${((c.myProgress ?? 0) / c.targetValue) * 100}%`,
                          background: 'linear-gradient(90deg, #C6F135, #A8CF20)',
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#5A5A5A]">
                    <span className="flex items-center gap-1"><Calendar size={11} />{daysLeft(c.endDate)}일 남음</span>
                    <span className="flex items-center gap-1"><Users size={11} />{c.participantCount.toLocaleString()}명 참가</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 추천 챌린지 */}
        <section>
          <p className="text-[#A0A0A0] text-sm font-medium mb-3">추천 챌린지</p>
          <div className="flex flex-col gap-3">
            {recommended.map((c) => (
              <div key={c.id} className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-2xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-white font-bold text-base">{c.title}</p>
                    <p className="text-[#A0A0A0] text-sm mt-0.5">{c.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-[#5A5A5A]">
                    <span className="flex items-center gap-1"><Calendar size={11} />{daysLeft(c.endDate)}일 남음</span>
                    <span className="flex items-center gap-1"><Users size={11} />{c.participantCount.toLocaleString()}명</span>
                  </div>
                  <Button size="sm" onClick={() => handleJoin(c.id)}>참가</Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 완료 */}
        <section>
          <p className="text-[#A0A0A0] text-sm font-medium mb-3">완료한 챌린지 ({COMPLETED.length})</p>
          <div className="flex gap-2 flex-wrap">
            {COMPLETED.map((c) => (
              <div key={c.title} className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl px-3 py-2 flex items-center gap-1.5">
                <span className="text-[#4ADE80]">✅</span>
                <span className="text-[#A0A0A0] text-sm">{c.title}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
