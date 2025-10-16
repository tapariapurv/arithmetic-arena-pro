export interface ShopItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  type: "hearts" | "streak-freeze" | "xp-boost" | "double-coins" | "chest";
  amount?: number;
}
