'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { Meetup, Participant } from '@/types';
import {
  SPORT_EMOJIS,
  SPORT_LABELS,
  LEVEL_COLORS,
} from '@/lib/constants';
import { formatDate, formatTime, formatDistance } from '@/lib/utils';
import LevelBadge from '@/components/ui/LevelBadge';
import TrustBadge from '@/components/ui/TrustBadge';
import Button from '@/components/ui/Button';
import {
  ChevronLeft,
  MapPin,
  Clock,
  Users,
  MoreHorizontal,
  Flag,
  CheckCircle2,
  XCircle,
  Share2,
  Play,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DUMMY_MEETUPS } from '@/lib/dummy';

const MOCK_MEETUPS: Record<string, Meetup & { participants: Participant[] }> = Object.fromEntries(
  DUMMY_MEETUPS.map((m) => [m.id, m as Meetup & { participants: Participant[] }])
);

export default function MeetupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUserStore();
  const id = params.id as string;

  const meetup = MOCK_MEETUPS[id];
  const [isJoined, setIsJoined] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showJoinConfirm, setShowJoinConfirm] = useState(false);

  if (!meetup) {
    return (
      <div className="min-h-dvh bg-[#0D0D0D] flex items-center justify-center">
        <p className="text-[#A0A0A0]">모임을 찾을 수 없어요</p>
      </div>
    );
  }

  const isHost = user?.id === meetup.hostId;
  const isFull = meetup.currentParticipants >= meetup.maxParticipants;
  const meetsLevel = user ? user.exerciseLevel >= meetup.minLevel && user.exerciseLevel <= meetup.maxLevel : false;
  const meetsTrust = user ? user.trustScore >= meetup.minTrustScore : false;
  const canJoin = meetsLevel && meetsTrust && !isFull && !isJoined && !isHost;

  const handleJoin = () => {
    if (!canJoin) return;
    setShowJoinConfirm(false);
    setIsJoined(true);
  };

  const hostGrade = meetup.host?.trustGrade ?? 'sprout';

  return (
    <div className="min-h-dvh bg-[#0D0D0D] flex flex-col">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-5 pt-14 pb-4">
        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1A1A1A]">
          <ChevronLeft size={20} className="text-white" />
        </button>
        <div className="flex items-center gap-1.5">
          <span className="text-lg">{SPORT_EMOJIS[meetup.sportType]}</span>
          <span className="text-white font-semibold text-sm">{SPORT_LABELS[meetup.sportType]}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1A1A1A]">
            <Share2 size={18} className="text-white" />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowMenu((v) => !v)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1A1A1A]"
            >
              <MoreHorizontal size={18} className="text-white" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-12 bg-[#242424] border border-[#3E3E3E] rounded-2xl overflow-hidden z-10 w-36">
                <button className="w-full flex items-center gap-2 px-4 py-3 text-[#F87171] text-sm hover:bg-[#2E2E2E]">
                  <Flag size={15} /> 신고하기
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-5 pb-32">
        {/* 제목 및 기본 정보 */}
        <div className="mb-5">
          <h1 className="text-white text-2xl font-black mb-4">{meetup.title}</h1>

          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-[#A0A0A0] text-sm">
              <MapPin size={15} className="text-[#C6F135] flex-shrink-0" />
              <span>{meetup.location.address}</span>
              {meetup.distanceMeters !== undefined && (
                <span className="text-[#C6F135] text-xs ml-auto flex-shrink-0">
                  {formatDistance(meetup.distanceMeters)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[#A0A0A0] text-sm">
              <Clock size={15} className="text-[#C6F135] flex-shrink-0" />
              <span>{formatDate(meetup.scheduledAt)} {formatTime(meetup.scheduledAt)}</span>
            </div>
            <div className="flex items-center gap-2 text-[#A0A0A0] text-sm">
              <Users size={15} className="text-[#C6F135] flex-shrink-0" />
              <span>
                {meetup.currentParticipants + (isJoined ? 1 : 0)}/{meetup.maxParticipants}명 참가중
              </span>
              {isFull ? (
                <span className="ml-auto text-xs text-[#F87171] bg-[#2A1010] px-2 py-0.5 rounded-full">마감</span>
              ) : (
                <span className="ml-auto text-xs text-[#C6F135] bg-[#3D4A10] px-2 py-0.5 rounded-full">
                  {meetup.maxParticipants - meetup.currentParticipants - (isJoined ? 1 : 0)}자리 남음
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 지도 자리 */}
        <div className="h-44 bg-[#1A1A1A] border border-[#2E2E2E] rounded-2xl flex items-center justify-center mb-5">
          <div className="text-center">
            <p className="text-4xl mb-2">🗺️</p>
            <p className="text-[#5A5A5A] text-xs">카카오맵 연동 예정</p>
          </div>
        </div>

        {/* 참가 조건 */}
        <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-2xl p-4 mb-4">
          <p className="text-white font-semibold text-sm mb-3">참가 조건</p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[#A0A0A0] text-sm">운동 레벨</span>
              <div className="flex items-center gap-1.5">
                <LevelBadge level={meetup.minLevel} />
                <span className="text-[#5A5A5A] text-xs">~</span>
                <LevelBadge level={meetup.maxLevel} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#A0A0A0] text-sm">최소 신뢰도</span>
              <span className="text-sm font-medium" style={{ color: meetup.minTrustScore === 0 ? '#4ADE80' : '#A0A0A0' }}>
                {meetup.minTrustScore === 0 ? '누구나 가능' : `${meetup.minTrustScore}점 이상`}
              </span>
            </div>
          </div>

          {/* 내 조건 충족 여부 */}
          {user && !isHost && (
            <div className="mt-3 pt-3 border-t border-[#2E2E2E] flex flex-col gap-1.5">
              <p className="text-[#5A5A5A] text-xs mb-1">내 조건</p>
              <div className="flex items-center gap-2">
                {meetsLevel ? (
                  <CheckCircle2 size={15} className="text-[#4ADE80]" />
                ) : (
                  <XCircle size={15} className="text-[#F87171]" />
                )}
                <span className={cn('text-sm', meetsLevel ? 'text-[#4ADE80]' : 'text-[#F87171]')}>
                  레벨 조건 {meetsLevel ? '충족' : '미충족'} (내 레벨: Lv.{user.exerciseLevel})
                </span>
              </div>
              <div className="flex items-center gap-2">
                {meetsTrust ? (
                  <CheckCircle2 size={15} className="text-[#4ADE80]" />
                ) : (
                  <XCircle size={15} className="text-[#F87171]" />
                )}
                <span className={cn('text-sm', meetsTrust ? 'text-[#4ADE80]' : 'text-[#F87171]')}>
                  신뢰도 조건 {meetsTrust ? '충족' : '미충족'} (내 신뢰도: {user.trustScore}점)
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 참가자 */}
        <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-2xl p-4 mb-4">
          <p className="text-white font-semibold text-sm mb-3">참가자</p>
          <div className="flex flex-wrap gap-2">
            {meetup.participants.map((p) => (
              <div key={p.id} className="flex items-center gap-2 bg-[#242424] rounded-xl px-3 py-2">
                <div className="w-7 h-7 rounded-full bg-[#3D4A10] flex items-center justify-center text-xs font-bold text-[#C6F135]">
                  {p.nickname[0]}
                </div>
                <span className="text-white text-sm">{p.nickname}</span>
                {p.isHost && (
                  <span className="text-[#C6F135] text-xs bg-[#3D4A10] px-1.5 py-0.5 rounded-full">호스트</span>
                )}
              </div>
            ))}
            {isJoined && (
              <div className="flex items-center gap-2 bg-[#3D4A10] border border-[#C6F135]/30 rounded-xl px-3 py-2">
                <div className="w-7 h-7 rounded-full bg-[#C6F135] flex items-center justify-center text-xs font-bold text-[#0D0D0D]">
                  나
                </div>
                <span className="text-[#C6F135] text-sm">나</span>
              </div>
            )}
          </div>
        </div>

        {/* 모임 소개 */}
        {meetup.description && (
          <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-2xl p-4 mb-4">
            <p className="text-white font-semibold text-sm mb-2">모임 소개</p>
            <p className="text-[#A0A0A0] text-sm leading-relaxed">{meetup.description}</p>
          </div>
        )}

        {/* 모임장 정보 */}
        {meetup.host && (
          <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-2xl p-4">
            <p className="text-white font-semibold text-sm mb-3">모임장</p>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-black"
                style={{
                  backgroundColor: `${LEVEL_COLORS[meetup.host.exerciseLevel]}20`,
                  border: `2px solid ${LEVEL_COLORS[meetup.host.exerciseLevel]}`,
                }}
              >
                {meetup.host.nickname[0]}
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold">{meetup.host.nickname}</p>
                <div className="flex items-center gap-2 mt-1">
                  <LevelBadge level={meetup.host.exerciseLevel} />
                  <TrustBadge grade={hostGrade} score={meetup.host.trustScore} />
                </div>
              </div>
              <div className="text-right">
                <p className="text-[#5A5A5A] text-xs">노쇼</p>
                <p className="text-white font-bold text-sm">{meetup.host.noshowCount}회</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-[#0D0D0D] border-t border-[#2E2E2E] px-5 py-4 pb-safe">
        {isHost ? (
          <Button fullWidth size="lg">
            <Play size={18} className="mr-2" fill="currentColor" />
            모임 운동 시작
          </Button>
        ) : isJoined ? (
          <div className="flex gap-3">
            <Button fullWidth size="lg" variant="ghost" onClick={() => setIsJoined(false)}>
              참가 취소
            </Button>
            <Button fullWidth size="lg">
              <Play size={18} className="mr-2" fill="currentColor" />
              운동 시작
            </Button>
          </div>
        ) : (
          <Button
            fullWidth
            size="lg"
            disabled={!canJoin}
            onClick={() => setShowJoinConfirm(true)}
          >
            {isFull ? '모집 마감' : !meetsLevel ? '레벨 조건 미충족' : !meetsTrust ? '신뢰도 조건 미충족' : '참가 신청하기'}
          </Button>
        )}
      </div>

      {/* 참가 확인 모달 */}
      {showJoinConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-end z-50">
          <div className="w-full max-w-[430px] mx-auto bg-[#1A1A1A] rounded-t-3xl px-5 pt-6 pb-10">
            <div className="w-10 h-1 bg-[#3E3E3E] rounded-full mx-auto mb-6" />
            <h3 className="text-white text-xl font-black mb-1">참가 신청하기</h3>
            <p className="text-[#A0A0A0] text-sm mb-6">{meetup.title}</p>
            <div className="bg-[#242424] rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-between py-2">
                <span className="text-[#A0A0A0] text-sm">📅 일시</span>
                <span className="text-white text-sm font-medium">
                  {formatDate(meetup.scheduledAt)} {formatTime(meetup.scheduledAt)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-t border-[#2E2E2E]">
                <span className="text-[#A0A0A0] text-sm">📍 장소</span>
                <span className="text-white text-sm font-medium">{meetup.location.district}</span>
              </div>
            </div>
            <p className="text-[#5A5A5A] text-xs text-center mb-6">
              노쇼 시 신뢰도 -20점이 차감됩니다
            </p>
            <div className="flex gap-3">
              <Button fullWidth variant="ghost" onClick={() => setShowJoinConfirm(false)}>
                취소
              </Button>
              <Button fullWidth onClick={handleJoin}>
                확인
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
