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
} from "./domain/entities/Streak";

export type {
  Leaderboard,
  LeaderboardEntry,
  LeaderboardRanking,
} from "./domain/entities/Leaderboard";

export type {
  Reward,
  RewardDefinition,
  RewardClaim,
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

