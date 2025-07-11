const DAILY_STATS_KEY = 'levelyn-daily-stats';

export interface DailyStats {
  [date: string]: number;
}

const getTodayDateString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getDailyStats = (): DailyStats => {
  try {
    const stats = localStorage.getItem(DAILY_STATS_KEY);
    return stats ? JSON.parse(stats) : {};
  } catch (error) {
    console.error('Error reading daily stats from localStorage', error);
    return {};
  }
};

export const incrementDailyStat = (date: string = getTodayDateString()): void => {
  try {
    const stats = getDailyStats();
    stats[date] = (stats[date] || 0) + 1;
    localStorage.setItem(DAILY_STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Error writing daily stats to localStorage', error);
  }
};

export const decrementDailyStat = (date: string = getTodayDateString()): void => {
  try {
    const stats = getDailyStats();
    if (stats[date]) {
      stats[date] = Math.max(0, stats[date] - 1);
      localStorage.setItem(DAILY_STATS_KEY, JSON.stringify(stats));
    }
  } catch (error) {
    console.error('Error writing daily stats to localStorage', error);
  }
};

const TOTAL_COUNT_KEY = 'totalCompletedCount';

export const getTotalCount = (): number => {
  return parseInt(localStorage.getItem(TOTAL_COUNT_KEY) || '0', 10);
};

export const incrementTotalCount = (): number => {
  const currentCount = getTotalCount();
  const newCount = currentCount + 1;
  localStorage.setItem(TOTAL_COUNT_KEY, String(newCount));
  return newCount;
};

export const decrementTotalCount = (): number => {
  const currentCount = getTotalCount();
  const newCount = Math.max(0, currentCount - 1);
  localStorage.setItem(TOTAL_COUNT_KEY, String(newCount));
  return newCount;
};
