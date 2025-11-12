/**
 * Storage Gamification Repository Implementation
 * 
 * Default implementation using @umituz/react-native-storage
 * App-specific implementations can extend or replace this
 */

import { storageRepository } from "@umituz/react-native-storage";
import { unwrap } from "@umituz/react-native-storage";
import type {
  IGamificationRepository,
  GamificationResult,
  GamificationError,
} from "../../domain/repositories/IGamificationRepository";
import type { Achievement } from "../../domain/entities/Achievement";
import type { PointBalance, PointTransaction } from "../../domain/entities/Point";
import type { Level, LevelProgress } from "../../domain/entities/Level";
import type { Streak } from "../../domain/entities/Streak";
import type { Leaderboard, LeaderboardEntry, LeaderboardRanking } from "../../domain/entities/Leaderboard";
import type { Reward, RewardClaim } from "../../domain/entities/Reward";
import type { Progress, ProgressUpdate } from "../../domain/entities/Progress";

const STORAGE_KEYS = {
  ACHIEVEMENTS: (userId: string) => `@gamification:achievements:${userId}`,
  POINTS: (userId: string) => `@gamification:points:${userId}`,
  POINT_TRANSACTIONS: (userId: string) => `@gamification:point_transactions:${userId}`,
  LEVEL: (userId: string) => `@gamification:level:${userId}`,
  STREAKS: (userId: string) => `@gamification:streaks:${userId}`,
  LEADERBOARDS: (id: string) => `@gamification:leaderboards:${id}`,
  REWARDS: (userId: string) => `@gamification:rewards:${userId}`,
  PROGRESS: (userId: string) => `@gamification:progress:${userId}`,
};

class StorageGamificationRepository implements IGamificationRepository {
  private createError(
    name: string,
    message: string,
    code: GamificationError["code"],
  ): GamificationError {
    return { name, message, code };
  }

  private async loadJson<T>(key: string, defaultValue: T): Promise<GamificationResult<T>> {
    try {
      const result = await storageRepository.getString(key, JSON.stringify(defaultValue));
      const data = unwrap(result, JSON.stringify(defaultValue));
      return {
        success: true,
        data: JSON.parse(data) as T,
      };
    } catch (error) {
      return {
        success: false,
        error: this.createError(
          "LoadError",
          error instanceof Error ? error.message : "Failed to load data",
          "LOAD_FAILED",
        ),
      };
    }
  }

  private async saveJson<T>(key: string, data: T): Promise<GamificationResult<void>> {
    try {
      const result = await storageRepository.setString(key, JSON.stringify(data));
      if (result.success) {
        return { success: true, data: undefined };
      }
      return {
        success: false,
        error: this.createError("SaveError", "Failed to save data", "SAVE_FAILED"),
      };
    } catch (error) {
      return {
        success: false,
        error: this.createError(
          "SaveError",
          error instanceof Error ? error.message : "Failed to save data",
          "SAVE_FAILED",
        ),
      };
    }
  }

  // =============================================================================
  // ACHIEVEMENTS
  // =============================================================================

  async loadAchievements(userId: string): Promise<GamificationResult<Achievement[]>> {
    return this.loadJson<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS(userId), []);
  }

  async saveAchievements(achievements: Achievement[]): Promise<GamificationResult<void>> {
    if (achievements.length === 0) {
      return { success: true, data: undefined };
    }
    const userId = achievements[0].userId;
    return this.saveJson(STORAGE_KEYS.ACHIEVEMENTS(userId), achievements);
  }

  async getAchievementById(
    userId: string,
    achievementId: string,
  ): Promise<GamificationResult<Achievement>> {
    const result = await this.loadAchievements(userId);
    if (!result.success) {
      return result;
    }
    const achievement = result.data.find((a) => a.id === achievementId);
    if (!achievement) {
      return {
        success: false,
        error: this.createError(
          "NotFoundError",
          `Achievement ${achievementId} not found`,
          "NOT_FOUND",
        ),
      };
    }
    return { success: true, data: achievement };
  }

  async updateAchievementProgress(
    userId: string,
    achievementId: string,
    progress: number,
  ): Promise<GamificationResult<Achievement>> {
    const result = await this.loadAchievements(userId);
    if (!result.success) {
      return result;
    }
    const achievements = result.data;
    const index = achievements.findIndex((a) => a.id === achievementId);
    if (index === -1) {
      return {
        success: false,
        error: this.createError(
          "NotFoundError",
          `Achievement ${achievementId} not found`,
          "NOT_FOUND",
        ),
      };
    }
    achievements[index] = {
      ...achievements[index],
      progress,
      updatedDate: new Date().toISOString(),
    };
    const saveResult = await this.saveAchievements(achievements);
    if (!saveResult.success) {
      return saveResult;
    }
    return { success: true, data: achievements[index] };
  }

  async unlockAchievement(
    userId: string,
    achievementId: string,
  ): Promise<GamificationResult<Achievement>> {
    const result = await this.loadAchievements(userId);
    if (!result.success) {
      return result;
    }
    const achievements = result.data;
    const index = achievements.findIndex((a) => a.id === achievementId);
    if (index === -1) {
      return {
        success: false,
        error: this.createError(
          "NotFoundError",
          `Achievement ${achievementId} not found`,
          "NOT_FOUND",
        ),
      };
    }
    achievements[index] = {
      ...achievements[index],
      unlocked: true,
      unlockedDate: new Date().toISOString(),
      progress: achievements[index].requirement,
      updatedDate: new Date().toISOString(),
    };
    const saveResult = await this.saveAchievements(achievements);
    if (!saveResult.success) {
      return saveResult;
    }
    return { success: true, data: achievements[index] };
  }

  // =============================================================================
  // POINTS
  // =============================================================================

  async loadPointBalance(userId: string): Promise<GamificationResult<PointBalance>> {
    const transactionsResult = await this.loadPointTransactions(userId);
    if (!transactionsResult.success) {
      return {
        success: false,
        error: transactionsResult.error,
      };
    }
    const transactions = transactionsResult.data;
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);
    const byCategory: Record<string, number> = {};
    transactions.forEach((t) => {
      if (t.category) {
        byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
      }
    });
    return {
      success: true,
      data: {
        userId,
        total,
        byCategory,
        lastUpdated: transactions[0]?.createdDate || new Date().toISOString(),
      },
    };
  }

  async loadPointTransactions(
    userId: string,
    limit?: number,
  ): Promise<GamificationResult<PointTransaction[]>> {
    const result = await this.loadJson<PointTransaction[]>(
      STORAGE_KEYS.POINT_TRANSACTIONS(userId),
      [],
    );
    if (!result.success) {
      return result;
    }
    let transactions = result.data;
    if (limit) {
      transactions = transactions.slice(0, limit);
    }
    return { success: true, data: transactions };
  }

  async addPoints(
    userId: string,
    amount: number,
    source: string,
    sourceId?: string,
    category?: string,
    description?: string,
  ): Promise<GamificationResult<PointTransaction>> {
    const balanceResult = await this.loadPointBalance(userId);
    if (!balanceResult.success) {
      return {
        success: false,
        error: balanceResult.error,
      };
    }
    const balance = balanceResult.data.total;
    const transaction: PointTransaction = {
      id: `${Date.now()}-${Math.random()}`,
      userId,
      amount,
      source,
      sourceId,
      category,
      description,
      balance: balance + amount,
      createdDate: new Date().toISOString(),
    };
    const transactionsResult = await this.loadPointTransactions(userId);
    if (!transactionsResult.success) {
      return {
        success: false,
        error: transactionsResult.error,
      };
    }
    const transactions = [transaction, ...transactionsResult.data];
    const saveResult = await this.saveJson(
      STORAGE_KEYS.POINT_TRANSACTIONS(userId),
      transactions,
    );
    if (!saveResult.success) {
      return {
        success: false,
        error: saveResult.error,
      };
    }
    return { success: true, data: transaction };
  }

  async deductPoints(
    userId: string,
    amount: number,
    source: string,
    sourceId?: string,
    description?: string,
  ): Promise<GamificationResult<PointTransaction>> {
    return this.addPoints(userId, -amount, source, sourceId, undefined, description);
  }

  // =============================================================================
  // LEVELS
  // =============================================================================

  async loadLevel(userId: string): Promise<GamificationResult<Level>> {
    return this.loadJson<Level>(STORAGE_KEYS.LEVEL(userId), {
      id: `${userId}-level`,
      userId,
      currentLevel: 1,
      currentExperience: 0,
      totalExperience: 0,
      experienceToNextLevel: 100,
      levelProgress: 0,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
    });
  }

  async saveLevel(level: Level): Promise<GamificationResult<void>> {
    return this.saveJson(STORAGE_KEYS.LEVEL(level.userId), level);
  }

  async addExperience(
    userId: string,
    amount: number,
    source?: string,
  ): Promise<GamificationResult<LevelProgress>> {
    const levelResult = await this.loadLevel(userId);
    if (!levelResult.success) {
      return {
        success: false,
        error: levelResult.error,
      };
    }
    const level = levelResult.data;
    const totalExperience = level.totalExperience + amount;
    // Simple level calculation: 100 XP per level
    const newLevel = Math.floor(totalExperience / 100) + 1;
    const currentExperience = totalExperience % 100;
    const experienceToNextLevel = 100 - currentExperience;
    const levelProgress = (currentExperience / 100) * 100;
    const updatedLevel: Level = {
      ...level,
      currentLevel: newLevel,
      currentExperience,
      totalExperience,
      experienceToNextLevel,
      levelProgress,
      updatedDate: new Date().toISOString(),
    };
    const saveResult = await this.saveLevel(updatedLevel);
    if (!saveResult.success) {
      return {
        success: false,
        error: saveResult.error,
      };
    }
    return {
      success: true,
      data: {
        userId,
        currentLevel: newLevel,
        currentExperience,
        totalExperience,
        experienceToNextLevel,
        levelProgress,
        canLevelUp: newLevel > level.currentLevel,
      },
    };
  }

  // =============================================================================
  // STREAKS
  // =============================================================================

  async loadStreaks(userId: string): Promise<GamificationResult<Streak[]>> {
    return this.loadJson<Streak[]>(STORAGE_KEYS.STREAKS(userId), []);
  }

  async loadStreakByType(userId: string, type: string): Promise<GamificationResult<Streak>> {
    const result = await this.loadStreaks(userId);
    if (!result.success) {
      return result;
    }
    const streak = result.data.find((s) => s.type === type);
    if (!streak) {
      return {
        success: false,
        error: this.createError(
          "NotFoundError",
          `Streak ${type} not found`,
          "NOT_FOUND",
        ),
      };
    }
    return { success: true, data: streak };
  }

  async saveStreak(streak: Streak): Promise<GamificationResult<void>> {
    const result = await this.loadStreaks(streak.userId);
    if (!result.success) {
      return result;
    }
    const streaks = result.data;
    const index = streaks.findIndex((s) => s.id === streak.id);
    if (index === -1) {
      streaks.push(streak);
    } else {
      streaks[index] = streak;
    }
    return this.saveJson(STORAGE_KEYS.STREAKS(streak.userId), streaks);
  }

  async updateStreakActivity(
    userId: string,
    type: string,
    activityDate: string,
  ): Promise<GamificationResult<Streak>> {
    const result = await this.loadStreakByType(userId, type);
    if (!result.success) {
      // Create new streak if not found
      const newStreak: Streak = {
        id: `${userId}-${type}-${Date.now()}`,
        userId,
        type,
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: activityDate,
        isActive: true,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      };
      const saveResult = await this.saveStreak(newStreak);
      if (!saveResult.success) {
        return {
          success: false,
          error: saveResult.error,
        };
      }
      return { success: true, data: newStreak };
    }
    const streak = result.data;
    const lastDate = new Date(streak.lastActivityDate);
    const currentDate = new Date(activityDate);
    const daysDiff = Math.floor(
      (currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (daysDiff === 1) {
      // Continue streak
      streak.currentStreak += 1;
      streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
      streak.isActive = true;
    } else if (daysDiff > 1) {
      // Reset streak
      streak.currentStreak = 1;
      streak.isActive = true;
    }
    streak.lastActivityDate = activityDate;
    streak.updatedDate = new Date().toISOString();
    const saveResult = await this.saveStreak(streak);
    if (!saveResult.success) {
      return {
        success: false,
        error: saveResult.error,
      };
    }
    return { success: true, data: streak };
  }

  // =============================================================================
  // LEADERBOARDS
  // =============================================================================

  async loadLeaderboard(
    leaderboardId: string,
    limit?: number,
    offset?: number,
  ): Promise<GamificationResult<Leaderboard>> {
    const result = await this.loadJson<Leaderboard>(
      STORAGE_KEYS.LEADERBOARDS(leaderboardId),
      {
        id: leaderboardId,
        name: leaderboardId,
        metric: "score",
        entries: [],
        totalParticipants: 0,
        lastUpdated: new Date().toISOString(),
      },
    );
    if (!result.success) {
      return result;
    }
    let entries = result.data.entries;
    if (offset !== undefined) {
      entries = entries.slice(offset);
    }
    if (limit !== undefined) {
      entries = entries.slice(0, limit);
    }
    return {
      success: true,
      data: {
        ...result.data,
        entries,
      },
    };
  }

  async getUserRanking(
    userId: string,
    leaderboardId: string,
  ): Promise<GamificationResult<LeaderboardRanking>> {
    const result = await this.loadLeaderboard(leaderboardId);
    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }
    const entry = result.data.entries.find((e) => e.userId === userId);
    if (!entry) {
      return {
        success: false,
        error: this.createError(
          "NotFoundError",
          `User ${userId} not found in leaderboard`,
          "NOT_FOUND",
        ),
      };
    }
    const totalParticipants = result.data.totalParticipants;
    const percentile = ((totalParticipants - entry.rank) / totalParticipants) * 100;
    return {
      success: true,
      data: {
        userId,
        rank: entry.rank,
        score: entry.score,
        percentile,
        aboveUsers: entry.rank - 1,
        belowUsers: totalParticipants - entry.rank,
      },
    };
  }

  async updateLeaderboardEntry(
    entry: LeaderboardEntry,
  ): Promise<GamificationResult<LeaderboardEntry>> {
    const result = await this.loadLeaderboard(entry.leaderboardId);
    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }
    const leaderboard = result.data;
    const index = leaderboard.entries.findIndex((e) => e.id === entry.id);
    if (index === -1) {
      leaderboard.entries.push(entry);
    } else {
      leaderboard.entries[index] = entry;
    }
    // Sort by score descending
    leaderboard.entries.sort((a, b) => b.score - a.score);
    // Update ranks
    leaderboard.entries.forEach((e, i) => {
      e.rank = i + 1;
    });
    leaderboard.totalParticipants = leaderboard.entries.length;
    leaderboard.lastUpdated = new Date().toISOString();
    const saveResult = await this.saveJson(
      STORAGE_KEYS.LEADERBOARDS(entry.leaderboardId),
      leaderboard,
    );
    if (!saveResult.success) {
      return {
        success: false,
        error: saveResult.error,
      };
    }
    return { success: true, data: entry };
  }

  // =============================================================================
  // REWARDS
  // =============================================================================

  async loadRewards(userId: string): Promise<GamificationResult<Reward[]>> {
    return this.loadJson<Reward[]>(STORAGE_KEYS.REWARDS(userId), []);
  }

  async saveReward(reward: Reward): Promise<GamificationResult<void>> {
    const result = await this.loadRewards(reward.userId);
    if (!result.success) {
      return result;
    }
    const rewards = result.data;
    const index = rewards.findIndex((r) => r.id === reward.id);
    if (index === -1) {
      rewards.push(reward);
    } else {
      rewards[index] = reward;
    }
    return this.saveJson(STORAGE_KEYS.REWARDS(reward.userId), rewards);
  }

  async claimReward(
    userId: string,
    rewardId: string,
  ): Promise<GamificationResult<RewardClaim>> {
    const result = await this.loadRewards(userId);
    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }
    const reward = result.data.find((r) => r.id === rewardId);
    if (!reward) {
      return {
        success: false,
        error: this.createError(
          "NotFoundError",
          `Reward ${rewardId} not found`,
          "NOT_FOUND",
        ),
      };
    }
    if (reward.claimed) {
      return {
        success: false,
        error: this.createError(
          "InvalidDataError",
          "Reward already claimed",
          "INVALID_DATA",
        ),
      };
    }
    reward.claimed = true;
    reward.claimedDate = new Date().toISOString();
    reward.updatedDate = new Date().toISOString();
    const saveResult = await this.saveReward(reward);
    if (!saveResult.success) {
      return {
        success: false,
        error: saveResult.error,
      };
    }
    const claim: RewardClaim = {
      id: `${Date.now()}-${Math.random()}`,
      userId,
      rewardId,
      pointsSpent: reward.pointsCost,
      claimedDate: reward.claimedDate,
    };
    return { success: true, data: claim };
  }

  // =============================================================================
  // PROGRESS
  // =============================================================================

  async loadProgress(
    userId: string,
    metric?: string,
  ): Promise<GamificationResult<Progress[]>> {
    const result = await this.loadJson<Progress[]>(STORAGE_KEYS.PROGRESS(userId), []);
    if (!result.success) {
      return result;
    }
    if (metric) {
      return {
        success: true,
        data: result.data.filter((p) => p.metric === metric),
      };
    }
    return result;
  }

  async saveProgress(progress: Progress): Promise<GamificationResult<void>> {
    const result = await this.loadProgress(progress.userId);
    if (!result.success) {
      return result;
    }
    const progresses = result.data;
    const index = progresses.findIndex((p) => p.id === progress.id);
    if (index === -1) {
      progresses.push(progress);
    } else {
      progresses[index] = progress;
    }
    return this.saveJson(STORAGE_KEYS.PROGRESS(progress.userId), progresses);
  }

  async updateProgress(update: ProgressUpdate): Promise<GamificationResult<Progress>> {
    const result = await this.loadProgress(update.userId, update.metric);
    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }
    let progress = result.data[0];
    if (!progress) {
      // Create new progress
      progress = {
        id: `${update.userId}-${update.metric}-${Date.now()}`,
        userId: update.userId,
        metric: update.metric,
        currentValue: update.increment,
        progress: 0,
        category: update.category,
        period: update.period,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      };
    } else {
      progress.currentValue += update.increment;
      if (progress.targetValue) {
        progress.progress = Math.min(100, (progress.currentValue / progress.targetValue) * 100);
      }
      progress.updatedDate = new Date().toISOString();
    }
    const saveResult = await this.saveProgress(progress);
    if (!saveResult.success) {
      return {
        success: false,
        error: saveResult.error,
      };
    }
    return { success: true, data: progress };
  }
}

export const storageGamificationRepository = new StorageGamificationRepository();

