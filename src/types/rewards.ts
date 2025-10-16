export type RewardType = "xp" | "coins" | "hearts" | "streak-freeze" | "xp-boost";

export interface Reward {
  type: RewardType;
  amount: number;
  name: string;
  icon: string;
}

export interface Chest {
  id: string;
  name: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  rewards: Reward[];
  unlocked: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  target: number;
  xpReward: number;
  category: "streak" | "xp" | "levels" | "perfect" | "special";
}

export interface PowerUp {
  id: string;
  name: string;
  description: string;
  icon: string;
  active: boolean;
  expiresAt?: string;
}
