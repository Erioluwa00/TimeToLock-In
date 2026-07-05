export type TaskPriority = 'low' | 'medium' | 'high';

export type TaskCategory = 'coding' | 'school' | 'personal' | 'gaming' | 'finance' | 'health';

export interface Task {
  id: string;
  title: string;
  priority: TaskPriority;
  category: TaskCategory;
  deadline?: string; // YYYY-MM-DD format
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  estimatedTime?: number; // In minutes, default 25
  actualTime?: number; // In minutes, accumulated focus session time
}

export interface DailyStreak {
  count: number;
  lastActiveDate: string; // YYYY-MM-DD format
}

export type AppTheme = 'dark' | 'light' | 'purple' | 'forest' | 'ocean' | 'sunset';

export interface CategoryInfo {
  id: TaskCategory;
  name: string;
  icon: string;
  color: string;
}

export const CATEGORIES: Record<TaskCategory, CategoryInfo> = {
  coding: { id: 'coding', name: 'Coding', icon: '💻', color: 'var(--cat-coding)' },
  school: { id: 'school', name: 'School', icon: '📚', color: 'var(--cat-school)' },
  personal: { id: 'personal', name: 'Personal', icon: '🏠', color: 'var(--cat-personal)' },
  gaming: { id: 'gaming', name: 'Gaming', icon: '🎮', color: 'var(--cat-gaming)' },
  finance: { id: 'finance', name: 'Finance', icon: '💰', color: 'var(--cat-finance)' },
  health: { id: 'health', name: 'Health', icon: '❤️', color: 'var(--cat-health)' },
};
