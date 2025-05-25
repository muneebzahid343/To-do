
import React from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import { useTheme } from '../hooks/useTheme';
import { BarChart2, CheckSquare, TrendingUp, Zap } from 'lucide-react';

const AnalyticsDisplay: React.FC = () => {
  const { analytics } = useAnalytics();
  const { theme } = useTheme();

  const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className={`${theme.cardBg} p-4 rounded-lg shadow-md flex items-center space-x-3`}>
      <div className={`${theme.accentColor} p-2 rounded-full`}>{icon}</div>
      <div>
        <p className="text-sm opacity-80">{title}</p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </div>
  );

  return (
    <div className={`mb-6 p-4 rounded-lg ${theme.secondaryBg} shadow-md`}>
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <BarChart2 size={24} className="mr-2 opacity-80" />
        Your Progress
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Completed Today" value={analytics.completedToday} icon={<CheckSquare size={20} className="text-white"/>} />
        <StatCard title="Total Completed" value={analytics.totalCompleted} icon={<TrendingUp size={20} className="text-white"/>} />
        <StatCard title="Current Streak" value={`${analytics.currentStreak} ${analytics.currentStreak === 1 ? 'day' : 'days'}`} icon={<Zap size={20} className="text-white"/>} />
        <StatCard title="Active Tasks" value={analytics.activeTasks} icon={<BarChart2 size={20} className="text-white"/>} />
      </div>
    </div>
  );
};

export default AnalyticsDisplay;
