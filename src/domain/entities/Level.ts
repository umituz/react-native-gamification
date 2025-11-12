/**
 * Level Entity
 * 
 * Represents user levels in the gamification system
 */

export interface Level {
  id: string;
  userId: string;
  currentLevel: number;
  currentExperience: number; // Current XP in current level
  totalExperience: number; // Total XP accumulated
  experienceToNextLevel: number; // XP needed for next level
  levelProgress: number; // Percentage progress in current level (0-100)
  metadata?: Record<string, any>;
  createdDate: string;
  updatedDate: string;
}

export interface LevelDefinition {
  level: number;
  experienceRequired: number; // Total XP required to reach this level
  title?: string;
  description?: string;
  rewards?: string[]; // Reward IDs or types
  metadata?: Record<string, any>;
}

export interface LevelProgress {
  userId: string;
  currentLevel: number;
  currentExperience: number;
  totalExperience: number;
  experienceToNextLevel: number;
  levelProgress: number;
  canLevelUp: boolean;
}


