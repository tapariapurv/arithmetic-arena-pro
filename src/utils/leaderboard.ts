import { LeaderboardEntry } from "@/types/game";

const LEADERBOARD_KEY = "math-practice-leaderboard";

export const getLeaderboard = (): LeaderboardEntry[] => {
  const stored = localStorage.getItem(LEADERBOARD_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const addLeaderboardEntry = (entry: LeaderboardEntry): void => {
  const leaderboard = getLeaderboard();
  leaderboard.push(entry);
  leaderboard.sort((a, b) => b.score - a.score);
  const topEntries = leaderboard.slice(0, 10);
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(topEntries));
};

export const clearLeaderboard = (): void => {
  localStorage.removeItem(LEADERBOARD_KEY);
};
