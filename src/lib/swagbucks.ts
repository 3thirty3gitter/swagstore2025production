import { formatCAD } from './canadaData';

// SwagBucks Configuration
export const SWAGBUCKS_CONFIG = {
  earningRate: 0.10, // 10% of order subtotal
  minimumRedemption: 50, // 50 SwagBucks minimum
  swagBuckValue: 1, // 1 SwagBuck = $1 CAD
  maxEarningPerOrder: 500, // Maximum 500 SwagBucks per order
} as const;

// Calculate SwagBucks earned from order
export const calculateSwagBucksEarned = (orderSubtotal: number): number => {
  const earned = Math.floor(orderSubtotal * SWAGBUCKS_CONFIG.earningRate);
  return Math.min(earned, SWAGBUCKS_CONFIG.maxEarningPerOrder);
};

// Convert SwagBucks to CAD value
export const swagBucksToCAD = (swagBucks: number): string => {
  return formatCAD(swagBucks * SWAGBUCKS_CONFIG.swagBuckValue);
};

// Check if redemption amount is valid
export const isValidRedemption = (amount: number, balance: number): boolean => {
  return amount >= SWAGBUCKS_CONFIG.minimumRedemption && amount <= balance;
};

// Generate transaction ID
export const generateTransactionId = (): string => {
  return `sb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// SwagBucks transaction types
export enum SwagBucksTransactionType {
  EARNED = 'earned',
  REDEEMED = 'redeemed',
  ADJUSTMENT = 'adjustment',
  BONUS = 'bonus'
}

export interface SwagBucksTransaction {
  id: string;
  tenantId: string;
  type: SwagBucksTransactionType;
  amount: number;
  description: string;
  orderId?: string;
  createdAt: Date;
  createdBy: string;
  metadata?: Record<string, any>;
}

export interface SwagBucksBalance {
  tenantId: string;
  balance: number;
  totalEarned: number;
  totalRedeemed: number;
  lastUpdated: Date;
}
