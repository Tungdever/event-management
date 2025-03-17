import React from "react";

const TaskBoard = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="container mx-auto">
        <Header />
        <Board />
      </div>
    </div>
  );
};

const Header = () => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <h1 className="text-2xl font-bold">Task Board</h1>
        <nav className="text-gray-500">
          <a className="hover:underline" href="#">Projects</a> / <span>Task Board</span>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <UserProfile />
        <TaskStats />
        <input
          className="border rounded px-2 py-1 text-sm"
          placeholder="Search Project"
          type="text"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Export</button>
        <button className="bg-orange-500 text-white px-4 py-2 rounded">Add Board</button>
      </div>
    </div>
  );
};

const UserProfile = () => (
  <div className="flex items-center space-x-2">
    <img
      alt="User avatar"
      className="w-8 h-8 rounded-full"
      src="https://storage.googleapis.com/a1aa/image/axjERH9IX16yrvQ-OIpOKRUN5EzxRp4GSYuHnt90PBQ.jpg"
    />
    <span className="text-sm font-medium">1+</span>
  </div>
);

const TaskStats = () => (
  <>
    <span className="text-sm">Total Task: 55</span>
    <span className="text-sm">Pending: 15</span>
    <span className="text-sm">Completed: 40</span>
  </>
);

const Board = () => {
  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h2 className="text-xl font-semibold mb-4">Hospital Administration</h2>
      <Filters />
      <TaskColumns />
    </div>
  );
};

const Filters = () => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex space-x-2">
        {['All', 'High', 'Medium', 'Low'].map(priority => (
          <button key={priority} className="bg-gray-200 px-4 py-2 rounded">
            {priority}
          </button>
        ))}
      </div>
      <div className="flex space-x-2">
        {['Clients', 'Created Date', 'Due Date', 'Select Status', 'Sort By: Created Date'].map(filter => (
          <button key={filter} className="bg-gray-200 px-4 py-2 rounded">
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
};

const TaskColumns = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <TaskColumn title="To Do" count={2} />
      <TaskColumn title="Pending" count={13} />
      <TaskColumn title="Completed" count={3} />
    </div>
  );
};

const TaskColumn = ({ title, count }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">
        {title} <span className="text-gray-500">{count}</span>
      </h3>
      <TaskCard 
        title="Payment Gateway"
        category="Web Layout"
        priority="High"
        progress={40}
        dueDate="18 Apr 2024"
      />
      <TaskCard 
        title="Patient appointment booking"
        category="Web Layout"
        priority="Medium"
        progress={20}
        dueDate="15 Apr 2024"
      />
      <button className="bg-gray-200 w-full py-2 rounded">+ New Task</button>
    </div>
  );
};

const TaskCard = ({ title, category, priority, progress, dueDate }) => {
  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="bg-gray-200 text-xs px-2 py-1 rounded">{category}</span>
        <span className={`bg-${priority === 'High' ? 'red' : 'yellow'}-500 text-white text-xs px-2 py-1 rounded`}>
          {priority}
        </span>
      </div>
      <h4 className="font-semibold mb-2">{title}</h4>
      <div className="flex items-center mb-2">
        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
          <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        <span className="text-sm">{progress}%</span>
      </div>
      <p className="text-sm text-gray-500 mb-2">Due on: {dueDate}</p>
      <UserProfile />
      <div className="flex justify-between items-center text-gray-500 text-sm">
        <span><i className="fas fa-comments"></i> 14</span>
        <span><i className="fas fa-eye"></i> 14</span>
      </div>
    </div>
  );
};

export default TaskBoard;
