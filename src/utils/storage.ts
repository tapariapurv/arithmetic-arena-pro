import { UserProfile } from "@/types/user";
import { LevelProgress } from "@/types/progression";
import { Achievement, PowerUp } from "@/types/rewards";

const STORAGE_KEYS = {
  USER_PROFILE: "math_master_user",
  LEVEL_PROGRESS: "math_master_progress",
  ACHIEVEMENTS: "math_master_achievements",
  POWER_UPS: "math_master_powerups",
  LEADERBOARD: "math_master_leaderboard",
};

export const storage = {
  getUserProfile: (): UserProfile | null => {
    const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return data ? JSON.parse(data) : null;
  },

  saveUserProfile: (profile: UserProfile) => {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  },

  getLevelProgress: (): Record<string, LevelProgress> => {
    const data = localStorage.getItem(STORAGE_KEYS.LEVEL_PROGRESS);
    return data ? JSON.parse(data) : {};
  },

  saveLevelProgress: (progress: Record<string, LevelProgress>) => {
    localStorage.setItem(STORAGE_KEYS.LEVEL_PROGRESS, JSON.stringify(progress));
  },

  getAchievements: (): Achievement[] => {
    const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    return data ? JSON.parse(data) : [];
  },

  saveAchievements: (achievements: Achievement[]) => {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  },

  getPowerUps: (): PowerUp[] => {
    const data = localStorage.getItem(STORAGE_KEYS.POWER_UPS);
    return data ? JSON.parse(data) : [];
  },

  savePowerUps: (powerUps: PowerUp[]) => {
    localStorage.setItem(STORAGE_KEYS.POWER_UPS, JSON.stringify(powerUps));
  },

  clearAllData: () => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  },
};
