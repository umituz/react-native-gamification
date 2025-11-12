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


