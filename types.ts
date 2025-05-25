
export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number; // Timestamp
  dueDate?: number; // Timestamp
  category?: string;
  priority: Priority;
}

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  FOCUS = 'focus', // A specific theme for focus
}

export interface Theme {
  name: string;
  mode: ThemeMode;
  primaryBg: string;
  secondaryBg: string;
  cardBg: string;
  textColor: string;
  accentColor: string;
  borderColor: string;
  shadowColor: string; // For neumorphism
}

export interface Category {
  id: string;
  name: string;
  color: string; // Tailwind color class e.g., 'bg-blue-500'
}

export interface AnalyticsData {
  completedToday: number;
  totalCompleted: number;
  activeTasks: number;
  currentStreak: number; // Days in a row with at least one completed task
  longestStreak: number;
}
