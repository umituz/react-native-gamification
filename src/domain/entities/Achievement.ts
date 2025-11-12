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

