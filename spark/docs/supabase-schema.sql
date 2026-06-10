-- =====================================================
-- SPARK 데이터베이스 스키마
-- Supabase SQL Editor에서 순서대로 실행하세요
-- =====================================================

-- 1. profiles (유저 프로필)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  nickname text not null,
  avatar_url text,
  exercise_level int not null default 1 check (exercise_level between 1 and 5),
  trust_score int not null default 0 check (trust_score between 0 and 100),
  trust_grade text not null default 'sprout',
  join_count int not null default 0,
  cert_count int not null default 0,
  noshow_count int not null default 0,
  created_at timestamptz not null default now()
);

-- 2. meetups (모임)
create table public.meetups (
  id uuid primary key default gen_random_uuid(),
  host_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  sport_type text not null,
  address text not null,
  district text not null,
  lat double precision not null,
  lng double precision not null,
  scheduled_at timestamptz not null,
  max_participants int not null default 5,
  current_participants int not null default 1,
  min_level int not null default 1 check (min_level between 1 and 5),
  max_level int not null default 5 check (max_level between 1 and 5),
  min_trust_score int not null default 0,
  description text,
  created_at timestamptz not null default now()
);

-- 3. meetup_participants (모임 참가자)
create table public.meetup_participants (
  meetup_id uuid references public.meetups(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  status text not null default 'joined',
  joined_at timestamptz not null default now(),
  primary key (meetup_id, user_id)
);

-- 4. workout_records (운동 기록)
create table public.workout_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  meetup_id uuid references public.meetups(id) on delete set null,
  sport_type text not null,
  started_at timestamptz not null,
  ended_at timestamptz not null,
  duration_seconds int not null,
  distance_meters double precision,
  calories int,
  avg_heart_rate int,
  photo_url text,
  comment text,
  address text,
  district text,
  lat double precision,
  lng double precision,
  is_certified boolean not null default false,
  created_at timestamptz not null default now()
);

-- 5. challenges (챌린지)
create table public.challenges (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  goal text not null,
  target_value int not null,
  unit text not null,
  start_date date not null,
  end_date date not null,
  participant_count int not null default 0,
  created_at timestamptz not null default now()
);

-- 6. challenge_participants (챌린지 참가자)
create table public.challenge_participants (
  challenge_id uuid references public.challenges(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  progress int not null default 0,
  joined_at timestamptz not null default now(),
  completed_at timestamptz,
  primary key (challenge_id, user_id)
);

-- =====================================================
-- RLS (Row Level Security) 설정
-- =====================================================

alter table public.profiles enable row level security;
alter table public.meetups enable row level security;
alter table public.meetup_participants enable row level security;
alter table public.workout_records enable row level security;
alter table public.challenges enable row level security;
alter table public.challenge_participants enable row level security;

-- profiles 정책
create policy "누구나 프로필 조회 가능" on public.profiles for select using (true);
create policy "본인 프로필만 수정 가능" on public.profiles for update using (auth.uid() = id);
create policy "본인 프로필 생성 가능" on public.profiles for insert with check (auth.uid() = id);

-- meetups 정책
create policy "누구나 모임 조회 가능" on public.meetups for select using (true);
create policy "로그인 유저만 모임 생성 가능" on public.meetups for insert with check (auth.uid() = host_id);
create policy "호스트만 모임 수정 가능" on public.meetups for update using (auth.uid() = host_id);
create policy "호스트만 모임 삭제 가능" on public.meetups for delete using (auth.uid() = host_id);

-- meetup_participants 정책
create policy "누구나 참가자 조회 가능" on public.meetup_participants for select using (true);
create policy "로그인 유저만 참가 가능" on public.meetup_participants for insert with check (auth.uid() = user_id);
create policy "본인 참가만 수정 가능" on public.meetup_participants for update using (auth.uid() = user_id);

-- workout_records 정책
create policy "본인 운동기록만 조회 가능" on public.workout_records for select using (auth.uid() = user_id);
create policy "본인 운동기록만 생성 가능" on public.workout_records for insert with check (auth.uid() = user_id);
create policy "본인 운동기록만 수정 가능" on public.workout_records for update using (auth.uid() = user_id);

-- challenges 정책
create policy "누구나 챌린지 조회 가능" on public.challenges for select using (true);

-- challenge_participants 정책
create policy "누구나 챌린지 참가자 조회 가능" on public.challenge_participants for select using (true);
create policy "로그인 유저만 참가 가능" on public.challenge_participants for insert with check (auth.uid() = user_id);
create policy "본인 챌린지 기록만 수정 가능" on public.challenge_participants for update using (auth.uid() = user_id);

-- =====================================================
-- 샘플 데이터
-- =====================================================

insert into public.challenges (title, description, goal, target_value, unit, start_date, end_date, participant_count) values
  ('6월 러닝 챌린지', '한 달 100km 완주', '100km 달리기', 100, 'km', '2026-06-01', '2026-06-30', 234),
  ('30일 운동 습관', '30일 연속 인증', '30일 연속 운동 인증', 30, '일', '2026-06-01', '2026-06-30', 1204),
  ('여름 수영 챌린지', '이번 달 10회 수영', '10회 수영', 10, '회', '2026-06-01', '2026-06-30', 89);

-- =====================================================
-- 유저 가입 시 자동 프로필 생성 트리거
-- =====================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nickname, exercise_level, trust_score, trust_grade)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', new.email, '운동러'),
    1,
    0,
    'sprout'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
