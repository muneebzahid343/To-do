
import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useTheme } from '../hooks/useTheme';
import { Priority, Category } from '../types';
import { Plus, Calendar, Tag, AlertTriangle } from 'lucide-react';
import { DEFAULT_CATEGORIES, PRIORITIES_CONFIG } from '../constants';

interface AddTaskFormProps {
  onTaskAdded?: () => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onTaskAdded }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [dueDate, setDueDate] = useState<string>(''); // Store as string for input type="date"
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showExtraOptions, setShowExtraOptions] = useState(false);

  const { addTask } = useTasks();
  const { theme } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);

  const categories: Category[] = DEFAULT_CATEGORIES; // Potentially make this dynamic from settings later

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (text.trim() === '') return;
    
    const dueDateTimeStamp = dueDate ? new Date(dueDate).getTime() : undefined;
    addTask(text.trim(), priority, dueDateTimeStamp, selectedCategory || undefined);
    setText('');
    setPriority(Priority.MEDIUM);
    setDueDate('');
    setSelectedCategory('');
    setShowExtraOptions(false);
    inputRef.current?.focus();
    if (onTaskAdded) onTaskAdded();
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setText('');
        setShowExtraOptions(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);


  return (
    <form onSubmit={handleSubmit} className={`p-4 rounded-lg ${theme.secondaryBg} shadow-lg mb-6`}>
      <div className="flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new task..."
          className={`flex-grow p-3 ${theme.cardBg} ${theme.textColor} border ${theme.borderColor} rounded-l-md focus:ring-2 focus:${theme.accentColor.replace('text-','ring-')} focus:border-transparent outline-none transition-shadow`}
          onFocus={() => setShowExtraOptions(true)}
        />
        <button
          type="submit"
          className={`p-3 ${theme.accentColor.replace('text-','bg-')} text-white rounded-r-md hover:opacity-90 transition-opacity flex items-center justify-center h-full aspect-square`}
          aria-label="Add task"
        >
          <Plus size={24} />
        </button>
      </div>

      {showExtraOptions && (
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 animate-fadeIn">
          <div>
            <label htmlFor="priority" className={`block text-sm font-medium ${theme.textColor} opacity-80 mb-1`}>Priority</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className={`w-full p-2 ${theme.cardBg} ${theme.textColor} border ${theme.borderColor} rounded-md focus:ring-1 focus:${theme.accentColor.replace('text-','ring-')} outline-none`}
            >
              {Object.values(Priority).map(p => (
                <option key={p} value={p} className={`${PRIORITIES_CONFIG[p]?.color || ''}`}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="dueDate" className={`block text-sm font-medium ${theme.textColor} opacity-80 mb-1`}>Due Date</label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              min={new Date().toISOString().split('T')[0]} // Today as minimum
              onChange={(e) => setDueDate(e.target.value)}
              className={`w-full p-2 ${theme.cardBg} ${theme.textColor} border ${theme.borderColor} rounded-md focus:ring-1 focus:${theme.accentColor.replace('text-','ring-')} outline-none appearance-none`}
            />
          </div>
          <div>
            <label htmlFor="category" className={`block text-sm font-medium ${theme.textColor} opacity-80 mb-1`}>Category</label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`w-full p-2 ${theme.cardBg} ${theme.textColor} border ${theme.borderColor} rounded-md focus:ring-1 focus:${theme.accentColor.replace('text-','ring-')} outline-none`}
            >
              <option value="">None</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      )}
      {/*
        The animation 'fadeIn' and class '.animate-fadeIn' should be defined in a global CSS file.
        The date picker indicator styling (input[type="date"]::-webkit-calendar-picker-indicator) should also be moved to a global CSS file.
        Example CSS for a global stylesheet (e.g., index.css):
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        // For date picker indicator, theme-dependent styling in CSS can be complex.
        // One way is to use CSS variables updated by JavaScript, or distinct classes per theme.
        // Example (simplified for dark theme):
        // html.dark input[type="date"]::-webkit-calendar-picker-indicator {
        //   filter: invert(1);
        // }
      */}
    </form>
  );
};

export default AddTaskForm;
