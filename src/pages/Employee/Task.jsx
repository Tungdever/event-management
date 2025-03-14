import React, { useState } from "react";
import { FaThLarge, FaFilter, FaEllipsisH, FaGripVertical, FaTimes } from "react-icons/fa";

// Màu sắc cho tag
const tagColors = {
  Projects: "bg-blue-200 text-blue-700",
  Onhold: "bg-gray-200 text-gray-700",
  Internal: "bg-green-200 text-green-700",
  Inprogress: "bg-yellow-200 text-yellow-700",
  Reminder: "bg-purple-200 text-purple-700",
  Pending: "bg-red-200 text-red-700",
};

const TodoApp = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Finalize project proposal", date: "15 Jan 2025", priority: "High", tags: ["Projects", "Onhold"] },
    { id: 2, title: "Submit to supervisor by EOD", date: "25 May 2024", priority: "In Progress", tags: ["Internal", "Inprogress"] },
    { id: 3, title: "Prepare presentation slides", date: "15 Jan 2025", priority: "Pending", tags: ["Reminder", "Pending"] },
  ]);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", date: "", priority: "", tags: "" });

  const handleAddTask = () => {
    setTasks([...tasks, { id: tasks.length + 1, ...newTask, tags: newTask.tags.split(",").map(tag => tag.trim()) }]);
    setNewTask({ title: "", date: "", priority: "", tags: "" });
    setIsPopupOpen(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="container mx-auto bg-white p-6 shadow rounded-2xl text-[14px]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">📌 Todo List</h1>
            <nav className="text-gray-500 text-sm">
              <a className="hover:underline" href="#">Application</a> /
              <a className="hover:underline" href="#"> Todo</a>
            </nav>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-3 bg-orange-400 text-white rounded-xl shadow-sm hover:bg-orange-500 transition">
              <FaThLarge />
            </button>
            <input
              className="p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-400"
              placeholder="🔍 Search Todo List"
              type="text"
            />
            <button className="p-3 bg-gray-200 rounded-xl shadow-smsm hover:bg-gray-300 transition">
              <FaFilter />
            </button>
          </div>
        </div>

        {/* Task Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Total Todo <span className="text-gray-500">({tasks.length})</span></h2>
            <div className="flex items-center space-x-4">
              <button onClick={() => setIsPopupOpen(true)}  className="p-3 bg-orange-300 text-white font-semibold rounded-xl shadow-sm hover:bg-orange-400 transition">
                + New Task
              </button>
              <div className="text-gray-500">Total Task: 55 | Pending: 15 | Completed: 40</div>
            </div>
          </div>

          {/* Task List */}
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-700">🔥 High Priority <span className="text-gray-500">(15)</span></h3>
            <div className="space-y-3">
              {tasks.map(task => (
                <div key={task.id} className="flex justify-between items-center p-4 rounded-xl shadow-sm border border-gray-300 transition hover:scale-105">
                  <div className="flex items-center space-x-3">
                    <FaGripVertical className="text-gray-500" />
                    <input type="checkbox" className="w-5 h-5" />
                    <span className="font-semibold text-gray-800">{task.title}</span>
                    <span className="text-gray-600 text-sm">{task.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {task.tags.map(tag => (
                      <span key={tag} className={`p-2 rounded-lg shadow ${tagColors[tag] || "bg-gray-300 text-gray-700"}`}>
                        {tag}
                      </span>
                    ))}
                    <button className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition">
                      <FaEllipsisH />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-between items-center mt-6">
            {/* <button className="p-3 bg-gray-300 text-gray-800 font-semibold rounded-xl shadow-sm hover:bg-gray-400 transition">
              ➕ Add New
            </button> */}
            <button className="p-3 bg-gray-300 text-gray-800 font-semibold rounded-xl shadow-sm hover:bg-gray-400 transition">
              📜 See All
            </button>
          </div>
        </div>
      </div>
      {isPopupOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-sm w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Task</h2>
              <button onClick={() => setIsPopupOpen(false)} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>
            <input type="text" placeholder="Task Title" className="w-full p-2 border rounded mb-3" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} />
            <input type="date" className="w-full p-2 border rounded mb-3" value={newTask.date} onChange={e => setNewTask({ ...newTask, date: e.target.value })} />
            <input type="text" placeholder="Priority" className="w-full p-2 border rounded mb-3" value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })} />
            <input type="text" placeholder="Tags (comma separated)" className="w-full p-2 border rounded mb-3" value={newTask.tags} onChange={e => setNewTask({ ...newTask, tags: e.target.value })} />
            <button onClick={handleAddTask} className="w-full bg-orange-400 text-white p-2 rounded shadow hover:bg-orange-500">Add Task</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoApp;
