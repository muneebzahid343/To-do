
import React, { useState, useEffect, FormEvent } from 'react';
import Modal from './Modal';
import { Task, Priority, Category } from '../types';
import { useTasks } from '../hooks/useTasks';
import { useTheme } from '../hooks/useTheme';
import { DEFAULT_CATEGORIES, PRIORITIES_CONFIG } from '../constants';
import { formatISO } from 'date-fns';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit: Task | null;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ isOpen, onClose, taskToEdit }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [dueDate, setDueDate] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const { editTask } = useTasks();
  const { theme } = useTheme();
  const categories: Category[] = DEFAULT_CATEGORIES;

  useEffect(() => {
    if (taskToEdit) {
      setText(taskToEdit.text);
      setPriority(taskToEdit.priority);
      setDueDate(taskToEdit.dueDate ? formatISO(new Date(taskToEdit.dueDate), { representation: 'date' }) : '');
      setSelectedCategory(taskToEdit.category || '');
    }
  }, [taskToEdit]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!taskToEdit || text.trim() === '') return;

    const dueDateTimeStamp = dueDate ? new Date(dueDate).getTime() : undefined;
    editTask(taskToEdit.id, text.trim(), priority, dueDateTimeStamp, selectedCategory || undefined);
    onClose();
  };

  if (!taskToEdit) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Task">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="editText" className={`block text-sm font-medium ${theme.textColor} opacity-80 mb-1`}>Task</label>
          <input
            id="editText"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={`w-full p-3 ${theme.cardBg} ${theme.textColor} border ${theme.borderColor} rounded-md focus:ring-2 focus:${theme.accentColor.replace('text-','ring-')} focus:border-transparent outline-none`}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
                <label htmlFor="editPriority" className={`block text-sm font-medium ${theme.textColor} opacity-80 mb-1`}>Priority</label>
                <select
                id="editPriority"
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
                <label htmlFor="editDueDate" className={`block text-sm font-medium ${theme.textColor} opacity-80 mb-1`}>Due Date</label>
                <input
                type="date"
                id="editDueDate"
                value={dueDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDueDate(e.target.value)}
                className={`w-full p-2 ${theme.cardBg} ${theme.textColor} border ${theme.borderColor} rounded-md focus:ring-1 focus:${theme.accentColor.replace('text-','ring-')} outline-none appearance-none`}
                />
            </div>
            <div>
                <label htmlFor="editCategory" className={`block text-sm font-medium ${theme.textColor} opacity-80 mb-1`}>Category</label>
                <select
                id="editCategory"
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
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded-md ${theme.secondaryBg} ${theme.textColor} border ${theme.borderColor} hover:opacity-80 transition-opacity`}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4 py-2 rounded-md ${theme.accentColor.replace('text-','bg-')} text-white hover:opacity-90 transition-opacity`}
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditTaskModal;
