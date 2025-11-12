/**
 * Streak Entity
 * 
 * Represents user streaks in the gamification system
 */

export interface Streak {
  id: string;
  userId: string;
  type: string; // Streak type (e.g., "daily_login", "daily_goal", "weekly_workout")
  currentStreak: number; // Current consecutive days/actions
  longestStreak: number; // Longest streak ever achieved
  lastActivityDate: string; // Last date when streak was maintained
  isActive: boolean; // Whether streak is currently active
  metadata?: Record<string, any>;
  createdDate: string;
  updatedDate: string;
}

export interface StreakDefinition {
  type: string;
  name: string;
  description?: string;
  resetOnMiss: boolean; // Whether streak resets if missed
  timezone?: string; // Timezone for daily streaks
  metadata?: Record<string, any>;
}

export interface StreakProgress {
  userId: string;
  type: string;
  currentStreak: number;
  longestStreak: number;
  isActive: boolean;
  daysUntilMilestone?: number; // Days until next milestone (7, 30, 100, etc.)
  nextMilestone?: number; // Next milestone value
}

