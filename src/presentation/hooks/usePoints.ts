/**
 * usePoints Hook
 * 
 * Hook for points operations
 */

import { useGamificationStore } from "../../infrastructure/storage/GamificationStore";
import type { PointBalance, PointTransaction } from "../../domain/entities/Point";

/**
 * Hook for points operations
 */
export const usePoints = () => {
  const store = useGamificationStore();

  return {
    pointBalance: store.pointBalance,
    pointTransactions: store.pointTransactions,
    loadPointBalance: store.loadPointBalance,
    loadPointTransactions: store.loadPointTransactions,
    addPoints: store.addPoints,
    deductPoints: store.deductPoints,
    getTotalPoints: (): number => {
      return store.pointBalance?.total || 0;
    },
    getPointsByCategory: (category: string): number => {
      return store.pointBalance?.byCategory[category] || 0;
    },
    getRecentTransactions: (limit: number = 10): PointTransaction[] => {
      return store.pointTransactions.slice(0, limit);
    },
  };
};

