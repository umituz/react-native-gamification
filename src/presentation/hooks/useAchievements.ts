/**
 * useAchievements Hook
 * 
 * Hook for achievement operations
 */

import { useGamificationStore } from "../../infrastructure/storage/GamificationStore";
import type { Achievement } from "../../domain/entities/Achievement";

/**
 * Hook for achievement operations
 */
export const useAchievements = () => {
  const store = useGamificationStore();

  return {
    achievements: store.achievements,
    loadAchievements: store.loadAchievements,
    updateAchievementProgress: store.updateAchievementProgress,
    unlockAchievement: store.unlockAchievement,
    getAchievementById: (id: string): Achievement | undefined => {
      return store.achievements.find((a) => a.id === id);
    },
    getAchievementsByCategory: (category: string): Achievement[] => {
      return store.achievements.filter((a) => a.category === category);
    },
    getUnlockedAchievements: (): Achievement[] => {
      return store.achievements.filter((a) => a.unlocked);
    },
    getLockedAchievements: (): Achievement[] => {
      return store.achievements.filter((a) => !a.unlocked);
    },
  };
};



