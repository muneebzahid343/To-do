
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Task, Priority } from '../types';
import { LOCAL_STORAGE_KEYS } from '../constants';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

interface TasksContextType {
  tasks: Task[];
  addTask: (text: string, priority: Priority, dueDate?: number, category?: string) => void;
  editTask: (id: string, newText: string, newPriority: Priority, newDueDate?: number, newCategory?: string) => void;
  toggleTask: (id: string) => { task: Task, wasCompleted: boolean };
  deleteTask: (id: string) => void;
  reorderTasks: (tasks: Task[]) => void;
  clearCompletedTasks: () => Task[]; // Returns the tasks that were cleared
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEYS.TASKS);
      return storedTasks ? JSON.parse(storedTasks) : [];
    } catch (error) {
      console.error("Error loading tasks from localStorage:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (error) {
      console.error("Error saving tasks to localStorage:", error);
    }
  }, [tasks]);

  const addTask = useCallback((text: string, priority: Priority, dueDate?: number, category?: string) => {
    const newTask: Task = {
      id: uuidv4(),
      text,
      completed: false,
      createdAt: Date.now(),
      priority,
      dueDate,
      category,
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
  }, []);

  const editTask = useCallback((id: string, newText: string, newPriority: Priority, newDueDate?: number, newCategory?: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, text: newText, priority: newPriority, dueDate: newDueDate, category: newCategory } : task
      )
    );
  }, []);

  const toggleTask = useCallback((id: string): { task: Task, wasCompleted: boolean } => {
    let toggledTask: Task | undefined;
    let wasCompletedBeforeToggle = false;
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === id) {
          wasCompletedBeforeToggle = task.completed;
          toggledTask = { ...task, completed: !task.completed };
          return toggledTask;
        }
        return task;
      })
    );
    if (!toggledTask) throw new Error("Task not found for toggling");
    return { task: toggledTask, wasCompleted: !wasCompletedBeforeToggle }; // wasCompleted is true if the task is now completed
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  }, []);

  const reorderTasks = useCallback((newTasks: Task[]) => {
    setTasks(newTasks);
  }, []);

  const clearCompletedTasks = useCallback((): Task[] => {
    const completedTasks = tasks.filter(task => task.completed);
    setTasks(prevTasks => prevTasks.filter(task => !task.completed));
    return completedTasks;
  }, [tasks]);

  // Fix: Replaced JSX with React.createElement because this is a .ts file, not .tsx.
  // This resolves JSX parsing errors and the component's return type issue.
  return React.createElement(
    TasksContext.Provider,
    { value: { tasks, addTask, editTask, toggleTask, deleteTask, reorderTasks, clearCompletedTasks } },
    children
  );
};

export const useTasks = (): TasksContextType => {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
};
