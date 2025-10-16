export interface UserProfile {
  username: string;
  xp: number;
  level: number;
  hearts: number;
  maxHearts: number;
  coins: number;
  streak: number;
  lastPlayedDate: string;
  dailyXpGoal: number;
  dailyXpEarned: number;
  totalXpEarned: number;
  totalLevelsCompleted: number;
  createdAt: string;
}

export interface DailyStreak {
  currentStreak: number;
  longestStreak: number;
  lastPlayedDate: string;
  hasStreakFreeze: boolean;
}
