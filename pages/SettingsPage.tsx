
import React, { useState, ChangeEvent } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useTasks } from '../hooks/useTasks';
import { useAnalytics } from '../hooks/useAnalytics';
import { ThemeMode, Task } from '../types';
import { THEMES, LOCAL_STORAGE_KEYS } from '../constants';
import { Download, Upload, Trash2, Bell, Palette } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { themeMode, setThemeMode, theme } = useTheme();
  const { tasks, reorderTasks: setTasks } = useTasks(); // reorderTasks can set all tasks
  const { analytics, resetAnalytics } = useAnalytics();

  const handleThemeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setThemeMode(event.target.value as ThemeMode);
  };

  const handleExportData = () => {
    const dataToExport = {
      tasks,
      theme: themeMode,
      analytics,
      categories: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.CATEGORIES) || '[]'),
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(dataToExport, null, 2))}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = `minimal_todo_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleImportData = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          if (importedData.tasks) setTasks(importedData.tasks as Task[]);
          if (importedData.theme) setThemeMode(importedData.theme as ThemeMode);
          if (importedData.analytics) {
            // A more robust import would merge or validate analytics structure
            localStorage.setItem(LOCAL_STORAGE_KEYS.ANALYTICS, JSON.stringify(importedData.analytics));
            // Force analytics hook to re-read from localStorage - could be improved with a dedicated import function in useAnalytics
             window.location.reload(); // Simple way to force reload of all contexts
          }
          if (importedData.categories) {
            localStorage.setItem(LOCAL_STORAGE_KEYS.CATEGORIES, JSON.stringify(importedData.categories));
          }
          alert('Data imported successfully! The page will reload to apply all settings.');
        } catch (error) {
          console.error("Failed to import data:", error);
          alert('Failed to import data. Please check the file format.');
        }
      };
      reader.readAsText(file);
      event.target.value = ''; // Reset file input
    }
  };
  
  const requestNotificationPerm = () => {
     if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
      } else if (Notification.permission === "granted") {
        new Notification("Notifications are already enabled!");
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function (permission) {
          if (permission === "granted") {
            new Notification("Notifications Enabled!", { body: "You'll now receive task reminders."});
            localStorage.setItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS_PERMISSION, "granted");
          } else {
            localStorage.setItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS_PERMISSION, "denied");
          }
        });
      } else {
         alert("Notification permission was previously denied. Please enable it in your browser settings.");
      }
  };


  const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className={`p-6 rounded-xl ${theme.secondaryBg} shadow-lg mb-8`}>
      <h2 className={`text-2xl font-semibold mb-6 flex items-center ${theme.textColor}`}>
        {icon}
        <span className="ml-3">{title}</span>
      </h2>
      {children}
    </div>
  );

  const Button: React.FC<{ onClick?: () => void; children: React.ReactNode; className?: string; type?: "button" | "submit" | "reset" }> = 
    ({ onClick, children, className = '', type = "button" }) => (
    <button
        type={type}
        onClick={onClick}
        className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg ${theme.accentColor.replace('text-', 'bg-')} text-white hover:opacity-90 transition-opacity shadow-md hover:shadow-lg ${className}`}
    >
        {children}
    </button>
  );

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <h1 className={`text-4xl font-bold text-center mb-10 ${theme.textColor}`}>Settings</h1>

      <Section title="Appearance" icon={<Palette size={28} />}>
        <div className="mb-4">
          <label htmlFor="themeSelector" className={`block text-lg font-medium ${theme.textColor} mb-2`}>
            Theme
          </label>
          <select
            id="themeSelector"
            value={themeMode}
            onChange={handleThemeChange}
            className={`w-full p-3 ${theme.cardBg} ${theme.textColor} border ${theme.borderColor} rounded-lg focus:ring-2 focus:${theme.accentColor.replace('text-','ring-')} outline-none transition-all`}
          >
            {Object.values(ThemeMode).map(mode => (
              <option key={mode} value={mode}>
                {THEMES[mode].name}
              </option>
            ))}
          </select>
        </div>
        <p className={`text-sm ${theme.textColor} opacity-70`}>
          Current theme: <span className="font-semibold">{THEMES[themeMode].name}</span>. Changes are applied instantly.
        </p>
      </Section>

      <Section title="Notifications" icon={<Bell size={28} />}>
        <p className={`mb-4 ${theme.textColor} opacity-90`}>
          Enable browser notifications for due date reminders and task completions.
        </p>
        <Button onClick={requestNotificationPerm}>
          <Bell size={18} />
          <span>{Notification.permission === 'granted' ? 'Notifications Enabled' : 'Enable Notifications'}</span>
        </Button>
         {Notification.permission === 'denied' && <p className="text-sm text-red-500 mt-2">Notifications are currently disabled in your browser settings.</p>}
      </Section>

      <Section title="Data Management" icon={<Download size={28} />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className={`text-lg font-medium ${theme.textColor} mb-2`}>Export Data</h3>
            <p className={`text-sm ${theme.textColor} opacity-70 mb-3`}>
              Download all your tasks and settings as a JSON file.
            </p>
            <Button onClick={handleExportData}>
              <Download size={18} />
              <span>Export JSON</span>
            </Button>
          </div>
          <div>
            <h3 className={`text-lg font-medium ${theme.textColor} mb-2`}>Import Data</h3>
            <p className={`text-sm ${theme.textColor} opacity-70 mb-3`}>
              Import tasks and settings from a JSON file. This will overwrite existing data.
            </p>
            <label className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg ${theme.accentColor.replace('text-', 'bg-')} text-white hover:opacity-90 transition-opacity shadow-md hover:shadow-lg cursor-pointer`}>
              <Upload size={18} />
              <span>Import JSON</span>
              <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
            </label>
          </div>
        </div>
      </Section>
      
      <Section title="Reset Application" icon={<Trash2 size={28} className="text-red-500"/>}>
        <p className={`mb-4 ${theme.textColor} opacity-90`}>
          This will permanently delete all your tasks, analytics data, and reset all settings to their defaults. This action cannot be undone.
        </p>
        <Button 
            onClick={() => {
                if (window.confirm("Are you sure you want to reset all data? This cannot be undone.")) {
                    localStorage.removeItem(LOCAL_STORAGE_KEYS.TASKS);
                    localStorage.removeItem(LOCAL_STORAGE_KEYS.ANALYTICS);
                    localStorage.removeItem(LOCAL_STORAGE_KEYS.THEME);
                    localStorage.removeItem(LOCAL_STORAGE_KEYS.CATEGORIES);
                    localStorage.removeItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS_PERMISSION);
                    setTasks([]); // Clear tasks in current session
                    resetAnalytics(); // Reset analytics in current session
                    setThemeMode(ThemeMode.LIGHT); // Reset theme
                    alert("Application data has been reset. The page will reload.");
                    window.location.reload();
                }
            }}
            className="bg-red-600 hover:bg-red-700"
        >
          <Trash2 size={18} />
          <span>Reset All Data</span>
        </Button>
      </Section>

    </div>
  );
};

export default SettingsPage;
