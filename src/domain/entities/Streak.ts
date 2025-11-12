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

export interface StreakMilestone {
  days: number;
  name: string;
  reward: number; // Points awarded
  achieved: boolean;
}

/**
 * Factory function to create streak entity
 */
export function createStreakEntity(userId: string, type: string): Streak {
  const now = new Date().toISOString();
  return {
    id: `streak-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    userId,
    type,
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: now,
    isActive: false,
    createdDate: now,
    updatedDate: now,
  };
}

/**
 * Check if streak should continue (activity within last 24 hours)
 */
export function isStreakActive(streak: Streak): boolean {
  const now = new Date();
  const lastActivity = new Date(streak.lastActivityDate);
  const hoursSinceLastActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);

  return hoursSinceLastActivity <= 24;
}

/**
 * Check if streak is broken (no activity for more than 48 hours)
 */
export function isStreakBroken(streak: Streak): boolean {
  const now = new Date();
  const lastActivity = new Date(streak.lastActivityDate);
  const hoursSinceLastActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);

  return hoursSinceLastActivity > 48;
}

/**
 * Update streak with new activity
 */
export function updateStreakWithActivity(streak: Streak): Streak {
  const now = new Date().toISOString();

  // Check if streak is broken
  if (isStreakBroken(streak)) {
    return {
      ...streak,
      currentStreak: 1,
      longestStreak: Math.max(1, streak.longestStreak),
      lastActivityDate: now,
      isActive: true,
      updatedDate: now,
    };
  }

  // Continue streak
  const newStreak = streak.currentStreak + 1;
  const newLongestStreak = Math.max(newStreak, streak.longestStreak);

  return {
    ...streak,
    currentStreak: newStreak,
    longestStreak: newLongestStreak,
    lastActivityDate: now,
    isActive: true,
    updatedDate: now,
  };
}

/**
 * Get streak milestones
 */
export function getStreakMilestones(currentStreak: number): StreakMilestone[] {
  const milestones: StreakMilestone[] = [
    { days: 7, name: 'Week Warrior', reward: 50, achieved: currentStreak >= 7 },
    { days: 14, name: 'Fortnight Fighter', reward: 100, achieved: currentStreak >= 14 },
    { days: 30, name: 'Monthly Master', reward: 250, achieved: currentStreak >= 30 },
    { days: 60, name: 'Consistency Champion', reward: 500, achieved: currentStreak >= 60 },
    { days: 100, name: 'Century Star', reward: 1000, achieved: currentStreak >= 100 },
    { days: 365, name: 'Yearly Legend', reward: 5000, achieved: currentStreak >= 365 },
  ];

  return milestones;
}

/**
 * Get next milestone for motivation
 */
export function getNextMilestone(currentStreak: number): StreakMilestone | null {
  const milestones = getStreakMilestones(currentStreak);
  return milestones.find((m) => !m.achieved) || null;
}

/**
 * Calculate days until streak break
 */
export function getDaysUntilStreakBreak(streak: Streak): number {
  const now = new Date();
  const lastActivity = new Date(streak.lastActivityDate);
  const hoursRemaining = 48 - (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);

  return Math.max(0, Math.ceil(hoursRemaining / 24));
}



