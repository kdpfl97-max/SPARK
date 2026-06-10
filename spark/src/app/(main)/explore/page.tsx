'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import MeetupCard from '@/components/meetup/MeetupCard';
import { Meetup, SportType } from '@/types';
import { SPORT_EMOJIS, SPORT_LABELS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { DUMMY_MEETUPS } from '@/lib/dummy';

const MOCK_MEETUPS: Meetup[] = DUMMY_MEETUPS;

const SORT_OPTIONS = ['가까운 순', '빠른 순', '인원 많은 순'];
const SPORT_FILTERS: Array<{ value: SportType | 'all'; label: string }> = [
  { value: 'all', label: '전체' },
  { value: 'running', label: `${SPORT_EMOJIS.running} ${SPORT_LABELS.running}` },
  { value: 'gym', label: `${SPORT_EMOJIS.gym} ${SPORT_LABELS.gym}` },
  { value: 'climbing', label: `${SPORT_EMOJIS.climbing} ${SPORT_LABELS.climbing}` },
  { value: 'cycling', label: `${SPORT_EMOJIS.cycling} ${SPORT_LABELS.cycling}` },
];

export default function ExplorePage() {
  const [query, setQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState<SportType | 'all'>('all');
  const [selectedSort, setSelectedSort] = useState(0);

  const filtered = MOCK_MEETUPS.filter((m) => {
    const matchSport = selectedSport === 'all' || m.sportType === selectedSport;
    const matchQuery = query === '' || m.title.includes(query) || m.location.district.includes(query);
    return matchSport && matchQuery;
  });

  return (
    <div className="min-h-dvh bg-[#0D0D0D]">
      <header className="px-5 pt-14 pb-4">
        <h1 className="text-white text-xl font-black mb-4">탐색</h1>
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A5A5A]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="모임명, 동네로 검색"
            className="w-full bg-[#1A1A1A] border border-[#2E2E2E] rounded-2xl pl-10 pr-4 py-3 text-white placeholder:text-[#5A5A5A] outline-none focus:border-[#C6F135] transition-colors"
          />
        </div>
      </header>

      {/* 종목 필터 */}
      <div className="px-5 mb-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {SPORT_FILTERS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setSelectedSport(value)}
              className={cn(
                'flex-shrink-0 text-sm font-medium px-3.5 py-2 rounded-full transition-all',
                selectedSport === value
                  ? 'bg-[#C6F135] text-[#0D0D0D]'
                  : 'bg-[#1A1A1A] text-[#A0A0A0] border border-[#2E2E2E]'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 정렬 */}
      <div className="px-5 mb-4">
        <div className="flex gap-2">
          {SORT_OPTIONS.map((opt, i) => (
            <button
              key={opt}
              onClick={() => setSelectedSort(i)}
              className={cn(
                'text-xs px-3 py-1.5 rounded-full border transition-all',
                selectedSort === i
                  ? 'border-[#C6F135] text-[#C6F135]'
                  : 'border-[#2E2E2E] text-[#5A5A5A]'
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* 결과 */}
      <div className="px-5 flex flex-col gap-3 pb-8">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-[#A0A0A0] text-sm">검색 결과가 없어요</p>
          </div>
        ) : (
          filtered.map((m) => <MeetupCard key={m.id} meetup={m} />)
        )}
      </div>
    </div>
  );
}
