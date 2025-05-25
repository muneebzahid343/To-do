
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AnalyticsData, Task } from '../types';
import { LOCAL_STORAGE_KEYS } from '../constants';
import { isToday, isSameDay, subDays } from 'date-fns';

interface AnalyticsContextType {
  analytics: AnalyticsData;
  recordTaskCompletion: (task: Task) => void;
  resetAnalytics: () => void;
  updateActiveTasks: (count: number) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

const defaultAnalytics: AnalyticsData = {
  completedToday: 0,
  totalCompleted: 0,
  activeTasks: 0,
  currentStreak: 0,
  longestStreak: 0,
};

// Helper to get last completion date
const getLastCompletionDate = (): Date | null => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEYS.ANALYTICS);
  if (data) {
    const parsed = JSON.parse(data);
    return parsed.lastCompletionDate ? new Date(parsed.lastCompletionDate) : null;
  }
  return null;
};

// Helper to save last completion date
const saveLastCompletionDate = (date: Date) => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEYS.ANALYTICS);
  const parsed = data ? JSON.parse(data) : {};
  localStorage.setItem(LOCAL_STORAGE_KEYS.ANALYTICS, JSON.stringify({ ...parsed, lastCompletionDate: date.toISOString() }));
};


export const AnalyticsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [analytics, setAnalytics] = useState<AnalyticsData>(() => {
    try {
      const storedAnalytics = localStorage.getItem(LOCAL_STORAGE_KEYS.ANALYTICS);
      if (storedAnalytics) {
        const parsed = JSON.parse(storedAnalytics);
        // Reset completedToday if it's not today
        if (parsed.lastCompletionDate && !isToday(new Date(parsed.lastCompletionDate))) {
          parsed.completedToday = 0;
        }
        return { ...defaultAnalytics, ...parsed };
      }
      return defaultAnalytics;
    } catch (error) {
      console.error("Error loading analytics from localStorage:", error);
      return defaultAnalytics;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.ANALYTICS, JSON.stringify(analytics));
    } catch (error) {
      console.error("Error saving analytics to localStorage:", error);
    }
  }, [analytics]);

  const recordTaskCompletion = useCallback((task: Task) => {
    setAnalytics(prev => {
      const now = new Date();
      let newCurrentStreak = prev.currentStreak;
      let newLongestStreak = prev.longestStreak;
      const lastCompletion = getLastCompletionDate();

      if (isToday(now)) { // Task completed today
        if (!lastCompletion || !isToday(lastCompletion)) { // First completion today or new day
          newCurrentStreak = (lastCompletion && isSameDay(subDays(now,1), lastCompletion)) ? prev.currentStreak + 1 : 1;
        }
      } else { // This case should ideally not happen if date checks are right
         newCurrentStreak = 1;
      }
      
      if (newCurrentStreak > newLongestStreak) {
        newLongestStreak = newCurrentStreak;
      }
      
      saveLastCompletionDate(now);

      return {
        ...prev,
        completedToday: prev.completedToday + 1,
        totalCompleted: prev.totalCompleted + 1,
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
      };
    });
  }, []);

  const updateActiveTasks = useCallback((count: number) => {
    setAnalytics(prev => ({ ...prev, activeTasks: count }));
  }, []);


  const resetAnalytics = useCallback(() => {
    setAnalytics(defaultAnalytics);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.ANALYTICS); // Clear last completion date too
  }, []);

  // Effect to reset daily counts if the day changes
  useEffect(() => {
    const lastKnownCompletionDate = getLastCompletionDate();
    if (lastKnownCompletionDate && !isToday(lastKnownCompletionDate)) {
      setAnalytics(prev => ({ ...prev, completedToday: 0 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Check on mount


  // Fix: Replaced JSX with React.createElement because this is a .ts file, not .tsx.
  // This resolves JSX parsing errors and the component's return type issue.
  return React.createElement(
    AnalyticsContext.Provider,
    { value: { analytics, recordTaskCompletion, resetAnalytics, updateActiveTasks } },
    children
  );
};

export const useAnalytics = (): AnalyticsContextType => {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};
