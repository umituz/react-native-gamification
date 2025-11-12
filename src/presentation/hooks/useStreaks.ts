/**
 * useStreaks Hook
 * 
 * Hook for streak operations
 */

import { useGamificationStore } from "../../infrastructure/storage/GamificationStore";
import type { Streak } from "../../domain/entities/Streak";

/**
 * Hook for streak operations
 */
export const useStreaks = () => {
  const store = useGamificationStore();

  return {
    streaks: store.streaks,
    loadStreaks: store.loadStreaks,
    updateStreakActivity: store.updateStreakActivity,
    getStreakByType: (type: string): Streak | undefined => {
      return store.streaks.find((s) => s.type === type);
    },
    getActiveStreaks: (): Streak[] => {
      return store.streaks.filter((s) => s.isActive);
    },
    getLongestStreak: (type?: string): number => {
      const streaks = type
        ? store.streaks.filter((s) => s.type === type)
        : store.streaks;
      return Math.max(...streaks.map((s) => s.longestStreak), 0);
    },
  };
};


