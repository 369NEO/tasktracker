import React, { useEffect, useState } from 'react';
import EditTask from './EditTask';
import { useDrag } from 'react-dnd';

const ToDo = ({ task, index, taskList, setTaskList }) => {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);

  // UseDrag hook for drag-and-drop functionality
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'todo', 
    item: 
    { 
      id:index, 
      projectName:task.projectName, 
      taskDescription:task.taskDescription,
      timestamp: task.timestamp,
      duration: task.duration 
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(), // Collecting drag state
    }),
  }));

  // Timer effect
  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [running]);

  // Deleting a task
  const handleDelete = () => {
    const newTaskList = taskList.filter((_, i) => i !== index);
    setTaskList(newTaskList);
  };

  // Format time function
  const formatTime = () => {
    const hours = String(Math.floor((time / 3600000) % 24)).padStart(2, '0');
    const minutes = String(Math.floor((time / 60000) % 60)).padStart(2, '0');
    const seconds = String(Math.floor((time / 1000) % 60)).padStart(2, '0');
    const milliseconds = String(Math.floor((time / 10) % 100)).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}:${milliseconds}`;
  };

  return (
    <div
      className='flex flex-col items-start justify-start bg-white my-4 ml-6 py-4 px-6 w-3/4 max-w-lg'
      ref={drag} // Attach drag ref here
      style={{ opacity: isDragging ? 0.5 : 1 }} // Optional: change opacity while dragging
    >
      <div className='w-full flex flex-row justify-between'>
        <p className='font-semibold text-xl'>{task.projectName}</p>
        <EditTask task={task} index={index} taskList={taskList} setTaskList={setTaskList} />
      </div>
      <p className='text-lg py-2'>{task.taskDescription}</p>
      <div className='w-full flex flex-row items-center justify-evenly'>
        <div className='text-xl font-semibold py-4 max-w-full gap-4'>
          <span>{formatTime()}</span>
        </div>
        
        <div className='w-1/3 max-w-sm flex flex-row justify-evenly'>
          {running ? (
            <button className='border rounded-lg py-1 px-3' onClick={() => setRunning(false)}>
              Stop
            </button>
          ) : (
            <button className='border rounded-lg py-1 px-3' onClick={() => setRunning(true)}>
              Start
            </button>
          )}
          <button className='border rounded-lg py-1 px-3' onClick={() => setTime(0)}>
            Reset
          </button>
        </div>
      </div>
      <div className='w-full flex justify-center'>
        <button
          className='bg-red-500 text-white text-sm uppercase mt-6 mb-1 font-semibold py-1.5 px-3 rounded-lg'
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ToDo;
