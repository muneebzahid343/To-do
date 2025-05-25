
import { Category, Theme, ThemeMode, Priority } from './types';

export const APP_NAME = 'Minimal To-Do';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'work', name: 'Work', color: 'bg-sky-500' },
  { id: 'personal', name: 'Personal', color: 'bg-emerald-500' },
  { id: 'study', name: 'Study', color: 'bg-amber-500' },
  { id: 'errands', name: 'Errands', color: 'bg-violet-500' },
];

export const PRIORITIES_CONFIG: Record<Priority, { color: string; icon?: React.ReactNode }> = {
  [Priority.HIGH]: { color: 'text-red-500' },
  [Priority.MEDIUM]: { color: 'text-yellow-500' },
  [Priority.LOW]: { color: 'text-green-500' },
};


export const THEMES: Record<ThemeMode, Theme> = {
  [ThemeMode.LIGHT]: {
    name: 'Light',
    mode: ThemeMode.LIGHT,
    primaryBg: 'bg-slate-100',
    secondaryBg: 'bg-white',
    cardBg: 'bg-white',
    textColor: 'text-slate-800',
    accentColor: 'text-blue-600',
    borderColor: 'border-slate-200',
    shadowColor: 'shadow-slate-300'
  },
  [ThemeMode.DARK]: {
    name: 'Dark',
    mode: ThemeMode.DARK,
    primaryBg: 'bg-slate-900',
    secondaryBg: 'bg-slate-800',
    cardBg: 'bg-slate-800',
    textColor: 'text-slate-100',
    accentColor: 'text-sky-400',
    borderColor: 'border-slate-700',
    shadowColor: 'shadow-black'
  },
  [ThemeMode.FOCUS]: {
    name: 'Focus',
    mode: ThemeMode.FOCUS,
    primaryBg: 'bg-indigo-900', // Deep calming blue/purple
    secondaryBg: 'bg-indigo-800',
    cardBg: 'bg-indigo-800 glassmorphism-bg', // Example of glassmorphism
    textColor: 'text-indigo-100',
    accentColor: 'text-pink-400',
    borderColor: 'border-indigo-700',
    shadowColor: 'shadow-black'
  },
};

export const LOCAL_STORAGE_KEYS = {
  TASKS: 'minimalTodoTasks',
  THEME: 'minimalTodoTheme',
  ANALYTICS: 'minimalTodoAnalytics',
  CATEGORIES: 'minimalTodoCategories',
  NOTIFICATIONS_PERMISSION: 'minimalTodoNotificationsPermission',
};
