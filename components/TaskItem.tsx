
import React, { useState } from 'react';
import { Task, Priority } from '../types';
import { useTasks } from '../hooks/useTasks';
import { useTheme } from '../hooks/useTheme';
import { useAnalytics } from '../hooks/useAnalytics';
import { Edit3, Trash2, Circle, CheckCircle, Calendar, Tag, AlertTriangle, GripVertical } from 'lucide-react';
import { PRIORITIES_CONFIG } from '../constants';
import { format } from 'date-fns'; // Removed parseISO as not used
// import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd'; // Temporarily disabled

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  index: number; 
  // dragHandleProps?: DraggableProvidedDragHandleProps | null | undefined; // Temporarily disabled
}

const PriorityIndicator: React.FC<{ priority: Priority }> = ({ priority }) => {
  const config = PRIORITIES_CONFIG[priority];
  if (!config) return null;

  // Simplified icon usage for now, actual icons can be refined later
  const IconComponent = AlertTriangle; 

  return (
    <span className={`mr-2 ${config.color}`} title={`Priority: ${priority}`}>
      <IconComponent size={16} />
    </span>
  );
};


const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit /*, dragHandleProps */ }) => { // dragHandleProps temporarily removed
  const { toggleTask, deleteTask } = useTasks();
  const { theme } = useTheme();
  const { recordTaskCompletion } = useAnalytics();

  const handleToggle = () => {
    const { task: updatedTask, wasCompleted } = toggleTask(task.id);
    if (wasCompleted) { 
      recordTaskCompletion(updatedTask);
      if (Notification.permission === "granted" && updatedTask.dueDate) {
        // Ensure icon path is correct or remove if not available during testing
        // new Notification("Task Completed!", {
        //   body: `You completed: ${updatedTask.text}`,
        //   // icon: '/icons/icon-48.png' 
        // });
      }
    }
  };

  return (
    <div className={`flex items-center p-3 my-2 rounded-lg shadow-md transition-all duration-200 ease-in-out ${task.completed ? `${theme.cardBg} opacity-60` : `${theme.cardBg} ${theme.shadowColor}/50 shadow-lg`} hover:shadow-xl`}>
      {/* {dragHandleProps && ( // Temporarily disabled
        <div {...dragHandleProps} className={`p-1 mr-2 cursor-grab ${theme.textColor} opacity-50 hover:opacity-100`}>
          <GripVertical size={20} />
        </div>
      )} */}
      {/* If no drag handle, provide some margin if needed, or adjust layout */}
      <div className={`p-1 mr-2 ${theme.textColor} opacity-50`}> {/* Placeholder for drag handle space */}
          <GripVertical size={20} className="invisible" /> {/* Keep space, but invisible */}
      </div>
      <button onClick={handleToggle} className="mr-3 focus:outline-none" aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}>
        {task.completed ? <CheckCircle size={24} className={theme.accentColor} /> : <Circle size={24} className={`${theme.textColor} opacity-50`} />}
      </button>
      <div className="flex-grow">
        <p className={`text-base ${task.completed ? 'line-through' : ''} ${theme.textColor}`}>
          {task.text}
        </p>
        <div className="flex items-center text-xs opacity-70 mt-1">
          <PriorityIndicator priority={task.priority} />
          {task.category && (
            <span className="mr-2 flex items-center">
              <Tag size={12} className="mr-1" /> {task.category}
            </span>
          )}
          {task.dueDate && (
            <span className="flex items-center">
              <Calendar size={12} className="mr-1" /> {format(new Date(task.dueDate), 'MMM d, yyyy')}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center ml-2 space-x-2">
        <button onClick={() => onEdit(task)} className={`${theme.textColor} opacity-70 hover:opacity-100 p-1 rounded-full hover:bg-opacity-20 hover:${theme.secondaryBg}`} aria-label="Edit task">
          <Edit3 size={18} />
        </button>
        <button onClick={() => deleteTask(task.id)} className={`${theme.textColor} opacity-70 hover:text-red-500 hover:opacity-100 p-1 rounded-full hover:bg-opacity-20 hover:${theme.secondaryBg}`} aria-label="Delete task">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;