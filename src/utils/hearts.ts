export const MAX_HEARTS = 5;
export const HEART_REFILL_TIME_MS = 30 * 60 * 1000; // 30 minutes

export const getHeartRefillTime = (lastLostHeartTime: string): number => {
  const timePassed = Date.now() - new Date(lastLostHeartTime).getTime();
  const timeRemaining = Math.max(0, HEART_REFILL_TIME_MS - timePassed);
  return Math.ceil(timeRemaining / 1000 / 60); // minutes
};

export const shouldRefillHeart = (lastLostHeartTime: string): boolean => {
  const timePassed = Date.now() - new Date(lastLostHeartTime).getTime();
  return timePassed >= HEART_REFILL_TIME_MS;
};

export const formatHeartRefillTime = (minutes: number): string => {
  if (minutes <= 0) return "Ready";
  return `${minutes}m`;
};
