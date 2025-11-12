/**
 * Gamification Store - Unified State Management
 * 
 * Uses Zustand for state management with repository pattern
 * App-specific implementations can provide custom repository
 */

import { create } from "zustand";
import type { IGamificationRepository } from "../../domain/repositories/IGamificationRepository";
import { storageGamificationRepository } from "../repositories/StorageGamificationRepository";
import type { Achievement } from "../../domain/entities/Achievement";
import type { PointBalance, PointTransaction } from "../../domain/entities/Point";
import type { Level, LevelProgress } from "../../domain/entities/Level";
import type { Streak } from "../../domain/entities/Streak";
import type { Leaderboard, LeaderboardEntry, LeaderboardRanking } from "../../domain/entities/Leaderboard";
import type { Reward, RewardClaim } from "../../domain/entities/Reward";
import type { Progress, ProgressUpdate } from "../../domain/entities/Progress";

interface GamificationStore {
  // Repository
  repository: IGamificationRepository;

  // State
  userId: string | null;
  achievements: Achievement[];
  pointBalance: PointBalance | null;
  pointTransactions: PointTransaction[];
  level: Level | null;
  streaks: Streak[];
  rewards: Reward[];
  progress: Progress[];

  // Loading states
  isLoading: boolean;
  isInitialized: boolean;

  // Actions - Initialization
  setUserId: (userId: string) => void;
  setRepository: (repository: IGamificationRepository) => void;
  initialize: (userId: string) => Promise<void>;

  // Actions - Achievements
  loadAchievements: () => Promise<void>;
  updateAchievementProgress: (achievementId: string, progress: number) => Promise<void>;
  unlockAchievement: (achievementId: string) => Promise<void>;

  // Actions - Points
  loadPointBalance: () => Promise<void>;
  loadPointTransactions: (limit?: number) => Promise<void>;
  addPoints: (
    amount: number,
    source: string,
    sourceId?: string,
    category?: string,
    description?: string,
  ) => Promise<void>;
  deductPoints: (
    amount: number,
    source: string,
    sourceId?: string,
    description?: string,
  ) => Promise<void>;

  // Actions - Levels
  loadLevel: () => Promise<void>;
  addExperience: (amount: number, source?: string) => Promise<void>;

  // Actions - Streaks
  loadStreaks: () => Promise<void>;
  updateStreakActivity: (type: string, activityDate: string) => Promise<void>;

  // Actions - Rewards
  loadRewards: () => Promise<void>;
  claimReward: (rewardId: string) => Promise<RewardClaim | null>;

  // Actions - Progress
  loadProgress: (metric?: string) => Promise<void>;
  updateProgress: (update: ProgressUpdate) => Promise<void>;
}

export const useGamificationStore = create<GamificationStore>((set, get) => ({
  // Repository
  repository: storageGamificationRepository,

  // State
  userId: null,
  achievements: [],
  pointBalance: null,
  pointTransactions: [],
  level: null,
  streaks: [],
  rewards: [],
  progress: [],

  // Loading states
  isLoading: false,
  isInitialized: false,

  // Actions - Initialization
  setUserId: (userId: string) => {
    set({ userId });
  },

  setRepository: (repository: IGamificationRepository) => {
    set({ repository });
  },

  initialize: async (userId: string) => {
    set({ isLoading: true, userId });
    const store = get();
    try {
      await Promise.all([
        store.loadAchievements(),
        store.loadPointBalance(),
        store.loadLevel(),
        store.loadStreaks(),
        store.loadRewards(),
        store.loadProgress(),
      ]);
      set({ isLoading: false, isInitialized: true });
    } catch (error) {
      /* eslint-disable-next-line no-console */
      if (__DEV__) console.error("Failed to initialize gamification:", error);
      set({ isLoading: false, isInitialized: true });
    }
  },

  // Actions - Achievements
  loadAchievements: async () => {
    const { userId, repository } = get();
    if (!userId) return;
    set({ isLoading: true });
    const result = await repository.loadAchievements(userId);
    if (result.success) {
      set({ achievements: result.data, isLoading: false });
    } else {
      /* eslint-disable-next-line no-console */
      if (__DEV__) console.error("Failed to load achievements:", result.error);
      set({ isLoading: false });
    }
  },

  updateAchievementProgress: async (achievementId: string, progress: number) => {
    const { userId, repository } = get();
    if (!userId) return;
    const result = await repository.updateAchievementProgress(userId, achievementId, progress);
    if (result.success) {
      const achievements = get().achievements.map((a) =>
        a.id === achievementId ? result.data : a,
      );
      set({ achievements });
      // Check if achievement should be unlocked
      if (progress >= result.data.requirement && !result.data.unlocked) {
        await get().unlockAchievement(achievementId);
      }
    }
  },

  unlockAchievement: async (achievementId: string) => {
    const { userId, repository } = get();
    if (!userId) return;
    const result = await repository.unlockAchievement(userId, achievementId);
    if (result.success) {
      const achievements = get().achievements.map((a) =>
        a.id === achievementId ? result.data : a,
      );
      set({ achievements });
      // Award points if achievement has points
      if (result.data.points) {
        await get().addPoints(
          result.data.points,
          "achievement",
          achievementId,
          "achievement",
          `Unlocked achievement: ${result.data.title}`,
        );
      }
    }
  },

  // Actions - Points
  loadPointBalance: async () => {
    const { userId, repository } = get();
    if (!userId) return;
    const result = await repository.loadPointBalance(userId);
    if (result.success) {
      set({ pointBalance: result.data });
    }
  },

  loadPointTransactions: async (limit?: number) => {
    const { userId, repository } = get();
    if (!userId) return;
    const result = await repository.loadPointTransactions(userId, limit);
    if (result.success) {
      set({ pointTransactions: result.data });
    }
  },

  addPoints: async (
    amount: number,
    source: string,
    sourceId?: string,
    category?: string,
    description?: string,
  ) => {
    const { userId, repository } = get();
    if (!userId) return;
    const result = await repository.addPoints(userId, amount, source, sourceId, category, description);
    if (result.success) {
      await get().loadPointBalance();
      await get().loadPointTransactions(10);
    }
  },

  deductPoints: async (
    amount: number,
    source: string,
    sourceId?: string,
    description?: string,
  ) => {
    const { userId, repository } = get();
    if (!userId) return;
    const result = await repository.deductPoints(userId, amount, source, sourceId, description);
    if (result.success) {
      await get().loadPointBalance();
      await get().loadPointTransactions(10);
    }
  },

  // Actions - Levels
  loadLevel: async () => {
    const { userId, repository } = get();
    if (!userId) return;
    const result = await repository.loadLevel(userId);
    if (result.success) {
      set({ level: result.data });
    }
  },

  addExperience: async (amount: number, source?: string) => {
    const { userId, repository } = get();
    if (!userId) return;
    const result = await repository.addExperience(userId, amount, source);
    if (result.success) {
      await get().loadLevel();
      // Check for level up
      if (result.data.canLevelUp) {
        // Award points for level up (optional)
        await get().addPoints(
          result.data.currentLevel * 10,
          "level_up",
          undefined,
          "level",
          `Leveled up to level ${result.data.currentLevel}`,
        );
      }
    }
  },

  // Actions - Streaks
  loadStreaks: async () => {
    const { userId, repository } = get();
    if (!userId) return;
    const result = await repository.loadStreaks(userId);
    if (result.success) {
      set({ streaks: result.data });
    }
  },

  updateStreakActivity: async (type: string, activityDate: string) => {
    const { userId, repository } = get();
    if (!userId) return;
    const result = await repository.updateStreakActivity(userId, type, activityDate);
    if (result.success) {
      const streaks = get().streaks.map((s) => (s.id === result.data.id ? result.data : s));
      const existingIndex = streaks.findIndex((s) => s.id === result.data.id);
      if (existingIndex === -1) {
        streaks.push(result.data);
      }
      set({ streaks });
    }
  },

  // Actions - Rewards
  loadRewards: async () => {
    const { userId, repository } = get();
    if (!userId) return;
    const result = await repository.loadRewards(userId);
    if (result.success) {
      set({ rewards: result.data });
    }
  },

  claimReward: async (rewardId: string): Promise<RewardClaim | null> => {
    const { userId, repository } = get();
    if (!userId) return null;
    const reward = get().rewards.find((r) => r.id === rewardId);
    if (reward?.pointsCost) {
      const balance = get().pointBalance;
      if (!balance || balance.total < reward.pointsCost) {
        return null;
      }
      await get().deductPoints(
        reward.pointsCost,
        "reward_claim",
        rewardId,
        `Claimed reward: ${reward.title}`,
      );
    }
    const result = await repository.claimReward(userId, rewardId);
    if (result.success) {
      await get().loadRewards();
      return result.data;
    }
    return null;
  },

  // Actions - Progress
  loadProgress: async (metric?: string) => {
    const { userId, repository } = get();
    if (!userId) return;
    const result = await repository.loadProgress(userId, metric);
    if (result.success) {
      if (metric) {
        const existing = get().progress.filter((p) => p.metric !== metric);
        set({ progress: [...existing, ...result.data] });
      } else {
        set({ progress: result.data });
      }
    }
  },

  updateProgress: async (update: ProgressUpdate) => {
    const { userId, repository } = get();
    if (!userId) return;
    const result = await repository.updateProgress(update);
    if (result.success) {
      const progress = get().progress.map((p) => (p.id === result.data.id ? result.data : p));
      const existingIndex = progress.findIndex((p) => p.id === result.data.id);
      if (existingIndex === -1) {
        progress.push(result.data);
      }
      set({ progress });
    }
  },
}));



