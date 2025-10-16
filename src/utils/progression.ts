import { Module, Level } from "@/types/progression";

export const MODULES: Module[] = [
  {
    id: "addition",
    title: "Addition",
    icon: "Plus",
    color: "from-green-500 to-emerald-600",
    levels: [
      { id: "add-1", moduleId: "addition", title: "Addition 1", description: "1-10", operation: "+", difficulty: "easy", questionsCount: 10, xpReward: 10, coinsReward: 5, unlocked: true, completed: false, stars: 0 },
      { id: "add-2", moduleId: "addition", title: "Addition 2", description: "1-20", operation: "+", difficulty: "easy", questionsCount: 10, xpReward: 15, coinsReward: 8, unlocked: false, completed: false, stars: 0 },
      { id: "add-3", moduleId: "addition", title: "Addition 3", description: "1-50", operation: "+", difficulty: "medium", questionsCount: 10, xpReward: 20, coinsReward: 10, unlocked: false, completed: false, stars: 0 },
      { id: "add-4", moduleId: "addition", title: "Addition 4", description: "1-100", operation: "+", difficulty: "hard", questionsCount: 10, xpReward: 30, coinsReward: 15, unlocked: false, completed: false, stars: 0 },
    ],
  },
  {
    id: "subtraction",
    title: "Subtraction",
    icon: "Minus",
    color: "from-blue-500 to-cyan-600",
    levels: [
      { id: "sub-1", moduleId: "subtraction", title: "Subtraction 1", description: "1-10", operation: "-", difficulty: "easy", questionsCount: 10, xpReward: 10, coinsReward: 5, unlocked: false, completed: false, stars: 0 },
      { id: "sub-2", moduleId: "subtraction", title: "Subtraction 2", description: "1-20", operation: "-", difficulty: "easy", questionsCount: 10, xpReward: 15, coinsReward: 8, unlocked: false, completed: false, stars: 0 },
      { id: "sub-3", moduleId: "subtraction", title: "Subtraction 3", description: "1-50", operation: "-", difficulty: "medium", questionsCount: 10, xpReward: 20, coinsReward: 10, unlocked: false, completed: false, stars: 0 },
      { id: "sub-4", moduleId: "subtraction", title: "Subtraction 4", description: "1-100", operation: "-", difficulty: "hard", questionsCount: 10, xpReward: 30, coinsReward: 15, unlocked: false, completed: false, stars: 0 },
    ],
  },
  {
    id: "multiplication",
    title: "Multiplication",
    icon: "X",
    color: "from-purple-500 to-pink-600",
    levels: [
      { id: "mult-1", moduleId: "multiplication", title: "Multiplication 1", description: "Tables 1-5", operation: "×", difficulty: "easy", questionsCount: 10, xpReward: 15, coinsReward: 8, unlocked: false, completed: false, stars: 0 },
      { id: "mult-2", moduleId: "multiplication", title: "Multiplication 2", description: "Tables 1-10", operation: "×", difficulty: "medium", questionsCount: 10, xpReward: 20, coinsReward: 10, unlocked: false, completed: false, stars: 0 },
      { id: "mult-3", moduleId: "multiplication", title: "Multiplication 3", description: "Tables 1-12", operation: "×", difficulty: "medium", questionsCount: 10, xpReward: 25, coinsReward: 12, unlocked: false, completed: false, stars: 0 },
      { id: "mult-4", moduleId: "multiplication", title: "Multiplication 4", description: "Mixed Hard", operation: "×", difficulty: "hard", questionsCount: 10, xpReward: 35, coinsReward: 18, unlocked: false, completed: false, stars: 0 },
    ],
  },
  {
    id: "division",
    title: "Division",
    icon: "Divide",
    color: "from-orange-500 to-red-600",
    levels: [
      { id: "div-1", moduleId: "division", title: "Division 1", description: "Simple", operation: "÷", difficulty: "easy", questionsCount: 10, xpReward: 15, coinsReward: 8, unlocked: false, completed: false, stars: 0 },
      { id: "div-2", moduleId: "division", title: "Division 2", description: "Tables 1-10", operation: "÷", difficulty: "medium", questionsCount: 10, xpReward: 20, coinsReward: 10, unlocked: false, completed: false, stars: 0 },
      { id: "div-3", moduleId: "division", title: "Division 3", description: "Tables 1-12", operation: "÷", difficulty: "medium", questionsCount: 10, xpReward: 25, coinsReward: 12, unlocked: false, completed: false, stars: 0 },
      { id: "div-4", moduleId: "division", title: "Division 4", description: "Mixed Hard", operation: "÷", difficulty: "hard", questionsCount: 10, xpReward: 35, coinsReward: 18, unlocked: false, completed: false, stars: 0 },
    ],
  },
];

export const calculateStars = (correctAnswers: number, totalQuestions: number): number => {
  const percentage = (correctAnswers / totalQuestions) * 100;
  if (percentage >= 90) return 3;
  if (percentage >= 70) return 2;
  if (percentage >= 50) return 1;
  return 0;
};

export const calculateXPForLevel = (level: number): number => {
  return level * 50;
};

export const getLevelFromXP = (xp: number): number => {
  return Math.floor(xp / 50) + 1;
};

export const getXPProgress = (xp: number): { current: number; needed: number; percentage: number } => {
  const level = getLevelFromXP(xp);
  const xpForCurrentLevel = (level - 1) * 50;
  const xpForNextLevel = level * 50;
  const current = xp - xpForCurrentLevel;
  const needed = xpForNextLevel - xpForCurrentLevel;
  const percentage = (current / needed) * 100;
  return { current, needed, percentage };
};
