/**
 * @umituz/react-native-gamification - Public API
 *
 * Comprehensive gamification system for React Native apps
 *
 * Usage:
 *   import { useGamification, useAchievements, usePoints } from '@umituz/react-native-gamification';
 */

// =============================================================================
// DOMAIN LAYER - Entities
// =============================================================================

export type {
  Achievement,
  AchievementDefinition,
  AchievementProgress,
  AchievementDifficulty,
  AchievementCategory,
} from "./domain/entities/Achievement";
export {
  createAchievement,
  isAchievementComplete,
  calculateAchievementProgress,
  getPointsForDifficulty,
} from "./domain/entities/Achievement";

export type {
  Point,
  PointBalance,
  PointTransaction,
} from "./domain/entities/Point";

export type {
  Level,
  LevelDefinition,
  LevelProgress,
} from "./domain/entities/Level";

export type {
  Streak,
  StreakDefinition,
  StreakProgress,
  StreakMilestone,
} from "./domain/entities/Streak";
export {
  createStreakEntity,
  isStreakActive,
  isStreakBroken,
  updateStreakWithActivity,
  getStreakMilestones,
  getNextMilestone,
  getDaysUntilStreakBreak,
} from "./domain/entities/Streak";

export type {
  Leaderboard,
  LeaderboardEntry,
  LeaderboardRanking,
  LeaderboardCategory,
} from "./domain/entities/Leaderboard";
export {
  createLeaderboardEntry,
  getRankChangeIndicator,
  getTopEntries,
  findUserRank,
} from "./domain/entities/Leaderboard";

export type {
  Reward,
  RewardDefinition,
  RewardClaim,
  RewardRarity,
} from "./domain/entities/Reward";
export {
  createReward,
  createPointsTransaction,
  calculateLevel,
  calculateNextLevelPoints,
  isRewardExpired,
  getPointsForRarity,
} from "./domain/entities/Reward";

export type {
  Progress,
  ProgressUpdate,
  ProgressMilestone,
} from "./domain/entities/Progress";

// =============================================================================
// DOMAIN LAYER - Repository Interface
// =============================================================================

export type {
  IGamificationRepository,
  GamificationError,
  GamificationResult,
} from "./domain/repositories/IGamificationRepository";

// =============================================================================
// INFRASTRUCTURE LAYER
// =============================================================================

export { storageGamificationRepository } from "./infrastructure/repositories/StorageGamificationRepository";
export { useGamificationStore } from "./infrastructure/storage/GamificationStore";

// =============================================================================
// PRESENTATION LAYER - Hooks
// =============================================================================

export {
  useGamification,
  useGamificationInitializer,
  useGamificationRepository,
} from "./presentation/hooks/useGamification";

export { useAchievements } from "./presentation/hooks/useAchievements";
export { usePoints } from "./presentation/hooks/usePoints";
export { useLevel } from "./presentation/hooks/useLevel";
export { useStreaks } from "./presentation/hooks/useStreaks";
export { useRewards } from "./presentation/hooks/useRewards";
export { useProgress } from "./presentation/hooks/useProgress";



