/**
 * Progress Entity
 * 
 * Represents user progress tracking in the gamification system
 */

export interface Progress {
  id: string;
  userId: string;
  metric: string; // Metric identifier (e.g., "goals_completed", "sessions_attended")
  currentValue: number; // Current value
  targetValue?: number; // Target value (optional)
  progress: number; // Percentage progress (0-100)
  unit?: string; // Unit of measurement (e.g., "times", "hours", "days")
  category?: string; // Category for grouping
  period?: "daily" | "weekly" | "monthly" | "all-time"; // Time period
  periodStart?: string; // Start date of the period
  periodEnd?: string; // End date of the period
  metadata?: Record<string, any>;
  createdDate: string;
  updatedDate: string;
}

export interface ProgressUpdate {
  userId: string;
  metric: string;
  increment: number; // Amount to increment
  category?: string;
  period?: "daily" | "weekly" | "monthly" | "all-time";
  metadata?: Record<string, any>;
}

export interface ProgressMilestone {
  metric: string;
  value: number;
  title: string;
  description?: string;
  reward?: string; // Reward ID or type
  metadata?: Record<string, any>;
}

