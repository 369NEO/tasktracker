import { useEffect, useState } from 'react';
import './App.css';
import AddTask from './components/AddTask';
import ToDo from './components/ToDo';
import { useDrop } from 'react-dnd';

function App() {
  const [taskList, setTaskList] = useState([]);
  const [completedList, setCompletedList] = useState([]);

  useEffect(() => {
    const array = localStorage.getItem("taskList");
    if (array) {
      setTaskList(JSON.parse(array));
    }
  }, []);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "todo",
    drop: (item) => addToCompleted(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));

  const addToCompleted = (item) => {
    const updatedTaskList = taskList.filter((task) => task !== item);
    setTaskList(updatedTaskList);
    setCompletedList((completed) => [
      ...completed,
      item,
    ]);
  };

  return (
    <>
      <h1 className='text-2xl font-bold py-4 pl-6'>03 - The Task Tracker</h1>
      <p className='text-xl pl-6'>Hi There</p>
      <div className='flex flex-row items-center'>
        <p className='text-xl pl-6'> Click</p>
        <AddTask taskList={taskList} setTaskList={setTaskList} />
        <p className='text-xl my-2'>to add a new task </p>
      </div>

      <div className='flex flex-row'>
        <div className='w-full'>
          <h2 className='ml-6 text-xl font-semibold w-3/4 
          max-w-lg my-4 py-1 px-4 bg-gray-200'>To Do</h2>
          {taskList.map((task, i) => (
            <ToDo
              key={i}
              task={task}
              index={i}
              taskList={taskList}
              setTaskList={setTaskList}
            />
          ))}
        </div>
        <div className='w-full' ref={drop} style={{ backgroundColor: isOver ? '#e0e0e0' : 'white' }}>
          <h2 className='ml-6 text-xl font-semibold w-3/4 
          max-w-lg my-4 py-1 px-4 bg-gray-200'>Completed</h2>
          {completedList.map((task, i) => (
            <ToDo
              key={i}
              task={task}
              index={i}
              taskList={completedList} // Since it's completed, use completedList
              setTaskList={setCompletedList} // Update setTaskList to setCompletedList
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
