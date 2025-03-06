import React, { useState } from "react";
import EditContact from "./EditContact";

const EmployeeListGrid = ({ employees }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
  };

  const closeEditContact = () => {
    setSelectedEmployee(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Contact Grid</h2>
        <div className="flex items-center space-x-4">
          <button className="bg-orange-500 text-white px-4 py-2 rounded">
            Export
          </button>
          <button className="bg-orange-500 text-white px-4 py-2 rounded">
            Add Contact
          </button>
          <select className="border rounded px-4 py-2">
            <option>Sort By: Last 7 Days</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {employees.map((employee, index) => (
          <div key={index} className="bg-white p-4 rounded shadow">
            <div className="flex items-center justify-between mb-4">
              <input type="checkbox" />
              <img
                src={employee.image}
                alt={employee.name}
                className="rounded-full w-12 h-12 object-cover"
              />
            </div>
            <h3 className="text-lg font-bold">{employee.name}</h3>
            <p className="text-sm text-gray-500">{employee.role}</p>
            <p className="text-sm text-gray-500">{employee.email}</p>
            <p className="text-sm text-gray-500">{employee.department}</p>
            <p className="text-sm text-gray-500">{employee.employedDate}</p>
            <p
              className={`text-sm text-right font-bold ${
                employee.status === "online" ? "text-green-500" : "text-red-500"
              }`}
            >
              {employee.status}
            </p>
            <i
              className="bi bi-pencil-square cursor-pointer text-blue-500"
              onClick={() => handleEditClick(employee)}
            ></i>
          </div>
        ))}
      </div>
      {selectedEmployee && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50  z-50 ">
          <div className="bg-white p-2 rounded shadow-lg w-3/5 overflow-y-auto h-[620px] ">
            {EditContact ? (
              <EditContact employee={selectedEmployee} onClose={closeEditContact} />
            ) : (
              <p className="text-red-500">Error: EditContact component not found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


const EmployeeList = ({ employees = [] }) => {
  return (
    <div className="max-w-[720px] mx-auto">
      <div className="relative flex flex-col w-full h-full text-slate-700 bg-white shadow-md rounded-xl bg-clip-border">
        <div className="relative mx-4 mt-4 overflow-hidden text-slate-700 bg-white rounded-none bg-clip-border">
          <h3 className="text-lg font-semibold text-slate-800">
            Employees List
          </h3>
          <p className="text-slate-500">Review each person before edit</p>
        </div>

        <div className="p-0 overflow-scroll">
          <table className="w-full mt-4 text-left table-auto min-w-max">
            <thead>
              <tr>
                {["Member", "Function", "Status", "Employed", ""].map(
                  (header, index) => (
                    <th
                      key={index}
                      className="p-4 border-y border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer"
                    >
                      <p className="flex items-center justify-between gap-2 text-sm text-slate-500">
                        {header}
                      </p>
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? (
                employees.map((employee, index) => (
                  <tr key={index}>
                    <td className="p-4 border-b border-slate-200">
                      <div className="flex items-center gap-3">
                        <img
                          src={employee.image}
                          alt={employee.name}
                          className="h-9 w-9 rounded-full object-cover"
                        />
                        <div className="flex flex-col">
                          <p className="text-sm font-semibold text-slate-700">
                            {employee.name}
                          </p>
                          <p className="text-sm text-slate-500">
                            {employee.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 border-b border-slate-200">
                      <p className="text-sm font-semibold text-slate-700">
                        {employee.role}
                      </p>
                      <p className="text-sm text-slate-500">
                        {employee.department}
                      </p>
                    </td>
                    <td className="p-4 border-b border-slate-200">
                      <div
                        className={`w-max px-2 py-1 text-xs font-bold uppercase rounded-md ${
                          employee.status === "online"
                            ? "bg-green-500/20 text-green-900"
                            : "bg-red-500/20 text-red-900"
                        }`}
                      >
                        {employee.status}
                      </div>
                    </td>
                    <td className="p-4 border-b border-slate-200">
                      <p className="text-sm text-slate-500">
                        {employee.employedDate}
                      </p>
                    </td>
                    <td className="p-4 border-b border-slate-200">
                      <button className="h-10 w-10 rounded-lg text-slate-900 transition-all hover:bg-slate-900/10">
                        ...
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-slate-500">
                    No employees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeListGrid;
