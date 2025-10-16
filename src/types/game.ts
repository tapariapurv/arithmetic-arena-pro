export type Difficulty = "easy" | "medium" | "hard";
export type Operation = "+" | "-" | "×" | "÷";

export interface Question {
  num1: number;
  num2: number;
  operation: Operation;
  answer: number;
}

export interface GameStats {
  score: number;
  streak: number;
  bestStreak: number;
  totalQuestions: number;
  correctAnswers: number;
  bonusPoints: number;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
  difficulty: Difficulty;
}
