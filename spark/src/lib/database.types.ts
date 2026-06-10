export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          nickname: string;
          avatar_url: string | null;
          exercise_level: number;
          trust_score: number;
          trust_grade: string;
          join_count: number;
          cert_count: number;
          noshow_count: number;
          created_at: string;
        };
        Insert: {
          id: string;
          nickname: string;
          avatar_url?: string | null;
          exercise_level?: number;
          trust_score?: number;
          trust_grade?: string;
          join_count?: number;
          cert_count?: number;
          noshow_count?: number;
          created_at?: string;
        };
        Update: {
          nickname?: string;
          avatar_url?: string | null;
          exercise_level?: number;
          trust_score?: number;
          trust_grade?: string;
          join_count?: number;
          cert_count?: number;
          noshow_count?: number;
        };
        Relationships: [];
      };
      meetups: {
        Row: {
          id: string;
          host_id: string;
          title: string;
          sport_type: string;
          address: string;
          district: string;
          lat: number;
          lng: number;
          scheduled_at: string;
          max_participants: number;
          current_participants: number;
          min_level: number;
          max_level: number;
          min_trust_score: number;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          host_id: string;
          title: string;
          sport_type: string;
          address: string;
          district: string;
          lat: number;
          lng: number;
          scheduled_at: string;
          max_participants: number;
          current_participants?: number;
          min_level: number;
          max_level: number;
          min_trust_score: number;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          title?: string;
          sport_type?: string;
          address?: string;
          district?: string;
          lat?: number;
          lng?: number;
          scheduled_at?: string;
          max_participants?: number;
          current_participants?: number;
          min_level?: number;
          max_level?: number;
          min_trust_score?: number;
          description?: string | null;
        };
        Relationships: [];
      };
      meetup_participants: {
        Row: {
          meetup_id: string;
          user_id: string;
          status: string;
          joined_at: string;
        };
        Insert: {
          meetup_id: string;
          user_id: string;
          status?: string;
          joined_at?: string;
        };
        Update: {
          status?: string;
        };
        Relationships: [];
      };
      workout_records: {
        Row: {
          id: string;
          user_id: string;
          meetup_id: string | null;
          sport_type: string;
          started_at: string;
          ended_at: string;
          duration_seconds: number;
          distance_meters: number | null;
          calories: number | null;
          avg_heart_rate: number | null;
          photo_url: string | null;
          comment: string | null;
          address: string | null;
          district: string | null;
          lat: number | null;
          lng: number | null;
          is_certified: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          meetup_id?: string | null;
          sport_type: string;
          started_at: string;
          ended_at: string;
          duration_seconds: number;
          distance_meters?: number | null;
          calories?: number | null;
          avg_heart_rate?: number | null;
          photo_url?: string | null;
          comment?: string | null;
          address?: string | null;
          district?: string | null;
          lat?: number | null;
          lng?: number | null;
          is_certified?: boolean;
          created_at?: string;
        };
        Update: {
          photo_url?: string | null;
          comment?: string | null;
          is_certified?: boolean;
        };
        Relationships: [];
      };
      challenges: {
        Row: {
          id: string;
          title: string;
          description: string;
          goal: string;
          target_value: number;
          unit: string;
          start_date: string;
          end_date: string;
          participant_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          goal: string;
          target_value: number;
          unit: string;
          start_date: string;
          end_date: string;
          participant_count?: number;
          created_at?: string;
        };
        Update: {
          participant_count?: number;
        };
        Relationships: [];
      };
      challenge_participants: {
        Row: {
          challenge_id: string;
          user_id: string;
          progress: number;
          joined_at: string;
          completed_at: string | null;
        };
        Insert: {
          challenge_id: string;
          user_id: string;
          progress?: number;
          joined_at?: string;
          completed_at?: string | null;
        };
        Update: {
          progress?: number;
          completed_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
