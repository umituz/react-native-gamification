/**
 * Reward Entity
 * 
 * Represents rewards in the gamification system
 */

export interface Reward {
  id: string;
  userId: string;
  type: string; // Reward type (e.g., "badge", "unlock", "discount", "item")
  title: string;
  description?: string;
  icon?: string;
  category?: string;
  pointsCost?: number; // Points required to claim
  levelRequired?: number; // Level required to claim
  unlocked: boolean;
  unlockedDate?: string;
  claimed: boolean;
  claimedDate?: string;
  expiresAt?: string; // Expiration date for time-limited rewards
  metadata?: Record<string, any>;
  createdDate: string;
  updatedDate: string;
}

export interface RewardDefinition {
  type: string;
  title: string;
  description?: string;
  icon?: string;
  category?: string;
  pointsCost?: number;
  levelRequired?: number;
  rarity?: "common" | "rare" | "epic" | "legendary";
  expiresAt?: string;
  metadata?: Record<string, any>;
}

export interface RewardClaim {
  id: string;
  userId: string;
  rewardId: string;
  pointsSpent?: number;
  claimedDate: string;
  metadata?: Record<string, any>;
}

