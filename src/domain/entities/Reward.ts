/**
 * Reward Entity
 * 
 * Represents rewards in the gamification system
 */

import type { PointTransaction } from './Point';

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

export type RewardRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

/**
 * Factory function to create reward
 */
export function createReward(
  props: Omit<Reward, 'id' | 'unlocked' | 'claimed' | 'createdDate' | 'updatedDate'>
): Reward {
  const now = new Date().toISOString();
  return {
    ...props,
    id: `reward-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    unlocked: false,
    claimed: false,
    createdDate: now,
    updatedDate: now,
  };
}

/**
 * Factory function to create points transaction
 */
export function createPointsTransaction(
  userId: string,
  amount: number,
  type: 'earn' | 'spend' | 'bonus',
  source: string,
  description: string
): PointTransaction {
  const now = new Date().toISOString();
  return {
    id: `transaction-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    userId,
    amount: type === 'spend' ? -Math.abs(amount) : Math.abs(amount),
    source,
    description,
    balance: 0, // Will be calculated by repository
    createdDate: now,
  };
}

/**
 * Calculate user level from total experience/points
 */
export function calculateLevel(totalPoints: number): number {
  // Simple level formula: level = floor(sqrt(points / 100))
  return Math.floor(Math.sqrt(totalPoints / 100));
}

/**
 * Calculate points needed for next level
 */
export function calculateNextLevelPoints(currentLevel: number): number {
  const nextLevel = currentLevel + 1;
  return Math.pow(nextLevel, 2) * 100;
}

/**
 * Check if reward is expired
 */
export function isRewardExpired(reward: Reward): boolean {
  if (!reward.expiresAt) return false;
  return new Date() > new Date(reward.expiresAt);
}

/**
 * Get points value for rarity
 */
export function getPointsForRarity(rarity: RewardRarity): number {
  const pointsMap: Record<RewardRarity, number> = {
    common: 50,
    uncommon: 100,
    rare: 250,
    epic: 500,
    legendary: 1000,
  };
  return pointsMap[rarity];
}



