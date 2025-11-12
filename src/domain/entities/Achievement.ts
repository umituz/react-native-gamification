/**
 * Achievement Entity
 * 
 * Represents a user achievement in the gamification system
 */

export interface Achievement {
  id: string;
  userId: string;
  type: string; // Achievement type identifier (e.g., "first_goal", "streak_7_days")
  title: string;
  description: string;
  icon?: string;
  category?: string; // Category for grouping achievements
  unlocked: boolean;
  unlockedDate?: string;
  progress: number; // Current progress (0-100 or 0-requirement)
  requirement: number; // Required value to unlock
  points?: number; // Points awarded when unlocked
  rarity?: "common" | "rare" | "epic" | "legendary";
  metadata?: Record<string, any>; // Additional metadata
  createdDate: string;
  updatedDate: string;
}

export interface AchievementDefinition {
  type: string;
  title: string;
  description: string;
  icon?: string;
  category?: string;
  requirement: number;
  points?: number;
  rarity?: "common" | "rare" | "epic" | "legendary";
  metadata?: Record<string, any>;
}

export interface AchievementProgress {
  achievementId: string;
  userId: string;
  currentValue: number;
  requirement: number;
  progress: number; // Percentage (0-100)
  unlocked: boolean;
}

export type AchievementDifficulty = 'easy' | 'medium' | 'hard' | 'legendary';
export type AchievementCategory = 'milestone' | 'challenge' | 'streak' | 'social' | 'special';

/**
 * Factory function to create an achievement
 */
export function createAchievement(
  props: Omit<Achievement, 'id' | 'unlocked' | 'createdDate' | 'updatedDate'>
): Achievement {
  const now = new Date().toISOString();
  return {
    ...props,
    id: `achievement-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    unlocked: props.progress >= props.requirement,
    createdDate: now,
    updatedDate: now,
  };
}

/**
 * Check if achievement is complete
 */
export function isAchievementComplete(achievement: Achievement): boolean {
  return achievement.progress >= achievement.requirement;
}

/**
 * Calculate achievement progress percentage
 */
export function calculateAchievementProgress(achievement: Achievement): number {
  if (achievement.requirement === 0) return 0;
  return Math.min(100, Math.round((achievement.progress / achievement.requirement) * 100));
}

/**
 * Get points for achievement difficulty/rarity
 */
export function getPointsForDifficulty(rarity: Achievement['rarity'] | AchievementDifficulty): number {
  const pointsMap: Record<string, number> = {
    easy: 10,
    medium: 25,
    hard: 50,
    legendary: 100,
    common: 10,
    rare: 25,
    epic: 50,
  };
  return pointsMap[rarity || 'common'] || 10;
}



