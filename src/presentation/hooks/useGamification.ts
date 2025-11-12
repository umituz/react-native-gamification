/**
 * useGamification Hook
 * 
 * Main hook for accessing gamification store
 */

import { useEffect } from "react";
import { useGamificationStore } from "../../infrastructure/storage/GamificationStore";
import type { IGamificationRepository } from "../../domain/repositories/IGamificationRepository";

/**
 * Main hook for gamification operations
 */
export const useGamification = () => {
  const store = useGamificationStore();

  return {
    // State
    userId: store.userId,
    achievements: store.achievements,
    pointBalance: store.pointBalance,
    pointTransactions: store.pointTransactions,
    level: store.level,
    streaks: store.streaks,
    rewards: store.rewards,
    progress: store.progress,
    isLoading: store.isLoading,
    isInitialized: store.isInitialized,

    // Actions - Initialization
    setUserId: store.setUserId,
    setRepository: store.setRepository,
    initialize: store.initialize,

    // Actions - Achievements
    loadAchievements: store.loadAchievements,
    updateAchievementProgress: store.updateAchievementProgress,
    unlockAchievement: store.unlockAchievement,

    // Actions - Points
    loadPointBalance: store.loadPointBalance,
    loadPointTransactions: store.loadPointTransactions,
    addPoints: store.addPoints,
    deductPoints: store.deductPoints,

    // Actions - Levels
    loadLevel: store.loadLevel,
    addExperience: store.addExperience,

    // Actions - Streaks
    loadStreaks: store.loadStreaks,
    updateStreakActivity: store.updateStreakActivity,

    // Actions - Rewards
    loadRewards: store.loadRewards,
    claimReward: store.claimReward,

    // Actions - Progress
    loadProgress: store.loadProgress,
    updateProgress: store.updateProgress,
  };
};

/**
 * Hook to initialize gamification on mount
 */
export const useGamificationInitializer = (userId: string | null) => {
  const { initialize, isInitialized } = useGamificationStore();

  useEffect(() => {
    if (userId && !isInitialized) {
      initialize(userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, isInitialized]);
};

/**
 * Hook to set custom repository
 */
export const useGamificationRepository = (repository: IGamificationRepository | null) => {
  const { setRepository } = useGamificationStore();

  useEffect(() => {
    if (repository) {
      setRepository(repository);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repository]);
};



