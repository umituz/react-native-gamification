/**
 * Point Entity
 * 
 * Represents points in the gamification system
 */

export interface Point {
  id: string;
  userId: string;
  amount: number;
  source: string; // Source of points (e.g., "achievement", "action", "reward")
  sourceId?: string; // ID of the source (e.g., achievement ID)
  category?: string; // Category for grouping points
  description?: string;
  metadata?: Record<string, any>;
  createdDate: string;
}

export interface PointBalance {
  userId: string;
  total: number;
  byCategory: Record<string, number>; // Points grouped by category
  lastUpdated: string;
}

export interface PointTransaction {
  id: string;
  userId: string;
  amount: number; // Can be negative for deductions
  source: string;
  sourceId?: string;
  category?: string;
  description?: string;
  balance: number; // Balance after this transaction
  metadata?: Record<string, any>;
  createdDate: string;
}

