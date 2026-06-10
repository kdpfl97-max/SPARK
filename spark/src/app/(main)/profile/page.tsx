'use client';

import { useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { Settings } from 'lucide-react';
import LevelBadge from '@/components/ui/LevelBadge';
import TrustBadge from '@/components/ui/TrustBadge';
import { SPORT_EMOJIS, SPORT_LABELS, LEVEL_COLORS } from '@/lib/constants';
import { WorkoutRecord } from '@/types';
import { formatDate, formatTime, formatDistance, formatDuration } from '@/lib/utils';
import { DUMMY_WORKOUT_RECORDS } from '@/lib/dummy';

const MOCK_RECORDS: WorkoutRecord[] = DUMMY_WORKOUT_RECORDS;

const BADGES = [
  { emoji: '🏃', label: '러닝러' },
  { emoji: '💪', label: '3연속' },
  { emoji: '⭐', label: '첫인증' },
];

const MONTH_STATS = { count: 8, distance: 42.1 };

export default function ProfilePage() {
  const { user } = useUserStore();
  const [activeTab, setActiveTab] = useState<'feed' | 'stats'>('feed');

  if (!user) return null;

  const trustPercent = user.trustScore;

  return (
    <div className="min-h-dvh bg-[#0D0D0D]">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-5 pt-14 pb-4">
        <h1 className="text-white text-xl font-black">프로필</h1>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1A1A1A]">
          <Settings size={18} className="text-[#A0A0A0]" />
        </button>
      </header>

      {/* 유저 정보 */}
      <div className="px-5 pb-5">
        <div className="flex items-center gap-4 mb-5">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black"
            style={{ backgroundColor: `${LEVEL_COLORS[user.exerciseLevel]}20`, border: `2px solid ${LEVEL_COLORS[user.exerciseLevel]}` }}
          >
            {user.nickname[0]}
          </div>
          <div>
            <p className="text-white text-lg font-black">{user.nickname}</p>
            <div className="flex items-center gap-2 mt-1">
              <LevelBadge level={user.exerciseLevel} showDots />
            </div>
          </div>
        </div>

        {/* 신뢰도 */}
        <div className="bg-[#1A1A1A] rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#A0A0A0] text-sm">신뢰도</span>
            <TrustBadge grade={user.trustGrade} score={user.trustScore} />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-[#2E2E2E] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C6F135] rounded-full transition-all duration-500"
                style={{ width: `${trustPercent}%` }}
              />
            </div>
            <span className="text-[#C6F135] font-bold text-sm">{user.trustScore}점</span>
          </div>
          <div className="flex gap-4 mt-3 text-center">
            {[
              { label: '참가', value: user.joinCount },
              { label: '인증', value: user.certCount },
              { label: '노쇼', value: user.noshowCount },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-white font-bold">{value}</p>
                <p className="text-[#5A5A5A] text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 배지 */}
        <div className="flex gap-2 mb-4">
          {BADGES.map((b) => (
            <div key={b.label} className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl px-3 py-2 flex items-center gap-1.5">
              <span>{b.emoji}</span>
              <span className="text-white text-xs font-medium">{b.label}</span>
            </div>
          ))}
        </div>

        {/* 탭 */}
        <div className="flex bg-[#1A1A1A] rounded-xl p-1">
          {(['feed', 'stats'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                activeTab === tab ? 'bg-[#C6F135] text-[#0D0D0D]' : 'text-[#A0A0A0]'
              }`}
            >
              {tab === 'feed' ? '운동 피드' : '통계'}
            </button>
          ))}
        </div>
      </div>

      {/* 피드 탭 */}
      {activeTab === 'feed' && (
        <div className="px-5 flex flex-col gap-4 pb-8">
          {MOCK_RECORDS.map((record) => (
            <div key={record.id} className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-2xl overflow-hidden">
              {/* 카드 헤더 */}
              <div className="flex items-center justify-between px-4 pt-4 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{SPORT_EMOJIS[record.sportType]}</span>
                  <div>
                    <p className="text-white font-semibold text-sm">{SPORT_LABELS[record.sportType]}</p>
                    <p className="text-[#5A5A5A] text-xs">
                      {formatDate(record.startedAt)} {formatTime(record.startedAt)}
                    </p>
                  </div>
                </div>
                {record.meetupTitle && (
                  <span className="text-xs text-[#C6F135] bg-[#3D4A10] px-2.5 py-1 rounded-full">
                    👥 {record.meetupTitle}
                  </span>
                )}
                {!record.meetupTitle && (
                  <span className="text-xs text-[#A0A0A0] bg-[#242424] px-2.5 py-1 rounded-full">혼자</span>
                )}
              </div>

              {/* 인증 사진 자리 */}
              <div className="mx-4 h-48 bg-[#242424] rounded-xl flex items-center justify-center mb-3">
                <span className="text-4xl opacity-30">{SPORT_EMOJIS[record.sportType]}</span>
              </div>

              {/* 위치 + 미니맵 */}
              {record.location && (
                <div className="mx-4 mb-3">
                  <p className="text-[#A0A0A0] text-xs mb-1.5 flex items-center gap-1">
                    📍 {record.location.address}
                  </p>
                  <div className="h-20 bg-[#242424] rounded-xl flex items-center justify-center">
                    <span className="text-[#5A5A5A] text-xs">지도</span>
                  </div>
                </div>
              )}

              {/* 운동 기록 */}
              <div className="flex gap-4 px-4 py-3 border-t border-[#2E2E2E]">
                {record.distanceMeters && (
                  <div>
                    <p className="text-[#C6F135] font-bold text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {formatDistance(record.distanceMeters)}
                    </p>
                    <p className="text-[#5A5A5A] text-xs">거리</p>
                  </div>
                )}
                <div>
                  <p className="text-[#C6F135] font-bold text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {formatDuration(record.durationSeconds)}
                  </p>
                  <p className="text-[#5A5A5A] text-xs">시간</p>
                </div>
                {record.avgHeartRate && (
                  <div>
                    <p className="text-[#C6F135] font-bold text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {record.avgHeartRate}bpm
                    </p>
                    <p className="text-[#5A5A5A] text-xs">심박수</p>
                  </div>
                )}
                {record.calories && (
                  <div>
                    <p className="text-[#C6F135] font-bold text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {record.calories}kcal
                    </p>
                    <p className="text-[#5A5A5A] text-xs">칼로리</p>
                  </div>
                )}
              </div>

              {/* 코멘트 */}
              {record.comment && (
                <div className="px-4 pb-4">
                  <p className="text-white text-sm">{record.comment}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 통계 탭 */}
      {activeTab === 'stats' && (
        <div className="px-5 pb-8">
          {/* 기간 필터 */}
          <div className="flex gap-2 mb-5">
            {['주간', '월간', '연간', '전체'].map((p, i) => (
              <button
                key={p}
                className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${
                  i === 1 ? 'bg-[#C6F135] text-[#0D0D0D]' : 'bg-[#1A1A1A] text-[#A0A0A0]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* 총 요약 */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { icon: '🏃', label: '총 운동', value: '87회' },
              { icon: '⏱️', label: '총 시간', value: '142h' },
              { icon: '📏', label: '총 거리', value: '412km' },
              { icon: '🔥', label: '칼로리', value: '38,400' },
            ].map(({ icon, label, value }) => (
              <div key={label} className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-2xl p-4">
                <p className="text-2xl mb-1">{icon}</p>
                <p className="text-[#C6F135] font-black text-xl" style={{ fontFamily: 'Inter, sans-serif' }}>{value}</p>
                <p className="text-[#5A5A5A] text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* 이번달 요약 */}
          <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-2xl p-4 mb-5">
            <p className="text-[#A0A0A0] text-sm mb-3">이번 달</p>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-[#C6F135] font-black text-2xl" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {MONTH_STATS.count}회
                </p>
                <p className="text-[#5A5A5A] text-xs">운동</p>
              </div>
              <div className="w-px h-10 bg-[#2E2E2E]" />
              <div>
                <p className="text-[#C6F135] font-black text-2xl" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {MONTH_STATS.distance}km
                </p>
                <p className="text-[#5A5A5A] text-xs">거리</p>
              </div>
            </div>
          </div>

          {/* 종목별 비율 */}
          <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-2xl p-4 mb-5">
            <p className="text-white font-semibold mb-4">종목별 비율</p>
            {[
              { sport: 'running', percent: 45, count: 39 },
              { sport: 'gym', percent: 30, count: 26 },
              { sport: 'climbing', percent: 15, count: 13 },
              { sport: 'cycling', percent: 10, count: 9 },
            ].map(({ sport, percent, count }) => (
              <div key={sport} className="flex items-center gap-3 mb-3">
                <span className="text-base w-6">{SPORT_EMOJIS[sport as keyof typeof SPORT_EMOJIS]}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-[#A0A0A0] text-xs">{SPORT_LABELS[sport as keyof typeof SPORT_LABELS]}</span>
                    <span className="text-[#A0A0A0] text-xs">{count}회</span>
                  </div>
                  <div className="h-1.5 bg-[#2E2E2E] rounded-full overflow-hidden">
                    <div className="h-full bg-[#C6F135] rounded-full" style={{ width: `${percent}%` }} />
                  </div>
                </div>
                <span className="text-[#C6F135] text-xs font-bold w-8 text-right">{percent}%</span>
              </div>
            ))}
          </div>

          {/* 모임 통계 */}
          <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-2xl p-4 mb-5">
            <p className="text-white font-semibold mb-4">모임 통계</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: '총 참가 모임', value: '12회' },
                { label: '주최한 모임', value: '3회' },
                { label: '출석률', value: '91%' },
                { label: '평균 평점', value: '⭐ 4.8' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-[#242424] rounded-xl p-3">
                  <p className="text-[#C6F135] font-bold text-lg">{value}</p>
                  <p className="text-[#5A5A5A] text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 개인 베스트 */}
          <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-2xl p-4">
            <p className="text-white font-semibold mb-4">개인 기록 베스트</p>
            {[
              { icon: '🏃', label: '최장 거리', value: '21.1km' },
              { icon: '⚡', label: '최고 페이스', value: "4'32\"/km" },
              { icon: '⏱️', label: '최장 운동', value: '2h 40m' },
              { icon: '🔥', label: '최장 연속', value: '14일' },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex items-center justify-between py-3 border-b border-[#2E2E2E] last:border-0">
                <div className="flex items-center gap-2">
                  <span>{icon}</span>
                  <span className="text-[#A0A0A0] text-sm">{label}</span>
                </div>
                <span className="text-white font-bold text-sm">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
