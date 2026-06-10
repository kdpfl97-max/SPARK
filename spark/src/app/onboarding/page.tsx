'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { ExerciseLevel, SportType } from '@/types';
import { SPORT_LABELS, SPORT_EMOJIS, LEVEL_LABELS, LEVEL_COLORS } from '@/lib/constants';
import { signInWithGoogle, signInWithKakao } from '@/lib/api/auth';
import Button from '@/components/ui/Button';
import { ChevronRight, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = 5; // 로그인 + 닉네임 + 설문 3단계 + 결과

const FREQUENCY_OPTIONS = [
  { value: 1, label: '거의 안 해요' },
  { value: 2, label: '한 달에 1~3번' },
  { value: 3, label: '주 1~2회' },
  { value: 4, label: '주 3~5회' },
  { value: 5, label: '매일' },
];

const SPORT_OPTIONS: SportType[] = ['running', 'gym', 'climbing', 'cycling', 'swimming', 'soccer', 'tennis'];

const CAREER_OPTIONS = [
  { value: 1, label: '6개월 미만' },
  { value: 2, label: '6개월~1년' },
  { value: 3, label: '1~3년' },
  { value: 4, label: '3년 이상' },
];

const GOAL_OPTIONS = [
  { value: 1, label: '건강 관리' },
  { value: 2, label: '다이어트' },
  { value: 3, label: '체력 향상' },
  { value: 4, label: '대회/기록 도전' },
];

function calcLevel(freq: number, career: number, goal: number): ExerciseLevel {
  const score = freq + career + (goal === 4 ? 2 : 0);
  if (score <= 3) return 1;
  if (score <= 5) return 2;
  if (score <= 7) return 3;
  if (score <= 9) return 4;
  return 5;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { completeOnboarding } = useUserStore();

  const [step, setStep] = useState(1);
  const [nickname, setNickname] = useState('');
  const [frequency, setFrequency] = useState<number | null>(null);
  const [sports, setSports] = useState<SportType[]>([]);
  const [career, setCareer] = useState<number | null>(null);
  const [goal, setGoal] = useState<number | null>(null);
  const [resultLevel, setResultLevel] = useState<ExerciseLevel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleSport = (sport: SportType) => {
    setSports((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]
    );
  };

  const handleNext = async () => {
    if (step === 4 && frequency && career && goal) {
      const level = calcLevel(frequency, career, goal);
      setResultLevel(level);
      setStep(5);
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleStart = async () => {
    if (!resultLevel) return;
    setIsLoading(true);
    setError('');
    try {
      await completeOnboarding(nickname || '운동러', resultLevel);
      router.replace('/home');
    } catch (e) {
      setError('저장 중 오류가 발생했어요. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const canNext =
    (step === 1) ||
    (step === 2 && nickname.trim().length >= 2) ||
    (step === 3 && frequency !== null && sports.length > 0) ||
    (step === 4 && career !== null && goal !== null);

  // step 1: 소셜 로그인
  if (step === 1) {
    return (
      <div className="min-h-dvh bg-[#0D0D0D] flex flex-col items-center justify-between px-6 pt-24 pb-16">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap size={40} className="text-[#C6F135]" fill="#C6F135" />
            <span className="text-[#C6F135] text-5xl font-black tracking-tight">SPARK</span>
          </div>
          <p className="text-[#A0A0A0] text-base leading-relaxed">
            동네에서 지금 당장<br />같이 운동할 사람 찾기
          </p>
        </div>

        <div className="w-full flex flex-col gap-3">
          {error && <p className="text-[#F87171] text-sm text-center">{error}</p>}

          <button
            onClick={() => setError('소셜 로그인은 추후 업데이트를 통해 제공될 예정입니다.')}
            className="w-full flex items-center justify-center gap-3 bg-white text-[#0D0D0D] font-semibold py-4 rounded-full active:scale-95 transition-transform"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google로 시작하기
          </button>

          <button
            onClick={() => setError('소셜 로그인은 추후 업데이트를 통해 제공될 예정입니다.')}
            className="w-full flex items-center justify-center gap-3 bg-[#FEE500] text-[#191919] font-semibold py-4 rounded-full active:scale-95 transition-transform"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#191919">
              <path d="M12 3C6.48 3 2 6.58 2 11c0 2.85 1.67 5.36 4.24 6.87l-.93 3.42 3.94-2.39C10.35 19.27 11.16 19.4 12 19.4c5.52 0 10-3.58 10-8.4S17.52 3 12 3z"/>
            </svg>
            카카오로 시작하기
          </button>

          <button
            onClick={() => setStep(2)}
            className="text-[#5A5A5A] text-sm text-center py-2"
          >
            로그인 없이 둘러보기
          </button>
        </div>
      </div>
    );
  }

  // step 5: 레벨 결과
  if (step === 5 && resultLevel) {
    return (
      <div className="min-h-dvh bg-[#0D0D0D] flex flex-col items-center justify-center px-6 text-center">
        <p className="text-[#A0A0A0] text-base mb-6">운동 레벨 측정 완료</p>
        <div
          className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: `${LEVEL_COLORS[resultLevel]}20`, border: `2px solid ${LEVEL_COLORS[resultLevel]}` }}
        >
          <span className="text-5xl font-black" style={{ color: LEVEL_COLORS[resultLevel] }}>{resultLevel}</span>
        </div>
        <p className="text-white text-3xl font-black mb-2">Lv.{resultLevel}</p>
        <p className="text-2xl font-bold mb-4" style={{ color: LEVEL_COLORS[resultLevel] }}>
          {LEVEL_LABELS[resultLevel]}
        </p>
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} className="w-3 h-3 rounded-full"
              style={{ backgroundColor: i <= resultLevel ? LEVEL_COLORS[resultLevel] : '#2E2E2E' }} />
          ))}
        </div>
        <p className="text-[#A0A0A0] text-sm leading-relaxed mb-10">
          신뢰도는 활동하면서<br />함께 쌓아가요!
        </p>
        {error && <p className="text-[#F87171] text-sm mb-4">{error}</p>}
        <Button fullWidth size="lg" onClick={handleStart} disabled={isLoading}>
          {isLoading ? '저장 중...' : 'SPARK 시작하기 ⚡'}
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#0D0D0D] flex flex-col px-6 pt-16 pb-10">
      {/* 진행 바 */}
      <div className="flex gap-1.5 mb-10">
        {Array.from({ length: STEPS - 1 }).map((_, i) => (
          <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{ backgroundColor: i < step - 1 ? '#C6F135' : '#2E2E2E' }} />
        ))}
      </div>

      <div className="flex-1">
        {/* Step 2: 닉네임 */}
        {step === 2 && (
          <>
            <p className="text-[#A0A0A0] text-sm mb-2">Step 1/4</p>
            <h2 className="text-white text-2xl font-black mb-8">어떻게 불러드릴까요?</h2>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임 입력 (2자 이상)"
              maxLength={10}
              autoFocus
              className="w-full bg-[#1A1A1A] border border-[#2E2E2E] rounded-2xl px-4 py-4 text-white text-lg placeholder:text-[#5A5A5A] outline-none focus:border-[#C6F135] transition-colors"
            />
            <p className="text-right text-[#5A5A5A] text-xs mt-2">{nickname.length}/10</p>
          </>
        )}

        {/* Step 3: 운동 빈도 + 종목 */}
        {step === 3 && (
          <>
            <p className="text-[#A0A0A0] text-sm mb-2">Step 2/4</p>
            <h2 className="text-white text-2xl font-black mb-6">운동 습관을 알려주세요</h2>
            <p className="text-[#A0A0A0] text-sm mb-3">운동 빈도</p>
            <div className="flex flex-col gap-2 mb-6">
              {FREQUENCY_OPTIONS.map((opt) => (
                <button key={opt.value} onClick={() => setFrequency(opt.value)}
                  className={cn('w-full text-left px-5 py-3.5 rounded-2xl border transition-all font-medium text-sm',
                    frequency === opt.value ? 'bg-[#3D4A10] border-[#C6F135] text-[#C6F135]' : 'bg-[#1A1A1A] border-[#2E2E2E] text-white')}>
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="text-[#A0A0A0] text-sm mb-3">주요 운동 종목 (복수 선택)</p>
            <div className="grid grid-cols-2 gap-2">
              {SPORT_OPTIONS.map((sport) => (
                <button key={sport} onClick={() => toggleSport(sport)}
                  className={cn('flex items-center gap-2 px-4 py-3 rounded-2xl border transition-all text-sm',
                    sports.includes(sport) ? 'bg-[#3D4A10] border-[#C6F135] text-[#C6F135]' : 'bg-[#1A1A1A] border-[#2E2E2E] text-white')}>
                  <span>{SPORT_EMOJIS[sport]}</span>
                  <span className="font-medium">{SPORT_LABELS[sport]}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Step 4: 경력 + 목표 */}
        {step === 4 && (
          <>
            <p className="text-[#A0A0A0] text-sm mb-2">Step 3/4</p>
            <h2 className="text-white text-2xl font-black mb-6">경력과 목표를 알려주세요</h2>
            <p className="text-[#A0A0A0] text-sm mb-3">운동 경력</p>
            <div className="flex flex-col gap-2 mb-6">
              {CAREER_OPTIONS.map((opt) => (
                <button key={opt.value} onClick={() => setCareer(opt.value)}
                  className={cn('w-full text-left px-5 py-3.5 rounded-2xl border transition-all font-medium text-sm',
                    career === opt.value ? 'bg-[#3D4A10] border-[#C6F135] text-[#C6F135]' : 'bg-[#1A1A1A] border-[#2E2E2E] text-white')}>
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="text-[#A0A0A0] text-sm mb-3">운동 목표</p>
            <div className="flex flex-col gap-2">
              {GOAL_OPTIONS.map((opt) => (
                <button key={opt.value} onClick={() => setGoal(opt.value)}
                  className={cn('w-full text-left px-5 py-3.5 rounded-2xl border transition-all font-medium text-sm',
                    goal === opt.value ? 'bg-[#3D4A10] border-[#C6F135] text-[#C6F135]' : 'bg-[#1A1A1A] border-[#2E2E2E] text-white')}>
                  {opt.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <Button fullWidth size="lg"
        disabled={!canNext}
        onClick={handleNext}>
        <span className="flex items-center gap-2">다음 <ChevronRight size={18} /></span>
      </Button>
    </div>
  );
}
