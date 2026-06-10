'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export type WorkoutStatus = 'idle' | 'running' | 'paused' | 'stopped';

export interface WorkoutStats {
  elapsedSeconds: number;
  distanceMeters: number;
  calories: number;
  avgHeartRate: number;
  pace: string; // "5'32\"/km"
  status: WorkoutStatus;
}

// GPS 시뮬레이션: 초당 약 2~3m 이동 (러닝 기준 ~6min/km 페이스)
const SPEED_M_PER_SEC = 2.5;
const CALORIE_PER_SEC = 0.15;
const BASE_HEART_RATE = 140;

export function useWorkoutTimer() {
  const [status, setStatus] = useState<WorkoutStatus>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [distance, setDistance] = useState(0);
  const [calories, setCalories] = useState(0);
  const [heartRate, setHeartRate] = useState(BASE_HEART_RATE);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const tick = useCallback(() => {
    setElapsed((s) => s + 1);
    setDistance((d) => d + SPEED_M_PER_SEC + (Math.random() - 0.5) * 0.5);
    setCalories((c) => c + CALORIE_PER_SEC);
    setHeartRate(() => BASE_HEART_RATE + Math.floor((Math.random() - 0.5) * 10));
  }, []);

  const start = useCallback(() => {
    setStatus('running');
    intervalRef.current = setInterval(tick, 1000);
  }, [tick]);

  const pause = useCallback(() => {
    setStatus('paused');
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const resume = useCallback(() => {
    setStatus('running');
    intervalRef.current = setInterval(tick, 1000);
  }, [tick]);

  const stop = useCallback(() => {
    setStatus('stopped');
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const formatElapsed = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const calcPace = (distM: number, secs: number): string => {
    if (distM < 10) return "--'--\"";
    const secPerKm = (secs / distM) * 1000;
    const m = Math.floor(secPerKm / 60);
    const s = Math.floor(secPerKm % 60);
    return `${m}'${String(s).padStart(2, '0')}"`;
  };

  const stats: WorkoutStats = {
    elapsedSeconds: elapsed,
    distanceMeters: distance,
    calories: Math.floor(calories),
    avgHeartRate: heartRate,
    pace: calcPace(distance, elapsed),
    status,
  };

  return { stats, formatElapsed, start, pause, resume, stop };
}
