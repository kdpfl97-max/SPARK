export type SportType =
  | 'running'
  | 'gym'
  | 'climbing'
  | 'cycling'
  | 'swimming'
  | 'soccer'
  | 'tennis'
  | 'other';

export type ExerciseLevel = 1 | 2 | 3 | 4 | 5;

export type TrustGrade = 'sprout' | 'normal' | 'manner' | 'excellent' | 'champion';

export interface Participant {
  id: string;
  nickname: string;
  isHost?: boolean;
}

export interface User {
  id: string;
  nickname: string;
  avatarUrl?: string;
  exerciseLevel: ExerciseLevel;
  trustScore: number;
  trustGrade: TrustGrade;
  joinCount: number;
  certCount: number;
  noshowCount: number;
  createdAt: string;
}

export interface Meetup {
  id: string;
  hostId: string;
  host?: User;
  title: string;
  sportType: SportType;
  location: {
    address: string;
    district: string;
    lat: number;
    lng: number;
  };
  scheduledAt: string;
  maxParticipants: number;
  currentParticipants: number;
  minLevel: ExerciseLevel;
  maxLevel: ExerciseLevel;
  minTrustScore: number;
  description?: string;
  participants?: Participant[];
  distanceMeters?: number;
  createdAt: string;
}

export interface WorkoutRecord {
  id: string;
  userId: string;
  meetupId?: string;
  meetupTitle?: string;
  sportType: SportType;
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
  distanceMeters?: number;
  calories?: number;
  avgHeartRate?: number;
  photoUrl?: string;
  comment?: string;
  location?: {
    address: string;
    district: string;
    lat: number;
    lng: number;
  };
  routePath?: Array<{ lat: number; lng: number }>;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  goal: string;
  targetValue: number;
  unit: string;
  startDate: string;
  endDate: string;
  participantCount: number;
  myProgress?: number;
  isJoined?: boolean;
  isCompleted?: boolean;
}
