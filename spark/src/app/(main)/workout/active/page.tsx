'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useWorkoutTimer } from '@/hooks/useWorkoutTimer';
import { SportType } from '@/types';
import { SPORT_EMOJIS, SPORT_LABELS } from '@/lib/constants';
import { Pause, Play, Square, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const MOCK_MEMBERS = [
  { id: 'user-2', nickname: '박운동', distanceMeters: 0, color: '#C6F135' },
  { id: 'user-3', nickname: '김*준', distanceMeters: 0, color: '#60A5FA' },
  { id: 'user-4', nickname: '이*현', distanceMeters: 0, color: '#F87171' },
];

// 멤버 경로 시뮬레이션 포인트 (지도 자리에 표시할 위치)
const ROUTE_POINTS = [
  { x: 50, y: 70 }, { x: 52, y: 65 }, { x: 55, y: 60 },
  { x: 58, y: 56 }, { x: 62, y: 52 }, { x: 65, y: 49 },
  { x: 68, y: 47 }, { x: 72, y: 45 }, { x: 75, y: 44 },
];

export default function WorkoutActivePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sport = (searchParams.get('sport') as SportType) ?? 'running';
  const isSolo = searchParams.get('solo') === 'true';

  const { stats, formatElapsed, start, pause, resume, stop } = useWorkoutTimer();
  const [showStopConfirm, setShowStopConfirm] = useState(false);
  const [statsExpanded, setStatsExpanded] = useState(false);
  const [routeProgress, setRouteProgress] = useState(0);
  const [members, setMembers] = useState(MOCK_MEMBERS);
  const startedRef = useRef(false);

  // 자동 시작
  useEffect(() => {
    if (!startedRef.current) {
      startedRef.current = true;
      setTimeout(() => start(), 800);
    }
  }, [start]);

  // 경로 진행 시뮬레이션
  useEffect(() => {
    if (stats.status !== 'running') return;
    const interval = setInterval(() => {
      setRouteProgress((p) => Math.min(p + 1, ROUTE_POINTS.length - 1));
      setMembers((prev) =>
        prev.map((m) => ({
          ...m,
          distanceMeters: m.distanceMeters + 2.2 + Math.random() * 0.8,
        }))
      );
    }, 2000);
    return () => clearInterval(interval);
  }, [stats.status]);

  const handleStop = () => {
    stop();
    setShowStopConfirm(false);
    router.push(
      `/workout/complete?sport=${sport}&elapsed=${stats.elapsedSeconds}&distance=${Math.floor(stats.distanceMeters)}&calories=${stats.calories}&heartRate=${stats.avgHeartRate}&solo=${isSolo}`
    );
  };

  const formatDist = (m: number) => {
    if (m < 1000) return `${Math.floor(m)}m`;
    return `${(m / 1000).toFixed(2)}km`;
  };

  const currentPoint = ROUTE_POINTS[routeProgress];
  const isRunning = stats.status === 'running';
  const isPaused = stats.status === 'paused';

  return (
    <div className="min-h-dvh bg-[#0D0D0D] flex flex-col overflow-hidden">

      {/* 상태 바 */}
      <div className="flex items-center justify-between px-5 pt-12 pb-3 z-10">
        <div className="flex items-center gap-2">
          <span className="text-xl">{SPORT_EMOJIS[sport]}</span>
          <span className="text-white font-semibold text-sm">{SPORT_LABELS[sport]}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              'w-2 h-2 rounded-full',
              isRunning ? 'bg-[#C6F135] animate-pulse' : isPaused ? 'bg-[#FACC15]' : 'bg-[#5A5A5A]'
            )}
          />
          <span className={cn('text-xs font-medium', isRunning ? 'text-[#C6F135]' : 'text-[#FACC15]')}>
            {isRunning ? '운동 중' : '일시정지'}
          </span>
        </div>
      </div>

      {/* 메인 타이머 */}
      <div className="text-center px-5 pb-4">
        <p
          className="text-white font-black leading-none tabular-nums"
          style={{ fontSize: '64px', fontFamily: 'Inter, sans-serif', letterSpacing: '-2px' }}
        >
          {formatElapsed(stats.elapsedSeconds)}
        </p>
        <p className="text-[#5A5A5A] text-sm mt-1">경과 시간</p>
      </div>

      {/* 핵심 지표 */}
      <div className="grid grid-cols-3 gap-3 px-5 mb-4">
        <StatCard
          label="거리"
          value={formatDist(stats.distanceMeters)}
          highlight
        />
        <StatCard
          label="페이스"
          value={stats.pace}
          unit="/km"
        />
        <StatCard
          label="칼로리"
          value={String(stats.calories)}
          unit="kcal"
        />
      </div>

      {/* 지도 영역 */}
      <div className="flex-1 mx-5 mb-4 rounded-3xl overflow-hidden relative bg-[#141414] border border-[#2E2E2E]" style={{ minHeight: '220px' }}>

        {/* 격자 배경 (지도 느낌) */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#C6F135" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* 도로 시뮬레이션 */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* 도로 */}
          <path d="M 20 80 Q 35 70 50 70 Q 65 70 80 55 Q 88 48 90 40" stroke="#2E2E2E" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M 10 60 Q 25 55 40 50 Q 55 45 60 35" stroke="#2E2E2E" strokeWidth="3" fill="none" strokeLinecap="round" />

          {/* 이동 경로 */}
          {routeProgress > 0 && (
            <polyline
              points={ROUTE_POINTS.slice(0, routeProgress + 1).map(p => `${p.x},${p.y}`).join(' ')}
              stroke="#C6F135"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* 내 위치 핀 */}
          <circle cx={currentPoint.x} cy={currentPoint.y} r="3.5" fill="#C6F135" />
          <circle cx={currentPoint.x} cy={currentPoint.y} r="6" fill="#C6F135" opacity="0.3" />

          {/* 모임 멤버 위치 (solo가 아닐 때) */}
          {!isSolo && members.map((m, i) => {
            const offset = i * 2;
            const memberProgress = Math.max(0, routeProgress - 1 - i);
            const mp = ROUTE_POINTS[Math.min(memberProgress, ROUTE_POINTS.length - 1)];
            return (
              <g key={m.id}>
                <circle cx={mp.x - offset} cy={mp.y + offset * 0.5} r="2.5" fill={m.color} opacity="0.9" />
                <circle cx={mp.x - offset} cy={mp.y + offset * 0.5} r="5" fill={m.color} opacity="0.2" />
              </g>
            );
          })}
        </svg>

        {/* 지도 레이블 */}
        <div className="absolute top-3 left-3 bg-[#0D0D0D]/80 px-2.5 py-1.5 rounded-lg">
          <p className="text-[#A0A0A0] text-xs">📍 성수동 한강변</p>
        </div>

        {/* 확장 버튼 */}
        <button
          onClick={() => setStatsExpanded((v) => !v)}
          className="absolute bottom-3 right-3 w-8 h-8 bg-[#1A1A1A]/90 rounded-full flex items-center justify-center"
        >
          {statsExpanded ? <ChevronDown size={14} className="text-[#A0A0A0]" /> : <ChevronUp size={14} className="text-[#A0A0A0]" />}
        </button>
      </div>

      {/* 추가 지표 (확장) */}
      {statsExpanded && (
        <div className="grid grid-cols-2 gap-3 px-5 mb-4">
          <StatCard label="심박수" value={String(stats.avgHeartRate)} unit="bpm" icon="❤️" />
          <StatCard label="평균 페이스" value={stats.pace} unit="/km" icon="⚡" />
        </div>
      )}

      {/* 모임 멤버 현황 (solo가 아닐 때) */}
      {!isSolo && (
        <div className="mx-5 mb-4 bg-[#1A1A1A] border border-[#2E2E2E] rounded-2xl p-3">
          <p className="text-[#A0A0A0] text-xs font-medium mb-2.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#C6F135] rounded-full" />
            함께 운동 중 {members.length + 1}명
          </p>
          <div className="flex flex-col gap-2">
            {/* 내 위치 */}
            <MemberRow
              nickname="나"
              distance={stats.distanceMeters}
              color="#C6F135"
              isMe
            />
            {members.map((m) => (
              <MemberRow
                key={m.id}
                nickname={m.nickname}
                distance={m.distanceMeters}
                color={m.color}
              />
            ))}
          </div>
        </div>
      )}

      {/* 컨트롤 버튼 */}
      <div className="px-5 pb-10">
        <div className="flex items-center justify-center gap-6">
          {/* 일시정지 / 재개 */}
          <button
            onClick={isRunning ? pause : resume}
            className="w-16 h-16 rounded-full bg-[#1A1A1A] border border-[#3E3E3E] flex items-center justify-center active:scale-95 transition-transform"
          >
            {isRunning ? (
              <Pause size={24} className="text-white" />
            ) : (
              <Play size={24} className="text-white" fill="white" />
            )}
          </button>

          {/* 종료 버튼 */}
          <button
            onClick={() => setShowStopConfirm(true)}
            className="w-20 h-20 rounded-full bg-[#F87171] flex items-center justify-center shadow-lg shadow-[#F8717140] active:scale-95 transition-transform"
          >
            <Square size={28} className="text-white" fill="white" />
          </button>

          {/* 번개 모임 열기 (solo일 때만) */}
          {isSolo && (
            <button
              onClick={() => router.push(`/meetup/create?sport=${sport}`)}
              className="w-16 h-16 rounded-full bg-[#1A1A1A] border border-[#3E3E3E] flex items-center justify-center active:scale-95 transition-transform"
            >
              <Zap size={22} className="text-[#C6F135]" />
            </button>
          )}

          {/* solo가 아닐 때 빈 자리 채우기 */}
          {!isSolo && <div className="w-16 h-16" />}
        </div>

        <p className="text-center text-[#5A5A5A] text-xs mt-3">
          {isRunning ? (isSolo ? '⚡ 번개 모임으로 전환 가능' : '멤버들의 위치가 실시간 업데이트돼요') : '일시정지 중'}
        </p>
      </div>

      {/* 종료 확인 모달 */}
      {showStopConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-end z-50">
          <div className="w-full max-w-[430px] mx-auto bg-[#1A1A1A] rounded-t-3xl px-5 pt-6 pb-10">
            <div className="w-10 h-1 bg-[#3E3E3E] rounded-full mx-auto mb-6" />
            <h3 className="text-white text-xl font-black mb-1">운동을 종료할까요?</h3>
            <p className="text-[#A0A0A0] text-sm mb-6">지금까지의 기록이 저장됩니다</p>

            {/* 현재 기록 요약 */}
            <div className="bg-[#242424] rounded-2xl p-4 mb-6 grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-[#C6F135] font-black text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {formatElapsed(stats.elapsedSeconds)}
                </p>
                <p className="text-[#5A5A5A] text-xs">시간</p>
              </div>
              <div>
                <p className="text-[#C6F135] font-black text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {formatDist(stats.distanceMeters)}
                </p>
                <p className="text-[#5A5A5A] text-xs">거리</p>
              </div>
              <div>
                <p className="text-[#C6F135] font-black text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {stats.calories}
                </p>
                <p className="text-[#5A5A5A] text-xs">kcal</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowStopConfirm(false)}
                className="flex-1 py-4 rounded-full bg-[#242424] text-white font-semibold text-base active:scale-95 transition-transform"
              >
                계속하기
              </button>
              <button
                onClick={handleStop}
                className="flex-1 py-4 rounded-full bg-[#F87171] text-white font-semibold text-base active:scale-95 transition-transform"
              >
                종료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  unit,
  icon,
  highlight,
}: {
  label: string;
  value: string;
  unit?: string;
  icon?: string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-2xl px-4 py-3">
      <p className="text-[#5A5A5A] text-xs mb-1 flex items-center gap-1">
        {icon && <span>{icon}</span>}
        {label}
      </p>
      <div className="flex items-baseline gap-1">
        <span
          className={cn('font-black text-xl tabular-nums', highlight ? 'text-[#C6F135]' : 'text-white')}
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {value}
        </span>
        {unit && <span className="text-[#5A5A5A] text-xs">{unit}</span>}
      </div>
    </div>
  );
}

function MemberRow({
  nickname,
  distance,
  color,
  isMe,
}: {
  nickname: string;
  distance: number;
  color: string;
  isMe?: boolean;
}) {
  const formatDist = (m: number) => {
    if (m < 1000) return `${Math.floor(m)}m`;
    return `${(m / 1000).toFixed(2)}km`;
  };

  return (
    <div className="flex items-center gap-2.5">
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
        style={{ backgroundColor: `${color}20`, border: `1.5px solid ${color}`, color }}
      >
        {nickname[0]}
      </div>
      <span className={cn('text-sm flex-1', isMe ? 'text-white font-semibold' : 'text-[#A0A0A0]')}>
        {nickname}
      </span>
      <div className="flex items-center gap-1.5">
        <div className="w-16 h-1 bg-[#2E2E2E] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${Math.min(100, (distance / 5000) * 100)}%`, backgroundColor: color }}
          />
        </div>
        <span className="text-xs font-bold tabular-nums" style={{ color, fontFamily: 'Inter, sans-serif', minWidth: '40px', textAlign: 'right' }}>
          {formatDist(distance)}
        </span>
      </div>
    </div>
  );
}
