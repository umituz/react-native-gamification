/**
 * useProgress Hook
 * 
 * Hook for progress tracking operations
 */

import { useGamificationStore } from "../../infrastructure/storage/GamificationStore";
import type { Progress } from "../../domain/entities/Progress";

/**
 * Hook for progress tracking operations
 */
export const useProgress = () => {
  const store = useGamificationStore();

  return {
    progress: store.progress,
    loadProgress: store.loadProgress,
    updateProgress: store.updateProgress,
    getProgressByMetric: (metric: string): Progress | undefined => {
      return store.progress.find((p) => p.metric === metric);
    },
    getProgressByCategory: (category: string): Progress[] => {
      return store.progress.filter((p) => p.category === category);
    },
    getProgressByPeriod: (period: "daily" | "weekly" | "monthly" | "all-time"): Progress[] => {
      return store.progress.filter((p) => p.period === period);
    },
  };
};


