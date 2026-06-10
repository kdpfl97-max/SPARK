# SPARK — 운동 번개모임 앱

하이퍼로컬 기반 운동 번개모임 웹앱. 동네에서 지금 당장 같이 운동할 사람을 찾는 서비스.

## 기술 스택

- **Frontend**: Next.js 16 (App Router) + TypeScript + Tailwind CSS
- **Backend/DB**: Supabase (PostgreSQL + Auth + Realtime)
- **상태관리**: Zustand (persist)
- **지도**: 카카오맵 API (예정)
- **배포**: Vercel (예정)

## 개발 서버 실행

```bash
cd "C:\Yeari TEST\01spark\spark"
npm run dev
# http://localhost:3000
```

## 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx                    # 루트 (온보딩/홈 분기)
│   ├── onboarding/page.tsx         # 온보딩 설문 + 소셜 로그인
│   ├── auth/callback/route.ts      # OAuth 콜백
│   └── (main)/                     # 하단 네비 레이아웃
│       ├── layout.tsx
│       ├── home/page.tsx           # 홈 (지도 + 모임 리스트)
│       ├── explore/page.tsx        # 탐색 (검색 + 필터)
│       ├── workout/
│       │   ├── page.tsx            # 운동 시작 (종목 선택)
│       │   ├── active/page.tsx     # 운동 중 트래킹
│       │   └── complete/page.tsx   # 운동 완료 + 인증
│       ├── meetup/
│       │   ├── [id]/page.tsx       # 모임 상세
│       │   └── create/page.tsx     # 모임 생성
│       ├── challenge/page.tsx      # 챌린지
│       └── profile/page.tsx        # 프로필 (피드 + 통계 탭)
├── components/
│   ├── ui/                         # Button, LevelBadge, TrustBadge, SportTag
│   ├── layout/                     # BottomNav, AuthProvider
│   └── meetup/                     # MeetupCard
├── hooks/
│   └── useWorkoutTimer.ts          # 운동 타이머 + 시뮬레이션 훅
├── lib/
│   ├── supabase.ts                 # Supabase 클라이언트
│   ├── database.types.ts           # DB 타입 정의
│   ├── constants.ts                # 레벨/신뢰도/종목 상수
│   ├── utils.ts                    # 포맷 유틸
│   └── api/
│       ├── auth.ts                 # Google/Kakao OAuth
│       ├── profiles.ts             # 유저 프로필 CRUD
│       ├── meetups.ts              # 모임 CRUD
│       ├── workouts.ts             # 운동 기록
│       └── challenges.ts          # 챌린지
├── store/
│   └── userStore.ts                # Zustand 유저 상태 + Supabase Auth 연동
└── types/
    └── index.ts                    # 전체 타입 정의
```

## 핵심 시스템

### 운동 레벨 (5단계)
- 온보딩 설문으로 측정 (운동 빈도, 종목, 경력, 목표)
- Lv.1 입문 ~ Lv.5 전문

### 신뢰도 시스템
- 0~100점, 행동 기반 증감
- **30점 이상**이어야 모임 개설 가능
- 등급: 새싹(0) / 일반(30) / 매너(60) / 우수(80) / 챔피언(95)
- 신뢰도 등급에 따라 최대 모집 인원 제한 (5 / 10 / 20 / 무제한)

### 신뢰도 변동
| 행동 | 점수 |
|------|------|
| 본인 인증 | +15 |
| 모임 출석 | +10 |
| 운동 인증 | +5 |
| 노쇼 | -20 |
| 허위 인증 | -15 |
| 당일 취소 | -10 |

## Supabase 설정

### 환경변수 (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=https://qroluxjhunzkzutgsztu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

### DB 테이블
- `profiles` — 유저 프로필 (auth.users 확장)
- `meetups` — 모임
- `meetup_participants` — 모임 참가자
- `workout_records` — 운동 기록
- `challenges` — 챌린지
- `challenge_participants` — 챌린지 참가자

### 스키마 실행
`docs/supabase-schema.sql` 을 Supabase SQL Editor에서 실행

### Auth 설정 필요
- Google OAuth: Supabase → Authentication → Providers → Google
- Kakao OAuth: Supabase → Authentication → Providers → Kakao
- Redirect URL: `https://qroluxjhunzkzutgsztu.supabase.co/auth/v1/callback`

## 디자인 시스템 (docs/design-system.md)

| 항목 | 값 |
|------|-----|
| 배경 | `#0D0D0D` |
| 카드 | `#1A1A1A` |
| 주색상 | `#C6F135` (네온 그린) |
| 폰트 | Pretendard (한국어) / Inter (수치) |
| 무드 | 프리미엄 다크 |

## 남은 작업

- [ ] Supabase SQL 스키마 실행
- [ ] Google / Kakao OAuth 설정
- [ ] 카카오맵 API 연동 (지도 화면)
- [ ] 운동 인증 사진 업로드 (Supabase Storage)
- [ ] 실시간 멤버 위치 공유 (Supabase Realtime)
- [ ] Vercel 배포
