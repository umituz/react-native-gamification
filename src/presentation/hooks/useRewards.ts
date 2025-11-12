/**
 * useRewards Hook
 * 
 * Hook for reward operations
 */

import { useGamificationStore } from "../../infrastructure/storage/GamificationStore";
import type { Reward } from "../../domain/entities/Reward";

/**
 * Hook for reward operations
 */
export const useRewards = () => {
  const store = useGamificationStore();

  return {
    rewards: store.rewards,
    loadRewards: store.loadRewards,
    claimReward: store.claimReward,
    getRewardById: (id: string): Reward | undefined => {
      return store.rewards.find((r) => r.id === id);
    },
    getUnlockedRewards: (): Reward[] => {
      return store.rewards.filter((r) => r.unlocked && !r.claimed);
    },
    getClaimedRewards: (): Reward[] => {
      return store.rewards.filter((r) => r.claimed);
    },
    getAvailableRewards: (): Reward[] => {
      const balance = store.pointBalance?.total || 0;
      const level = store.level?.currentLevel || 1;
      return store.rewards.filter(
        (r) =>
          !r.claimed &&
          (!r.pointsCost || r.pointsCost <= balance) &&
          (!r.levelRequired || r.levelRequired <= level),
      );
    },
  };
};



