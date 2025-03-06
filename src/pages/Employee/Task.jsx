import { useState } from "react";

const TodoList = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Finalize project proposal",
      date: "15 Jan 2025",
      tags: ["Projects", "Onhold"],
      completed: false,
    },
    {
      id: 2,
      title: "Submit to supervisor by EOD",
      date: "25 May 2024",
      tags: ["Internal", "Inprogress"],
      completed: false,
    },
    {
      id: 3,
      title: "Prepare presentation slides",
      date: "15 Jan 2025",
      tags: ["Reminder", "Pending"],
      completed: true,
    },
  ]);

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          Total Todo <span className="text-sm text-gray-500">{tasks.length}</span>
        </h1>
        <div className="text-sm text-gray-500">
          <span>Total Task: {tasks.length}</span> | <span>Pending: {tasks.filter(task => !task.completed).length}</span> | <span>Completed: {tasks.filter(task => task.completed).length}</span>
        </div>
      </div>
      <button className="w-full bg-orange-100 text-orange-600 py-2 rounded-lg mb-4 flex items-center justify-center">
        <i className="fas fa-plus mr-2"></i> New task
      </button>
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          {['All', 'High', 'Medium', 'Low'].map((priority) => (
            <button key={priority} className="bg-gray-200 text-gray-700 py-1 px-3 rounded-lg">{priority}</button>
          ))}
        </div>
        <div className="flex space-x-2">
          <button className="bg-gray-200 text-gray-700 py-1 px-3 rounded-lg flex items-center">
            <i className="fas fa-calendar-alt mr-2"></i> Due Date
          </button>
          <button className="bg-gray-200 text-gray-700 py-1 px-3 rounded-lg">All Tags</button>
          <button className="bg-gray-200 text-gray-700 py-1 px-3 rounded-lg">Sort By: Created Date</button>
        </div>
      </div>
      <div>
        {tasks.map((task) => (
          <div key={task.id} className="bg-white shadow-md rounded-lg p-4 mb-2 flex items-center justify-between">
            <div className="flex items-center">
              <input type="checkbox" className="mr-2" checked={task.completed} readOnly />
              <span className={`text-gray-700 font-semibold ${task.completed ? "line-through text-gray-400" : ""}`}>{task.title}</span>
              <span className="text-sm text-gray-500 ml-2">{task.date}</span>
            </div>
            <div className="flex items-center space-x-2">
              {task.tags.map((tag, index) => (
                <span key={index} className="bg-green-100 text-green-600 py-1 px-2 rounded-lg text-sm">{tag}</span>
              ))}
              <i className="fas fa-ellipsis-v text-gray-500"></i>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;
