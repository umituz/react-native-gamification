/**
 * useLevel Hook
 * 
 * Hook for level operations
 */

import { useGamificationStore } from "../../infrastructure/storage/GamificationStore";
import type { Level, LevelProgress } from "../../domain/entities/Level";

/**
 * Hook for level operations
 */
export const useLevel = () => {
  const store = useGamificationStore();

  return {
    level: store.level,
    loadLevel: store.loadLevel,
    addExperience: store.addExperience,
    getCurrentLevel: (): number => {
      return store.level?.currentLevel || 1;
    },
    getCurrentExperience: (): number => {
      return store.level?.currentExperience || 0;
    },
    getTotalExperience: (): number => {
      return store.level?.totalExperience || 0;
    },
    getExperienceToNextLevel: (): number => {
      return store.level?.experienceToNextLevel || 100;
    },
    getLevelProgress: (): number => {
      return store.level?.levelProgress || 0;
    },
  };
};



