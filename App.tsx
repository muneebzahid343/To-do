
import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { ThemeProvider, useTheme } from './hooks/useTheme';
import { TasksProvider } from './hooks/useTasks';
import TodoPage from './pages/TodoPage';
import SettingsPage from './pages/SettingsPage';
import { Home, Settings, Sun, Moon, Zap } from 'lucide-react';
import { ThemeMode } from './types';
import { AnalyticsProvider } from './hooks/useAnalytics';

const AppContent: React.FC = () => {
  const { theme, themeMode, setThemeMode } = useTheme();
  const location = useLocation();

  React.useEffect(() => {
    document.documentElement.classList.remove(ThemeMode.LIGHT, ThemeMode.DARK, ThemeMode.FOCUS);
    document.documentElement.classList.add(themeMode);
    if (themeMode === ThemeMode.DARK) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  const NavLink: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => (
    <Link
      to={to}
      className={`flex flex-col items-center p-2 rounded-lg transition-colors duration-200
        ${location.pathname === to ? `${theme.accentColor} ${theme.secondaryBg} font-semibold shadow-md` : `${theme.textColor} hover:${theme.secondaryBg} hover:opacity-80`}`}
      aria-label={label}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </Link>
  );
  
  const ThemeToggleButton: React.FC = () => {
    const nextTheme = () => {
      if (themeMode === ThemeMode.LIGHT) return ThemeMode.DARK;
      if (themeMode === ThemeMode.DARK) return ThemeMode.FOCUS;
      return ThemeMode.LIGHT;
    };

    const Icon = themeMode === ThemeMode.LIGHT ? Moon : themeMode === ThemeMode.DARK ? Zap : Sun;
    const label = themeMode === ThemeMode.LIGHT ? "Dark Mode" : themeMode === ThemeMode.DARK ? "Focus Mode" : "Light Mode";
    
    return (
      <button
        onClick={() => setThemeMode(nextTheme())}
        className={`p-2 rounded-lg transition-colors duration-200 ${theme.textColor} hover:${theme.secondaryBg} hover:opacity-80`}
        aria-label={`Switch to ${label}`}
      >
        <Icon size={24} />
      </button>
    );
  };


  return (
    <div className={`flex flex-col h-screen ${theme.primaryBg} ${theme.textColor} transition-colors duration-300`}>
      <main className="flex-grow overflow-y-auto p-4 md:p-6">
        <Routes>
          <Route path="/" element={<TodoPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
      <nav className={`${theme.secondaryBg} ${theme.borderColor} border-t shadow-lg p-2 flex justify-around items-center sticky bottom-0`}>
        <NavLink to="/" icon={<Home size={24} />} label="Tasks" />
        <ThemeToggleButton />
        <NavLink to="/settings" icon={<Settings size={24} />} label="Settings" />
      </nav>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AnalyticsProvider>
        <TasksProvider>
          <AppContent />
        </TasksProvider>
      </AnalyticsProvider>
    </ThemeProvider>
  );
};

export default App;
