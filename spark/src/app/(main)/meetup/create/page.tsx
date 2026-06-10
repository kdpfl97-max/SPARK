'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { SportType, ExerciseLevel } from '@/types';
import {
  SPORT_EMOJIS,
  SPORT_LABELS,
  LEVEL_LABELS,
  LEVEL_COLORS,
  TRUST_GRADE_MAX_PARTICIPANTS,
  canCreateMeetup,
  MIN_TRUST_SCORE_TO_CREATE,
} from '@/lib/constants';
import Button from '@/components/ui/Button';
import { ChevronLeft, ChevronDown, MapPin, Calendar, Clock, Users, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const SPORT_OPTIONS: SportType[] = ['running', 'gym', 'climbing', 'cycling', 'swimming', 'soccer', 'tennis', 'other'];

const TRUST_SCORE_OPTIONS = [
  { value: 0, label: '누구나 가능' },
  { value: 30, label: '30점 이상 (일반)' },
  { value: 60, label: '60점 이상 (매너)' },
  { value: 80, label: '80점 이상 (우수)' },
];

export default function MeetupCreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUserStore();

  const initSport = (searchParams.get('sport') as SportType) ?? null;

  const [sport, setSport] = useState<SportType | null>(initSport);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [headcount, setHeadcount] = useState(4);
  const [minLevel, setMinLevel] = useState<ExerciseLevel>(1);
  const [maxLevel, setMaxLevel] = useState<ExerciseLevel>(5);
  const [minTrust, setMinTrust] = useState(0);
  const [description, setDescription] = useState('');
  const [showSportPicker, setShowSportPicker] = useState(false);
  const [showLevelPicker, setShowLevelPicker] = useState(false);
  const [showTrustPicker, setShowTrustPicker] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!user) return null;

  const canCreate = canCreateMeetup(user.trustScore);
  const maxAllowed = TRUST_GRADE_MAX_PARTICIPANTS[user.trustGrade];

  const isValid = sport && title.trim() && date && time && location.trim();

  const handleSubmit = () => {
    if (!isValid) return;
    setSubmitted(true);
    setTimeout(() => router.replace('/home'), 1500);
  };

  if (!canCreate) {
    const needed = MIN_TRUST_SCORE_TO_CREATE - user.trustScore;
    return (
      <div className="min-h-dvh bg-[#0D0D0D] flex flex-col px-5 pt-14 pb-10">
        <button onClick={() => router.back()} className="flex items-center gap-1 text-[#A0A0A0] mb-8">
          <ChevronLeft size={20} />
          <span className="text-sm">뒤로</span>
        </button>
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <p className="text-5xl mb-6">🔒</p>
          <h2 className="text-white text-2xl font-black mb-2">모임 개설 불가</h2>
          <p className="text-[#A0A0A0] text-sm mb-8 leading-relaxed">
            모임을 열려면 신뢰도 {MIN_TRUST_SCORE_TO_CREATE}점이 필요해요.<br />
            현재 {user.trustScore}점 — {needed}점 더 필요해요.
          </p>
          <div className="w-full bg-[#1A1A1A] border border-[#2E2E2E] rounded-2xl p-4 mb-8 text-left">
            <p className="text-white font-semibold text-sm mb-3">빠르게 올리는 방법</p>
            {[
              { label: '본인 인증', score: '+15점', done: false },
              { label: '모임 첫 참가', score: '+10점', done: false },
              { label: '운동 첫 인증', score: '+5점', done: false },
              { label: '프로필 완성', score: '+3점', done: false },
            ].map(({ label, score }) => (
              <div key={label} className="flex items-center justify-between py-2.5 border-b border-[#2E2E2E] last:border-0">
                <span className="text-[#A0A0A0] text-sm">{label}</span>
                <span className="text-[#C6F135] text-sm font-bold">{score}</span>
              </div>
            ))}
          </div>
          <Button fullWidth onClick={() => router.replace('/home')}>
            모임 둘러보기
          </Button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-dvh bg-[#0D0D0D] flex flex-col items-center justify-center px-5 text-center">
        <p className="text-6xl mb-6">🎉</p>
        <h2 className="text-white text-2xl font-black mb-2">모임이 만들어졌어요!</h2>
        <p className="text-[#A0A0A0] text-sm">홈으로 돌아갑니다...</p>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#0D0D0D] flex flex-col">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-5 pt-14 pb-4">
        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1A1A1A]">
          <ChevronLeft size={20} className="text-white" />
        </button>
        <h1 className="text-white font-black text-lg">모임 만들기</h1>
        <div className="w-10" />
      </header>

      <div className="flex-1 overflow-y-auto px-5 pb-32">

        {/* 운동 종목 */}
        <Section label="운동 종목">
          <button
            onClick={() => setShowSportPicker(true)}
            className={cn(
              'w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border transition-all',
              sport ? 'bg-[#3D4A10] border-[#C6F135] text-[#C6F135]' : 'bg-[#1A1A1A] border-[#2E2E2E] text-[#5A5A5A]'
            )}
          >
            <span className="flex items-center gap-2 font-medium">
              {sport ? (
                <>{SPORT_EMOJIS[sport]} {SPORT_LABELS[sport]}</>
              ) : (
                '종목을 선택하세요'
              )}
            </span>
            <ChevronDown size={18} />
          </button>
        </Section>

        {/* 모임 제목 */}
        <Section label="모임 제목">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예) 한강 저녁 러닝 같이해요"
            maxLength={30}
            className="w-full bg-[#1A1A1A] border border-[#2E2E2E] rounded-2xl px-4 py-3.5 text-white placeholder:text-[#5A5A5A] outline-none focus:border-[#C6F135] transition-colors"
          />
          <p className="text-right text-[#5A5A5A] text-xs mt-1.5">{title.length}/30</p>
        </Section>

        {/* 날짜 & 시간 */}
        <Section label="날짜 / 시간">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5A5A5A] pointer-events-none" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#2E2E2E] rounded-2xl pl-9 pr-3 py-3.5 text-white outline-none focus:border-[#C6F135] transition-colors [color-scheme:dark]"
              />
            </div>
            <div className="flex-1 relative">
              <Clock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5A5A5A] pointer-events-none" />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#2E2E2E] rounded-2xl pl-9 pr-3 py-3.5 text-white outline-none focus:border-[#C6F135] transition-colors [color-scheme:dark]"
              />
            </div>
          </div>
        </Section>

        {/* 장소 */}
        <Section label="장소">
          <div className="relative">
            <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5A5A5A] pointer-events-none" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="장소를 입력하세요"
              className="w-full bg-[#1A1A1A] border border-[#2E2E2E] rounded-2xl pl-9 pr-4 py-3.5 text-white placeholder:text-[#5A5A5A] outline-none focus:border-[#C6F135] transition-colors"
            />
          </div>
        </Section>

        {/* 모집 인원 */}
        <Section label="모집 인원">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setHeadcount((v) => Math.max(2, v - 1))}
              className="w-11 h-11 rounded-full bg-[#1A1A1A] border border-[#2E2E2E] text-white text-xl flex items-center justify-center active:scale-95 transition-transform"
            >
              −
            </button>
            <div className="flex-1 text-center">
              <span className="text-white text-2xl font-black" style={{ fontFamily: 'Inter, sans-serif' }}>
                {headcount}
              </span>
              <span className="text-[#A0A0A0] text-sm ml-1">명</span>
            </div>
            <button
              onClick={() => setHeadcount((v) => Math.min(maxAllowed, v + 1))}
              className="w-11 h-11 rounded-full bg-[#1A1A1A] border border-[#2E2E2E] text-white text-xl flex items-center justify-center active:scale-95 transition-transform"
            >
              +
            </button>
          </div>
          <p className="text-[#5A5A5A] text-xs text-center mt-2 flex items-center justify-center gap-1">
            <Info size={11} />
            현재 신뢰도 등급으로 최대 {maxAllowed}명까지 모집 가능
          </p>
        </Section>

        {/* 참가 조건 */}
        <Section label="참가 조건">
          {/* 레벨 범위 */}
          <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-2xl p-4 mb-3">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#A0A0A0] text-sm">운동 레벨 범위</span>
              <button
                onClick={() => setShowLevelPicker(true)}
                className="text-[#C6F135] text-xs font-medium"
              >
                변경
              </button>
            </div>
            <div className="flex items-center gap-2">
              {([1, 2, 3, 4, 5] as ExerciseLevel[]).map((lv) => (
                <div
                  key={lv}
                  className={cn(
                    'flex-1 py-2 rounded-xl text-center text-xs font-bold transition-all',
                    lv >= minLevel && lv <= maxLevel
                      ? 'text-[#0D0D0D]'
                      : 'bg-[#242424] text-[#5A5A5A]'
                  )}
                  style={
                    lv >= minLevel && lv <= maxLevel
                      ? { backgroundColor: LEVEL_COLORS[lv], color: '#0D0D0D' }
                      : {}
                  }
                >
                  Lv.{lv}
                </div>
              ))}
            </div>
            <p className="text-[#5A5A5A] text-xs text-center mt-2">
              Lv.{minLevel} {LEVEL_LABELS[minLevel]} ~ Lv.{maxLevel} {LEVEL_LABELS[maxLevel]}
            </p>
          </div>

          {/* 신뢰도 */}
          <button
            onClick={() => setShowTrustPicker(true)}
            className="w-full flex items-center justify-between px-4 py-3.5 bg-[#1A1A1A] border border-[#2E2E2E] rounded-2xl"
          >
            <span className="text-[#A0A0A0] text-sm">최소 신뢰도</span>
            <div className="flex items-center gap-1.5">
              <span className="text-white text-sm font-medium">
                {TRUST_SCORE_OPTIONS.find((o) => o.value === minTrust)?.label}
              </span>
              <ChevronDown size={15} className="text-[#5A5A5A]" />
            </div>
          </button>
        </Section>

        {/* 모임 소개 */}
        <Section label="모임 소개 (선택)">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="모임에 대해 자유롭게 소개해주세요"
            rows={4}
            maxLength={200}
            className="w-full bg-[#1A1A1A] border border-[#2E2E2E] rounded-2xl px-4 py-3.5 text-white placeholder:text-[#5A5A5A] outline-none focus:border-[#C6F135] transition-colors resize-none"
          />
          <p className="text-right text-[#5A5A5A] text-xs mt-1.5">{description.length}/200</p>
        </Section>
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-[#0D0D0D] border-t border-[#2E2E2E] px-5 py-4 pb-safe">
        <Button fullWidth size="lg" disabled={!isValid} onClick={handleSubmit}>
          모임 만들기
        </Button>
      </div>

      {/* 종목 선택 바텀시트 */}
      {showSportPicker && (
        <BottomSheet title="운동 종목 선택" onClose={() => setShowSportPicker(false)}>
          <div className="grid grid-cols-2 gap-3">
            {SPORT_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => { setSport(s); setShowSportPicker(false); }}
                className={cn(
                  'flex items-center gap-3 px-4 py-4 rounded-2xl border transition-all',
                  sport === s
                    ? 'bg-[#3D4A10] border-[#C6F135] text-[#C6F135]'
                    : 'bg-[#242424] border-[#2E2E2E] text-white'
                )}
              >
                <span className="text-2xl">{SPORT_EMOJIS[s]}</span>
                <span className="font-medium text-sm">{SPORT_LABELS[s]}</span>
              </button>
            ))}
          </div>
        </BottomSheet>
      )}

      {/* 레벨 범위 바텀시트 */}
      {showLevelPicker && (
        <BottomSheet title="레벨 범위 설정" onClose={() => setShowLevelPicker(false)}>
          <div className="mb-6">
            <p className="text-[#A0A0A0] text-sm mb-3">최소 레벨</p>
            <div className="flex gap-2">
              {([1, 2, 3, 4, 5] as ExerciseLevel[]).map((lv) => (
                <button
                  key={lv}
                  onClick={() => { setMinLevel(lv); if (lv > maxLevel) setMaxLevel(lv); }}
                  className="flex-1 py-3 rounded-xl text-sm font-bold transition-all border"
                  style={
                    minLevel === lv
                      ? { backgroundColor: LEVEL_COLORS[lv], color: '#0D0D0D', borderColor: LEVEL_COLORS[lv] }
                      : { backgroundColor: '#242424', color: '#A0A0A0', borderColor: '#2E2E2E' }
                  }
                >
                  Lv.{lv}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <p className="text-[#A0A0A0] text-sm mb-3">최대 레벨</p>
            <div className="flex gap-2">
              {([1, 2, 3, 4, 5] as ExerciseLevel[]).map((lv) => (
                <button
                  key={lv}
                  onClick={() => { setMaxLevel(lv); if (lv < minLevel) setMinLevel(lv); }}
                  className="flex-1 py-3 rounded-xl text-sm font-bold transition-all border"
                  style={
                    maxLevel === lv
                      ? { backgroundColor: LEVEL_COLORS[lv], color: '#0D0D0D', borderColor: LEVEL_COLORS[lv] }
                      : { backgroundColor: '#242424', color: '#A0A0A0', borderColor: '#2E2E2E' }
                  }
                >
                  Lv.{lv}
                </button>
              ))}
            </div>
          </div>
          <Button fullWidth onClick={() => setShowLevelPicker(false)}>확인</Button>
        </BottomSheet>
      )}

      {/* 신뢰도 바텀시트 */}
      {showTrustPicker && (
        <BottomSheet title="최소 신뢰도 설정" onClose={() => setShowTrustPicker(false)}>
          <div className="flex flex-col gap-2 mb-6">
            {TRUST_SCORE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { setMinTrust(opt.value); setShowTrustPicker(false); }}
                className={cn(
                  'w-full text-left px-5 py-4 rounded-2xl border transition-all',
                  minTrust === opt.value
                    ? 'bg-[#3D4A10] border-[#C6F135] text-[#C6F135] font-semibold'
                    : 'bg-[#242424] border-[#2E2E2E] text-white'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </BottomSheet>
      )}
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <p className="text-[#A0A0A0] text-xs font-medium uppercase tracking-wider mb-2.5">{label}</p>
      {children}
    </div>
  );
}

function BottomSheet({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-end z-50" onClick={onClose}>
      <div
        className="w-full max-w-[430px] mx-auto bg-[#1A1A1A] rounded-t-3xl px-5 pt-6 pb-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-[#3E3E3E] rounded-full mx-auto mb-5" />
        <h3 className="text-white font-black text-lg mb-5">{title}</h3>
        {children}
      </div>
    </div>
  );
}
