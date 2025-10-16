import { Operation } from "./game";

export interface Level {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  operation: Operation;
  difficulty: "easy" | "medium" | "hard";
  questionsCount: number;
  xpReward: number;
  coinsReward: number;
  unlocked: boolean;
  completed: boolean;
  stars: number; // 0-3 stars based on performance
}

export interface Module {
  id: string;
  title: string;
  icon: string;
  color: string;
  levels: Level[];
}

export interface LevelProgress {
  levelId: string;
  completed: boolean;
  stars: number;
  bestScore: number;
  attempts: number;
}

export interface QuestionType {
  type: "multiple-choice" | "input";
  question: string;
  correctAnswer: number;
  options?: number[]; // for multiple choice
}
