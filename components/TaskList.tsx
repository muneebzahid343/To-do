
import React from 'react';
import { Task } from '../types';
import TaskItem from './TaskItem';
// import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'; // Temporarily disabled
import { useTasks } from '../hooks/useTasks';
import { useTheme } from '../hooks/useTheme';

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  filterCompleted?: boolean; // For focus mode
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEditTask, filterCompleted = false }) => {
  // const { reorderTasks } = useTasks(); // Temporarily disabled, reorderTasks might not be needed if DND is off
  const { theme } = useTheme();

  // const onDragEnd = (result: DropResult) => { // Temporarily disabled
  //   if (!result.destination) {
  //     return;
  //   }
  //   const items = Array.from(tasks);
  //   const [reorderedItem] = items.splice(result.source.index, 1);
  //   items.splice(result.destination.index, 0, reorderedItem);
  //   reorderTasks(items);
  // };

  const filteredTasks = filterCompleted ? tasks.filter(task => !task.completed) : tasks;

  if (filteredTasks.length === 0) {
    return <p className={`text-center ${theme.textColor} opacity-70 mt-8`}>No tasks yet. Add one to get started!</p>;
  }

  return (
    // <DragDropContext onDragEnd={onDragEnd}> // Temporarily disabled
    //   <Droppable droppableId="tasks"> // Temporarily disabled
    //     {(provided) => ( // Temporarily disabled
          <div /*{...provided.droppableProps} ref={provided.innerRef}*/ className="mt-4 space-y-1">
            {filteredTasks.map((task, index) => (
              // <Draggable key={task.id} draggableId={task.id} index={index}> // Temporarily disabled
              //   {(providedDraggable, snapshot) => ( // Temporarily disabled
                  <div
                    key={task.id} // Added key here as Draggable is removed
                    // ref={providedDraggable.innerRef} // Temporarily disabled
                    // {...providedDraggable.draggableProps} // Temporarily disabled
                    // className={`${snapshot.isDragging ? 'task-dragging shadow-2xl opacity-90 rounded-lg' : ''}`} // Temporarily disabled
                  >
                    <TaskItem 
                        task={task} 
                        onEdit={onEditTask} 
                        index={index}
                        // dragHandleProps={providedDraggable.dragHandleProps} // Temporarily disabled
                    />
                  </div>
              //   )} // Temporarily disabled
              // </Draggable> // Temporarily disabled
            ))}
            {/*provided.placeholder*/} {/* Temporarily disabled */}
          </div>
    //     )} // Temporarily disabled
    //   </Droppable> // Temporarily disabled
    // </DragDropContext> // Temporarily disabled
  );
};

export default TaskList;