'use client';

import { useState, useEffect, useCallback } from 'react';
import { Bell, MapPin, Lock, Zap, RefreshCw } from 'lucide-react';
import MeetupCard from '@/components/meetup/MeetupCard';
import { useUserStore } from '@/store/userStore';
import { canCreateMeetup, MIN_TRUST_SCORE_TO_CREATE } from '@/lib/constants';
import { Meetup, SportType } from '@/types';
import { getMeetups } from '@/lib/api/meetups';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { DUMMY_MEETUPS } from '@/lib/dummy';

const SPORT_FILTERS: Array<{ value: SportType | 'all'; label: string }> = [
  { value: 'all', label: '전체' },
  { value: 'running', label: '🏃 러닝' },
  { value: 'gym', label: '🏋️ 헬스' },
  { value: 'climbing', label: '🧗 클라이밍' },
  { value: 'cycling', label: '🚴 자전거' },
  { value: 'swimming', label: '🏊 수영' },
];

function dbRowToMeetup(row: Record<string, unknown>): Meetup {
  return {
    id: row.id as string,
    hostId: row.host_id as string,
    title: row.title as string,
    sportType: row.sport_type as SportType,
    location: {
      address: row.address as string,
      district: row.district as string,
      lat: row.lat as number,
      lng: row.lng as number,
    },
    scheduledAt: row.scheduled_at as string,
    maxParticipants: row.max_participants as number,
    currentParticipants: row.current_participants as number,
    minLevel: row.min_level as Meetup['minLevel'],
    maxLevel: row.max_level as Meetup['maxLevel'],
    minTrustScore: row.min_trust_score as number,
    description: row.description as string | undefined,
    createdAt: row.created_at as string,
  };
}

export default function HomePage() {
  const { user } = useUserStore();
  const [selectedSport, setSelectedSport] = useState<SportType | 'all'>('all');
  const [meetups, setMeetups] = useState<Meetup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLockToast, setShowLockToast] = useState(false);

  const canCreate = user ? canCreateMeetup(user.trustScore) : false;

  const fetchMeetups = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getMeetups(selectedSport !== 'all' ? { sportType: selectedSport } : undefined);
      const mapped = data.map(dbRowToMeetup);
      if (mapped.length > 0) {
        setMeetups(mapped);
      } else {
        // DB 데이터 없을 때 더미 데이터 사용
        const filtered = selectedSport === 'all'
          ? DUMMY_MEETUPS
          : DUMMY_MEETUPS.filter((m) => m.sportType === selectedSport);
        setMeetups(filtered);
      }
    } catch {
      const filtered = selectedSport === 'all'
        ? DUMMY_MEETUPS
        : DUMMY_MEETUPS.filter((m) => m.sportType === selectedSport);
      setMeetups(filtered);
    } finally {
      setIsLoading(false);
    }
  }, [selectedSport]);

  useEffect(() => { fetchMeetups(); }, [fetchMeetups]);

  const handleCreateClick = () => {
    if (!canCreate) {
      setShowLockToast(true);
      setTimeout(() => setShowLockToast(false), 3000);
    }
  };

  return (
    <div className="flex flex-col min-h-dvh bg-[#0D0D0D]">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-5 pt-14 pb-4">
        <div className="flex items-center gap-1.5">
          <MapPin size={16} className="text-[#C6F135]" />
          <span className="text-white font-bold text-lg">성수동</span>
          <span className="text-[#5A5A5A] text-sm">▾</span>
        </div>
        <button className="relative w-10 h-10 flex items-center justify-center rounded-full bg-[#1A1A1A]">
          <Bell size={20} className="text-white" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#C6F135] rounded-full" />
        </button>
      </header>

      {/* 운동 시작 배너 */}
      <Link href="/workout" className="mx-5 mb-4">
        <div className="bg-[#C6F135] rounded-2xl px-5 py-4 flex items-center justify-between active:scale-[0.98] transition-transform">
          <div>
            <p className="text-[#0D0D0D] font-bold text-base">지금 바로 운동 시작</p>
            <p className="text-[#0D0D0D80] text-sm mt-0.5">혼자 또는 번개 모임으로</p>
          </div>
          <Zap size={28} className="text-[#0D0D0D]" fill="#0D0D0D" />
        </div>
      </Link>

      {/* 종목 필터 */}
      <div className="px-5 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {SPORT_FILTERS.map(({ value, label }) => (
            <button key={value} onClick={() => setSelectedSport(value)}
              className={cn('flex-shrink-0 text-sm font-medium px-3.5 py-2 rounded-full transition-all',
                selectedSport === value ? 'bg-[#C6F135] text-[#0D0D0D]' : 'bg-[#1A1A1A] text-[#A0A0A0] border border-[#2E2E2E]')}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 모임 리스트 */}
      <div className="flex-1 px-5 flex flex-col gap-3 pb-28">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[#A0A0A0] text-sm">
            근처 모임 <span className="text-white font-semibold">{meetups.length}개</span>
          </p>
          <button onClick={fetchMeetups} className="text-[#5A5A5A]">
            <RefreshCw size={15} className={cn(isLoading && 'animate-spin')} />
          </button>
        </div>

        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-2xl p-4 h-32 animate-pulse" />
          ))
        ) : meetups.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🏃</p>
            <p className="text-white font-semibold mb-1">근처에 모임이 없어요</p>
            <p className="text-[#5A5A5A] text-sm">첫 번째 모임을 만들어보세요!</p>
          </div>
        ) : (
          meetups.map((meetup) => <MeetupCard key={meetup.id} meetup={meetup} />)
        )}
      </div>

      {/* 모임 만들기 플로팅 버튼 */}
      <div className="fixed bottom-24 right-5">
        {canCreate ? (
          <Link href="/meetup/create">
            <button className="bg-[#C6F135] text-[#0D0D0D] font-bold text-sm px-5 py-3.5 rounded-full shadow-lg shadow-[#C6F13540] flex items-center gap-2 active:scale-95 transition-transform">
              <span className="text-lg">+</span> 모임 만들기
            </button>
          </Link>
        ) : (
          <button onClick={handleCreateClick}
            className="bg-[#1A1A1A] border border-[#2E2E2E] text-[#5A5A5A] font-bold text-sm px-5 py-3.5 rounded-full flex items-center gap-2">
            <Lock size={15} /> 모임 만들기
          </button>
        )}
      </div>

      {showLockToast && (
        <div className="fixed bottom-36 left-1/2 -translate-x-1/2 bg-[#242424] border border-[#3E3E3E] text-white text-sm px-5 py-3 rounded-2xl shadow-xl whitespace-nowrap">
          모임 개설은 신뢰도 {MIN_TRUST_SCORE_TO_CREATE}점부터 가능해요
        </div>
      )}
    </div>
  );
}
