'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SportType } from '@/types';
import { SPORT_EMOJIS, SPORT_LABELS } from '@/lib/constants';
import Button from '@/components/ui/Button';
import { Camera, ChevronLeft, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function WorkoutCompletePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sport = (searchParams.get('sport') as SportType) ?? 'running';
  const elapsed = Number(searchParams.get('elapsed') ?? 0);
  const distanceM = Number(searchParams.get('distance') ?? 0);
  const calories = Number(searchParams.get('calories') ?? 0);
  const heartRate = Number(searchParams.get('heartRate') ?? 0);
  const isSolo = searchParams.get('solo') === 'true';

  const [comment, setComment] = useState('');
  const [photoAdded, setPhotoAdded] = useState(false);
  const [ratings, setRatings] = useState<Record<string, number>>({
    'user-2': 5,
    'user-3': 4,
    'user-4': 5,
  });
  const [certDone, setCertDone] = useState(false);

  const MOCK_MEMBERS = [
    { id: 'user-2', nickname: '박운동' },
    { id: 'user-3', nickname: '김*준' },
    { id: 'user-4', nickname: '이*현' },
  ];

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${h}시간 ${m}분`;
    if (m > 0) return `${m}분 ${s}초`;
    return `${s}초`;
  };

  const formatDist = (m: number) => {
    if (m < 1000) return `${m}m`;
    return `${(m / 1000).toFixed(2)}km`;
  };

  const calcPace = (m: number, secs: number): string => {
    if (m < 10) return "--'--\"";
    const spk = (secs / m) * 1000;
    return `${Math.floor(spk / 60)}'${String(Math.floor(spk % 60)).padStart(2, '0')}"`;
  };

  const handleCertify = () => {
    setCertDone(true);
    setTimeout(() => router.replace('/profile'), 1800);
  };

  const handleSaveOnly = () => {
    router.replace('/home');
  };

  if (certDone) {
    return (
      <div className="min-h-dvh bg-[#0D0D0D] flex flex-col items-center justify-center px-5 text-center">
        <div className="text-6xl mb-6">🏅</div>
        <h2 className="text-white text-2xl font-black mb-2">인증 완료!</h2>
        <p className="text-[#A0A0A0] text-sm mb-4">신뢰도 +10점이 추가됩니다</p>
        <div className="bg-[#3D4A10] border border-[#C6F135]/30 rounded-2xl px-6 py-3">
          <span className="text-[#C6F135] font-bold">+10 신뢰도</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#0D0D0D] flex flex-col">
      {/* 헤더 */}
      <header className="flex items-center gap-3 px-5 pt-12 pb-4">
        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1A1A1A]">
          <ChevronLeft size={20} className="text-white" />
        </button>
        <h1 className="text-white font-black text-lg">운동 완료</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-5 pb-36">

        {/* 완료 배너 */}
        <div className="bg-gradient-to-br from-[#3D4A10] to-[#1A2010] border border-[#C6F135]/30 rounded-3xl p-5 mb-5 text-center">
          <p className="text-4xl mb-2">{SPORT_EMOJIS[sport]}</p>
          <p className="text-[#C6F135] font-black text-2xl mb-0.5">운동 완료! 🎉</p>
          <p className="text-[#A0A0A0] text-sm">{SPORT_LABELS[sport]}</p>
        </div>

        {/* 핵심 기록 */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <BigStatCard label="거리" value={formatDist(distanceM)} highlight />
          <BigStatCard label="시간" value={formatTime(elapsed)} highlight />
          {sport === 'running' && distanceM > 0 && (
            <BigStatCard label="페이스" value={calcPace(distanceM, elapsed)} unit="/km" />
          )}
          {calories > 0 && (
            <BigStatCard label="칼로리" value={String(calories)} unit="kcal" />
          )}
          {heartRate > 0 && (
            <BigStatCard label="평균 심박수" value={String(heartRate)} unit="bpm" />
          )}
        </div>

        {/* 경로 지도 */}
        <div className="h-44 bg-[#1A1A1A] border border-[#2E2E2E] rounded-2xl mb-5 relative overflow-hidden">
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid2" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#C6F135" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid2)" />
          </svg>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polyline
              points="50,70 52,65 55,60 58,56 62,52 65,49 68,47 72,45 75,44"
              stroke="#C6F135"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="50" cy="70" r="3" fill="#4ADE80" />
            <circle cx="75" cy="44" r="3" fill="#C6F135" />
            <circle cx="75" cy="44" r="6" fill="#C6F135" opacity="0.3" />
          </svg>
          <div className="absolute bottom-3 left-3 bg-[#0D0D0D]/80 px-2.5 py-1.5 rounded-lg">
            <p className="text-[#A0A0A0] text-xs">📍 성수동 한강변</p>
          </div>
          <div className="absolute top-3 right-3 flex gap-2">
            <div className="flex items-center gap-1 bg-[#0D0D0D]/80 px-2 py-1 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-[#4ADE80]" />
              <span className="text-[#A0A0A0] text-xs">시작</span>
            </div>
            <div className="flex items-center gap-1 bg-[#0D0D0D]/80 px-2 py-1 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-[#C6F135]" />
              <span className="text-[#A0A0A0] text-xs">종료</span>
            </div>
          </div>
        </div>

        {/* 획득 예정 신뢰도 */}
        <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-2xl p-4 mb-5">
          <div className="flex items-center justify-between">
            <span className="text-[#A0A0A0] text-sm">인증 완료 시 획득</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[#C6F135] font-black text-lg">+10</span>
              <span className="text-[#C6F135] text-sm">신뢰도</span>
            </div>
          </div>
          <div className="mt-3 h-1.5 bg-[#2E2E2E] rounded-full overflow-hidden">
            <div className="h-full bg-[#C6F135] rounded-full" style={{ width: '12%' }} />
          </div>
          <p className="text-[#5A5A5A] text-xs mt-1.5">현재 12점 → 인증 후 22점</p>
        </div>

        {/* 사진 인증 */}
        <div className="mb-5">
          <p className="text-[#A0A0A0] text-xs font-medium uppercase tracking-wider mb-2.5">운동 인증 사진</p>
          <button
            onClick={() => setPhotoAdded(true)}
            className={cn(
              'w-full h-40 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all',
              photoAdded
                ? 'bg-[#3D4A10] border-[#C6F135]'
                : 'bg-[#1A1A1A] border-[#2E2E2E] hover:border-[#3E3E3E]'
            )}
          >
            {photoAdded ? (
              <>
                <span className="text-3xl">📸</span>
                <span className="text-[#C6F135] text-sm font-medium">사진 추가됨</span>
              </>
            ) : (
              <>
                <Camera size={28} className="text-[#5A5A5A]" />
                <span className="text-[#5A5A5A] text-sm">사진을 추가하세요</span>
              </>
            )}
          </button>
        </div>

        {/* 한마디 */}
        <div className="mb-5">
          <p className="text-[#A0A0A0] text-xs font-medium uppercase tracking-wider mb-2.5">한마디 (선택)</p>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="오늘 운동 어땠나요?"
            rows={2}
            maxLength={100}
            className="w-full bg-[#1A1A1A] border border-[#2E2E2E] rounded-2xl px-4 py-3 text-white placeholder:text-[#5A5A5A] outline-none focus:border-[#C6F135] transition-colors resize-none text-sm"
          />
          <p className="text-right text-[#5A5A5A] text-xs mt-1">{comment.length}/100</p>
        </div>

        {/* 참가자 평가 (모임 운동일 때) */}
        {!isSolo && (
          <div className="mb-5">
            <p className="text-[#A0A0A0] text-xs font-medium uppercase tracking-wider mb-2.5">참가자 평가</p>
            <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-2xl overflow-hidden">
              {MOCK_MEMBERS.map((m, i) => (
                <div
                  key={m.id}
                  className={cn('flex items-center justify-between px-4 py-3.5', i !== 0 && 'border-t border-[#2E2E2E]')}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#3D4A10] flex items-center justify-center text-xs font-bold text-[#C6F135]">
                      {m.nickname[0]}
                    </div>
                    <span className="text-white text-sm">{m.nickname}</span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRatings((prev) => ({ ...prev, [m.id]: star }))}
                      >
                        <Star
                          size={20}
                          className={cn(
                            'transition-colors',
                            star <= (ratings[m.id] ?? 0) ? 'text-[#FACC15]' : 'text-[#2E2E2E]'
                          )}
                          fill={star <= (ratings[m.id] ?? 0) ? '#FACC15' : 'transparent'}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-[#0D0D0D] border-t border-[#2E2E2E] px-5 py-4 pb-safe">
        <div className="flex gap-3">
          <Button variant="ghost" fullWidth onClick={handleSaveOnly}>
            그냥 저장
          </Button>
          <Button fullWidth onClick={handleCertify}>
            인증하고 저장
          </Button>
        </div>
      </div>
    </div>
  );
}

function BigStatCard({
  label,
  value,
  unit,
  highlight,
}: {
  label: string;
  value: string;
  unit?: string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-2xl px-4 py-4">
      <p className="text-[#5A5A5A] text-xs mb-1.5">{label}</p>
      <div className="flex items-baseline gap-1">
        <span
          className={cn('font-black text-2xl tabular-nums', highlight ? 'text-[#C6F135]' : 'text-white')}
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {value}
        </span>
        {unit && <span className="text-[#5A5A5A] text-xs">{unit}</span>}
      </div>
    </div>
  );
}
