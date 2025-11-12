/**
 * Gamification Repository Interface
 * 
 * Unified repository interface for all gamification operations
 * App-specific implementations should extend this interface
 */

import type { Achievement, AchievementDefinition, AchievementProgress } from "../entities/Achievement";
import type { Point, PointBalance, PointTransaction } from "../entities/Point";
import type { Level, LevelDefinition, LevelProgress } from "../entities/Level";
import type { Streak, StreakDefinition, StreakProgress } from "../entities/Streak";
import type { Leaderboard, LeaderboardEntry, LeaderboardRanking } from "../entities/Leaderboard";
import type { Reward, RewardDefinition, RewardClaim } from "../entities/Reward";
import type { Progress, ProgressUpdate, ProgressMilestone } from "../entities/Progress";

export interface GamificationError extends Error {
  code: "LOAD_FAILED" | "SAVE_FAILED" | "NOT_FOUND" | "INVALID_DATA" | "OPERATION_FAILED";
}

export type GamificationResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: GamificationError;
    };

/**
 * Unified Gamification Repository Interface
 * 
 * Provides a single interface for all gamification operations
 * App-specific implementations should implement this interface
 */
export interface IGamificationRepository {
  // =============================================================================
  // ACHIEVEMENTS
  // =============================================================================

  /**
   * Load all achievements for a user
   */
  loadAchievements(userId: string): Promise<GamificationResult<Achievement[]>>;

  /**
   * Save achievements
   */
  saveAchievements(achievements: Achievement[]): Promise<GamificationResult<void>>;

  /**
   * Get achievement by ID
   */
  getAchievementById(userId: string, achievementId: string): Promise<GamificationResult<Achievement>>;

  /**
   * Update achievement progress
   */
  updateAchievementProgress(
    userId: string,
    achievementId: string,
    progress: number,
  ): Promise<GamificationResult<Achievement>>;

  /**
   * Unlock achievement
   */
  unlockAchievement(userId: string, achievementId: string): Promise<GamificationResult<Achievement>>;

  // =============================================================================
  // POINTS
  // =============================================================================

  /**
   * Load point balance for a user
   */
  loadPointBalance(userId: string): Promise<GamificationResult<PointBalance>>;

  /**
   * Load point transactions for a user
   */
  loadPointTransactions(
    userId: string,
    limit?: number,
  ): Promise<GamificationResult<PointTransaction[]>>;

  /**
   * Add points to user
   */
  addPoints(
    userId: string,
    amount: number,
    source: string,
    sourceId?: string,
    category?: string,
    description?: string,
  ): Promise<GamificationResult<PointTransaction>>;

  /**
   * Deduct points from user
   */
  deductPoints(
    userId: string,
    amount: number,
    source: string,
    sourceId?: string,
    description?: string,
  ): Promise<GamificationResult<PointTransaction>>;

  // =============================================================================
  // LEVELS
  // =============================================================================

  /**
   * Load user level
   */
  loadLevel(userId: string): Promise<GamificationResult<Level>>;

  /**
   * Save user level
   */
  saveLevel(level: Level): Promise<GamificationResult<void>>;

  /**
   * Add experience to user
   */
  addExperience(
    userId: string,
    amount: number,
    source?: string,
  ): Promise<GamificationResult<LevelProgress>>;

  // =============================================================================
  // STREAKS
  // =============================================================================

  /**
   * Load streaks for a user
   */
  loadStreaks(userId: string): Promise<GamificationResult<Streak[]>>;

  /**
   * Load streak by type
   */
  loadStreakByType(userId: string, type: string): Promise<GamificationResult<Streak>>;

  /**
   * Save streak
   */
  saveStreak(streak: Streak): Promise<GamificationResult<void>>;

  /**
   * Update streak activity
   */
  updateStreakActivity(
    userId: string,
    type: string,
    activityDate: string,
  ): Promise<GamificationResult<Streak>>;

  // =============================================================================
  // LEADERBOARDS
  // =============================================================================

  /**
   * Load leaderboard
   */
  loadLeaderboard(
    leaderboardId: string,
    limit?: number,
    offset?: number,
  ): Promise<GamificationResult<Leaderboard>>;

  /**
   * Get user ranking in leaderboard
   */
  getUserRanking(
    userId: string,
    leaderboardId: string,
  ): Promise<GamificationResult<LeaderboardRanking>>;

  /**
   * Update leaderboard entry
   */
  updateLeaderboardEntry(
    entry: LeaderboardEntry,
  ): Promise<GamificationResult<LeaderboardEntry>>;

  // =============================================================================
  // REWARDS
  // =============================================================================

  /**
   * Load rewards for a user
   */
  loadRewards(userId: string): Promise<GamificationResult<Reward[]>>;

  /**
   * Save reward
   */
  saveReward(reward: Reward): Promise<GamificationResult<void>>;

  /**
   * Claim reward
   */
  claimReward(
    userId: string,
    rewardId: string,
  ): Promise<GamificationResult<RewardClaim>>;

  // =============================================================================
  // PROGRESS
  // =============================================================================

  /**
   * Load progress for a user
   */
  loadProgress(
    userId: string,
    metric?: string,
  ): Promise<GamificationResult<Progress[]>>;

  /**
   * Save progress
   */
  saveProgress(progress: Progress): Promise<GamificationResult<void>>;

  /**
   * Update progress
   */
  updateProgress(update: ProgressUpdate): Promise<GamificationResult<Progress>>;
}



