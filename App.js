import React, { useState, useEffect } from 'react';
import './App.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [taskPriority, setTaskPriority] = useState('low');
  const [taskCategory, setTaskCategory] = useState('Work');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewCompleted, setViewCompleted] = useState(false);
  const [viewPending, setViewPending] = useState(false);
  const [showAll, setShowAll] = useState(true);
  const [userName, setUserName] = useState('');
  const [progress, setProgress] = useState(0);

  // Load tasks from local storage
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) {
      setTasks(storedTasks);
      updateProgress(storedTasks);
    }
  }, []);

  // Save tasks to local storage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateProgress(tasks);
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim()) {
      const updatedTasks = [
        ...tasks,
        {
          text: newTask,
          completed: false,
          date: taskDate,
          priority: taskPriority,
          category: taskCategory,
        },
      ];
      setTasks(updatedTasks);
      setNewTask('');
      setTaskDate('');
      setTaskPriority('low');
      setTaskCategory('Work');
    }
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const editTask = (index) => {
    const editedTaskText = prompt('Edit task:', tasks[index].text);
    if (editedTaskText !== null) {
      const updatedTasks = tasks.map((task, i) =>
        i === index ? { ...task, text: editedTaskText } : task
      );
      setTasks(updatedTasks);
    }
  };

  const markCompleted = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const updateProgress = (taskList) => {
    const completedTasks = taskList.filter(task => task.completed).length;
    setProgress((completedTasks / taskList.length) * 100);
  };

  const filteredTasks = tasks.filter(task => {
    if (viewCompleted) return task.completed;
    if (viewPending) return !task.completed;
    return true; // If both toggles are off, show all tasks
  }).filter(task => task.text.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  const resetTasks = () => {
    setTasks([]);
  };

  return (
    <div className={`app ${showAll ? 'light' : 'dark'}`}>
      <h1>Task Manager</h1>

      <div className="username-input">
        <label>Enter Your Name: </label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>

      <h2>Hello, {userName || "User"}!</h2>

      {/* Move Search Bar Above Task Input */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search tasks..."
      />

      <div className="task-input">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
        />
        <input
          type="date"
          value={taskDate}
          onChange={(e) => setTaskDate(e.target.value)}
        />
        <select
          value={taskPriority}
          onChange={(e) => setTaskPriority(e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select
          value={taskCategory}
          onChange={(e) => setTaskCategory(e.target.value)}
        >
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Study">Study</option>
        </select>
        <button onClick={addTask}>Add Task</button>
      </div>

      <div className="progress-bar">
        <label>Progress: </label>
        <progress value={progress} max="100"></progress>
        <span>{progress.toFixed(2)}%</span>
      </div>

      <div className="toggle-view">
        <label>
          <input
            type="checkbox"
            checked={showAll}
            onChange={() => setShowAll(!showAll)}
          />
          Dark/Light Mode
        </label>
        {/* Add spacing between buttons */}
        <div className="button-container">
          <button onClick={() => setViewCompleted(!viewCompleted)}>
            {viewCompleted ? 'Show All Tasks' : 'Show Completed Tasks'}
          </button>
          <button onClick={() => setViewPending(!viewPending)}>
            {viewPending ? 'Show All Tasks' : 'Show Pending Tasks'}
          </button>
          <button onClick={resetTasks}>Reset Tasks</button>
        </div>
      </div>

      <div className="task-count">
        <p>Total Tasks: {totalTasks}</p>
        <p>Completed Tasks: {completedTasks}</p>
        <p>Pending Tasks: {pendingTasks}</p>
      </div>

      <ul className="task-list">
        <TransitionGroup>
          {filteredTasks.map((task, index) => (
            <CSSTransition key={index} timeout={300} classNames="fade">
              <li className={task.completed ? 'completed' : ''}>
                <span>{task.text} - {task.date} - {task.priority} - {task.category}</span>
                {task.date && <span className={new Date(task.date) < new Date() ? 'overdue' : 'due'}>{task.date}</span>}
                <button onClick={() => markCompleted(index)}>
                  {task.completed ? 'Undo' : 'Complete'}
                </button>
                <button onClick={() => editTask(index)}>Edit</button>
                <button onClick={() => deleteTask(index)}>Delete</button>
              </li>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </ul>
    </div>
  );
}

export default App;
