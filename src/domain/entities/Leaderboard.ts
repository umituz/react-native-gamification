/**
 * Leaderboard Entity
 * 
 * Represents leaderboard entries in the gamification system
 */

export interface LeaderboardEntry {
  id: string;
  userId: string;
  leaderboardId: string; // Leaderboard identifier (e.g., "global", "weekly", "monthly")
  rank: number; // Current rank (1-based)
  score: number; // Score for ranking
  metric: string; // Metric used for ranking (e.g., "points", "experience", "streak")
  displayName?: string; // User's display name
  avatar?: string; // User's avatar URL
  metadata?: Record<string, any>;
  period?: "daily" | "weekly" | "monthly" | "all-time"; // Time period for leaderboard
  periodStart?: string; // Start date of the period
  periodEnd?: string; // End date of the period
  createdDate: string;
  updatedDate: string;
}

export interface Leaderboard {
  id: string;
  name: string;
  description?: string;
  metric: string; // Metric used for ranking
  period?: "daily" | "weekly" | "monthly" | "all-time";
  periodStart?: string;
  periodEnd?: string;
  entries: LeaderboardEntry[];
  totalParticipants: number;
  lastUpdated: string;
}

export interface LeaderboardRanking {
  userId: string;
  rank: number;
  score: number;
  percentile: number; // Percentile rank (0-100)
  aboveUsers: number; // Number of users above
  belowUsers: number; // Number of users below
}

export type LeaderboardCategory = 'points' | 'achievements' | 'streaks' | 'activity';

/**
 * Factory function to create leaderboard entry
 */
export function createLeaderboardEntry(
  props: Omit<LeaderboardEntry, 'id' | 'createdDate' | 'updatedDate' | 'change'> & { previousRank?: number }
): LeaderboardEntry {
  const now = new Date().toISOString();
  const change = props.previousRank ? props.previousRank - props.rank : 0;
  
  return {
    ...props,
    id: `entry-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    createdDate: now,
    updatedDate: now,
    metadata: {
      ...props.metadata,
      change,
    },
  };
}

/**
 * Calculate rank change indicator
 */
export function getRankChangeIndicator(change: number): '↑' | '↓' | '=' {
  if (change > 0) return '↑'; // Improved (moved up)
  if (change < 0) return '↓'; // Declined (moved down)
  return '='; // No change
}

/**
 * Get top N entries from leaderboard
 */
export function getTopEntries(
  leaderboard: Leaderboard,
  limit: number = 10
): LeaderboardEntry[] {
  return leaderboard.entries
    .sort((a, b) => a.rank - b.rank)
    .slice(0, limit);
}

/**
 * Find user's position in leaderboard
 */
export function findUserRank(
  leaderboard: Leaderboard,
  userId: string
): LeaderboardEntry | null {
  return leaderboard.entries.find((entry) => entry.userId === userId) || null;
}



