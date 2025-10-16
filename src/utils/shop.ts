import { ShopItem } from "@/types/shop";

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: "refill-hearts",
    name: "Refill Hearts",
    description: "Instantly refill all your hearts",
    icon: "Heart",
    price: 50,
    type: "hearts",
    amount: 5,
  },
  {
    id: "streak-freeze",
    name: "Streak Freeze",
    description: "Protect your streak for one day",
    icon: "Snowflake",
    price: 100,
    type: "streak-freeze",
    amount: 1,
  },
  {
    id: "xp-boost",
    name: "XP Boost",
    description: "Double XP for 30 minutes",
    icon: "Zap",
    price: 75,
    type: "xp-boost",
    amount: 1,
  },
  {
    id: "double-coins",
    name: "Double Coins",
    description: "Double coins for 30 minutes",
    icon: "Coins",
    price: 75,
    type: "double-coins",
    amount: 1,
  },
  {
    id: "common-chest",
    name: "Common Chest",
    description: "Random rewards",
    icon: "Gift",
    price: 150,
    type: "chest",
  },
];
