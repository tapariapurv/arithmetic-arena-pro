import { Achievement } from "@/types/rewards";

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-level",
    title: "First Steps",
    description: "Complete your first level",
    icon: "Trophy",
    unlocked: false,
    progress: 0,
    target: 1,
    xpReward: 10,
    category: "levels",
  },
  {
    id: "5-levels",
    title: "Quick Learner",
    description: "Complete 5 levels",
    icon: "Star",
    unlocked: false,
    progress: 0,
    target: 5,
    xpReward: 25,
    category: "levels",
  },
  {
    id: "10-levels",
    title: "Math Champion",
    description: "Complete 10 levels",
    icon: "Award",
    unlocked: false,
    progress: 0,
    target: 10,
    xpReward: 50,
    category: "levels",
  },
  {
    id: "3-day-streak",
    title: "Consistent",
    description: "Maintain a 3-day streak",
    icon: "Flame",
    unlocked: false,
    progress: 0,
    target: 3,
    xpReward: 15,
    category: "streak",
  },
  {
    id: "7-day-streak",
    title: "Dedicated",
    description: "Maintain a 7-day streak",
    icon: "Zap",
    unlocked: false,
    progress: 0,
    target: 7,
    xpReward: 30,
    category: "streak",
  },
  {
    id: "100-xp",
    title: "XP Hunter",
    description: "Earn 100 total XP",
    icon: "Target",
    unlocked: false,
    progress: 0,
    target: 100,
    xpReward: 20,
    category: "xp",
  },
  {
    id: "500-xp",
    title: "XP Master",
    description: "Earn 500 total XP",
    icon: "Crown",
    unlocked: false,
    progress: 0,
    target: 500,
    xpReward: 50,
    category: "xp",
  },
  {
    id: "perfect-level",
    title: "Perfectionist",
    description: "Complete a level with 3 stars",
    icon: "Sparkles",
    unlocked: false,
    progress: 0,
    target: 1,
    xpReward: 15,
    category: "perfect",
  },
];

export const checkAchievements = (
  achievements: Achievement[],
  stats: {
    levelsCompleted: number;
    streak: number;
    totalXP: number;
    stars?: number;
  }
): Achievement[] => {
  return achievements.map((achievement) => {
    if (achievement.unlocked) return achievement;

    let progress = achievement.progress;

    switch (achievement.category) {
      case "levels":
        progress = stats.levelsCompleted;
        break;
      case "streak":
        progress = stats.streak;
        break;
      case "xp":
        progress = stats.totalXP;
        break;
      case "perfect":
        if (stats.stars === 3) progress = 1;
        break;
    }

    const unlocked = progress >= achievement.target;

    return {
      ...achievement,
      progress,
      unlocked,
    };
  });
};
