import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Popover } from "@headlessui/react";

const Board = ({ tasks, setTasks }) => {
  const statuses = ["To Do", "Pending", "Completed"];

  const moveTask = (taskId, newStatus) => {
    setTasks(tasks.map(task => task.id === taskId ? { ...task, status: newStatus } : task));
  };

  return (
    <div className="grid grid-cols-3 gap-4 ">
      {statuses.map(status => (
        <Column key={status} status={status} tasks={tasks} moveTask={moveTask} />
      ))}
    </div>
  );
};

const Column = ({ status, tasks, moveTask }) => {
  const [{ isOver }, drop] = useDrop({
    accept: "TASK",
    drop: (item) => moveTask(item.id, status),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div ref={drop} className={`p-4 bg-gray-200 rounded h-[570px] overflow-y-auto ${isOver ? "bg-gray-300" : ""}`}>
      <h3 className="font-bold mb-2">{status}</h3>
      {tasks.filter(task => task.status === status).map(task => (
        <TaskCard key={task.id} {...task} />
      ))}
    </div>
  );
};

const TaskBoard = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Payment Gateway", event: "Project A", startDate: "2024-04-10", endDate: "2024-04-18", priority: "High", assignee: "John Doe", status: "To Do" },
    { id: 2, title: "Patient appointment booking", event: "Project B", startDate: "2024-04-05", endDate: "2024-04-15", priority: "Medium", assignee: "Alice", status: "Pending" },
  ]);

  const [showPopup, setShowPopup] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    event: "",
    startDate: "",
    endDate: "",
    priority: "Medium",
    assignee: "John Doe",
    status: "To Do",
  });

  const handleAddTask = () => {
    setTasks([...tasks, { id: tasks.length + 1, ...newTask }]);
    setShowPopup(false);
    setNewTask({
      title: "",
      event: "",
      startDate: "",
      endDate: "",
      priority: "Medium",
      assignee: "John Doe",
      status: "To Do",
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bg-gray-100 min-h-screen p-4">
        <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Task Board</h1>
          <nav className="text-gray-500">
            <a className="hover:underline" href="#">Projects</a> / <span>Task Board</span>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          
          <input
            className="border rounded px-2 py-1 text-sm"
            placeholder="Search Project"
            type="text"
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Export</button>
          <button className="bg-orange-500 text-white px-4 py-2 rounded" onClick={() => setShowPopup(true)}>Add Task</button>
        </div>
      </div>
          <Board tasks={tasks} setTasks={setTasks} />
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
            <input className="w-full mb-2 p-2 border rounded" type="text" placeholder="Event Name" value={newTask.event} onChange={(e) => setNewTask({ ...newTask, event: e.target.value })} />
            <input className="w-full mb-2 p-2 border rounded" type="text" placeholder="Task Name" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} />
            <div className="flex space-x-2 mb-2">
              <input className="w-1/2 p-2 border rounded" type="date" value={newTask.startDate} onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })} />
              <input className="w-1/2 p-2 border rounded" type="date" value={newTask.endDate} onChange={(e) => setNewTask({ ...newTask, endDate: e.target.value })} />
            </div>
            <div className="flex space-x-2 mb-2">
              <select className="w-1/2 p-2 border rounded" value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <select className="w-1/2 p-2 border rounded" value={newTask.status} onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}>
                <option value="To Do">To Do</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <select className="w-full mb-4 p-2 border rounded" value={newTask.assignee} onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}>
              <option value="John Doe">John Doe</option>
              <option value="Alice">Alice</option>
            </select>
            <div className="flex justify-between">
              <button className="bg-gray-300 text-white px-4 py-2 rounded" onClick={() => setShowPopup(false)}>Cancel</button>
              <button className="bg-orange-500 text-white px-4 py-2 rounded" onClick={handleAddTask}>Add Task</button>
            </div>
          </div>
        </div>
      )}

    </DndProvider>
  );
};

const TaskCard = ({ id, title, event, startDate, endDate, priority, assignee }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div ref={drag} className={`relative bg-white p-4 rounded-[10px]  mb-4 hover:cursor-pointer hover:shadow-xl ${isDragging ? "opacity-50" : ""}`} onClick={() => setIsOpen(!isOpen)}>
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-sm text-gray-500">{event}</p>
      <p className="text-sm text-gray-500">Due: {startDate} - {endDate}</p>
      <p className="text-sm text-gray-500">Priority: {priority}</p>
      <p className="text-sm text-gray-500">Assigned to: {assignee}</p>

      {isOpen && (
        <Popover className="absolute right-0 mt-2 z-10 bg-gray-100 text-[#6b7280] shadow-lg rounded-lg p-4 w-64">
          <h4 className="font-bold">{title}</h4>
          <p className="text-sm ">Event: {event}</p>
          <p className="text-sm ">Start: {startDate}</p>
          <p className="text-sm ">End: {endDate}</p>
          <p className="text-sm ">Priority: {priority}</p>
          <p className="text-sm ">Assignee: {assignee}</p>
        </Popover>
      )}
    </div>
  );
};

export default TaskBoard;
