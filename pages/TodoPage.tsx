
import React, { useState, useEffect, useCallback } from 'react';
import { useTasks } from '../hooks/useTasks';
// MODIFICATION: Import ThemeMode directly from types.ts
import { useTheme } from '../hooks/useTheme';
import { ThemeMode } from '../types'; // Added this import
import { useAnalytics } from '../hooks/useAnalytics';
import TaskList from '../components/TaskList';
import AddTaskForm from '../components/AddTaskForm';
import EditTaskModal from '../components/EditTaskModal';
import AnalyticsDisplay from '../components/AnalyticsDisplay';
import { Task } from '../types';
import { Filter, ListChecks, Sun, Moon, EyeOff } from 'lucide-react'; // EyeOff for Focus Mode

const TodoPage: React.FC = () => {
  const { tasks, clearCompletedTasks } = useTasks();
  const { theme, themeMode } = useTheme();
  const { updateActiveTasks } = useAnalytics();

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showFocusMode, setShowFocusMode] = useState<boolean>(false);

  useEffect(() => {
    updateActiveTasks(tasks.filter(task => !task.completed).length);
  }, [tasks, updateActiveTasks]);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingTask(null);
  };

  const handleClearCompleted = () => {
    const cleared = clearCompletedTasks();
    if (cleared.length > 0 && Notification.permission === 'granted') {
       new Notification(`${cleared.length} tasks cleared!`, {
         body: "Way to go on completing your tasks!",
         icon: '/icons/icon-48.png' // Placeholder
       });
    }
  };

  const requestNotificationPerms = useCallback(() => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification("Notifications Enabled!", { body: "You'll now receive task reminders." });
        }
      });
    }
  }, []);

  // Request notification permission on mount if not already set
  useEffect(() => {
    if (Notification.permission === "default") {
        requestNotificationPerms();
    }
  }, [requestNotificationPerms]);

  const completedTasksCount = tasks.filter(task => task.completed).length;

  // Automatically enable Focus Mode if the theme is Focus
  useEffect(() => {
    if (themeMode === ThemeMode.FOCUS) {
      setShowFocusMode(true);
    } else {
      // Optionally, you might want to persist focus mode choice separately
      // For now, it ties directly to the theme for simplicity
      setShowFocusMode(false); 
    }
  }, [themeMode]);

  return (
    <div className="container mx-auto max-w-3xl py-4">
      <h1 className={`text-4xl font-bold text-center mb-8 ${theme.textColor} flex items-center justify-center`}>
        {themeMode === ThemeMode.FOCUS ? <EyeOff size={36} className="mr-3"/> : themeMode === ThemeMode.DARK ? <Moon size={36} className="mr-3"/> : <Sun size={36} className="mr-3"/>}
        Minimal To-Do
      </h1>

      <AnalyticsDisplay />
      <AddTaskForm />

      <div className={`flex justify-between items-center mb-4 p-3 rounded-md ${theme.secondaryBg} shadow`}>
        <h2 className="text-2xl font-semibold flex items-center">
          <ListChecks size={28} className="mr-2 opacity-80" />
          Your Tasks
        </h2>
        <div className="flex items-center space-x-2">
          {themeMode !== ThemeMode.FOCUS && (
             <button
                onClick={() => setShowFocusMode(!showFocusMode)}
                title={showFocusMode ? "Exit Focus Mode" : "Enter Focus Mode"}
                className={`p-2 rounded-md ${theme.textColor} hover:bg-opacity-20 hover:${theme.cardBg} transition-colors ${showFocusMode ? theme.accentColor : ''}`}
            >
                <EyeOff size={20} />
            </button>
          )}
          {completedTasksCount > 0 && !showFocusMode && (
            <button
              onClick={handleClearCompleted}
              className={`px-3 py-2 text-sm rounded-md ${theme.accentColor.replace('text-','bg-')} text-white hover:opacity-90 transition-opacity flex items-center`}
            >
              <Filter size={16} className="mr-1" /> Clear Completed ({completedTasksCount})
            </button>
          )}
        </div>
      </div>

      <TaskList tasks={tasks} onEditTask={handleEditTask} filterCompleted={showFocusMode} />

      {editingTask && (
        <EditTaskModal
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
          taskToEdit={editingTask}
        />
      )}
    </div>
  );
};

export default TodoPage;