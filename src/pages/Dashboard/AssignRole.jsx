import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthProvider';
import Swal from 'sweetalert2';
import 'tailwindcss/tailwind.css';
import { FaSearch, FaUser, FaCalendarAlt, FaTag } from 'react-icons/fa';

const AdminRoleAssignment = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [member, setMember] = useState(null);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [teamMembersByEvent, setTeamMembersByEvent] = useState({});
  const [error, setError] = useState(null);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái loading
  const token = localStorage.getItem('token');

  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setError(null);
        if (!token) throw new Error('No token found');
        const response = await fetch('http://localhost:8080/api/roles/roles-assign', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch roles');
        const data = await response.json();
        setRoles(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
        setRoles([]);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.message,
          confirmButtonColor: '#2563eb',
        });
      }
    };
    fetchRoles();
  }, [token]);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setError(null);
        if (!token) throw new Error('No token found');
        const response = await fetch(`http://localhost:8080/api/events/get-all-event-by-org/${user.email}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        setEvents(Array.isArray(data) ? data : []);
        if (data.length > 0) {
          const firstEventId = String(data[0].eventId);
          setSelectedEvent(firstEventId);
          setCurrentEventIndex(0);
          fetchTeamMembers(firstEventId);
        }
      } catch (err) {
        setError(err.message);
        setEvents([]);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.message,
          confirmButtonColor: '#2563eb',
        });
      }
    };
    fetchEvents();
  }, [user.email, token]);

  // Search member by email
  const searchMember = async () => {
    try {
      setError(null);
      if (!token) throw new Error('No token found');
      const response = await fetch(`http://localhost:8080/api/auth/user/${email}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch member');
      const data = await response.json();
      setMember(data);
      Swal.fire({
        icon: 'success',
        title: 'Member Found',
        text: `Found: ${data.fullName} (${data.email})`,
        confirmButtonColor: '#2563eb',
      });
    } catch (err) {
      setMember(null);
      setError(err.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message,
        confirmButtonColor: '#2563eb',
      });
    }
  };

  // Assign role to member
  const assignRole = async () => {
    if (!member || !selectedRole || !selectedEvent) {
      setError('Please select member, role, and event');
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Selection',
        text: 'Please select member, role, and event',
        confirmButtonColor: '#2563eb',
      });
      return;
    }
    try {
      setError(null);
      if (!token) throw new Error('No token found');
      const response = await fetch('http://localhost:8080/api/role-assignment/assign-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: email,
          roleId: selectedRole,
          eventId: selectedEvent,
        }),
      });
      if (!response.ok) throw new Error('Failed to assign role');
      await response.json();
      Swal.fire({
        icon: 'success',
        title: 'Role Assigned',
        text: 'Role has been successfully assigned!',
        confirmButtonColor: '#2563eb',
      });
      setEmail('');
      setMember(null);
      setSelectedRole('');
      fetchTeamMembers(selectedEvent);
    } catch (err) {
      setError(err.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message,
        confirmButtonColor: '#2563eb',
      });
    }
  };

  // Fetch team members for an event
  const fetchTeamMembers = async (eventId) => {
    if (!eventId) {
      console.log('No eventId provided');
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      if (!token) throw new Error('No token found');
      const response = await fetch(`http://localhost:8080/api/role-assignment/${eventId}/my-team-events`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error(`Failed to fetch team members: ${response.status}`);
      const data = await response.json();
      setTeamMembersByEvent((prev) => ({
        ...prev,
        [eventId]: data.users || [],
      }));
    } catch (err) {
      console.error('Error fetching team members:', err);
      setError(err.message);
      setTeamMembersByEvent((prev) => ({
        ...prev,
        [eventId]: [],
      }));
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message,
        confirmButtonColor: '#2563eb',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle event selection and fetch team members
  const handleEventSelection = (eventId) => {
    setSelectedEvent(String(eventId));
    if (eventId) {
      fetchTeamMembers(String(eventId));
      const eventIndex = events.findIndex((event) => String(event.eventId) === String(eventId));
      if (eventIndex !== -1) {
        setCurrentEventIndex(eventIndex);
      } else {
        setCurrentEventIndex(0);
      }
    } else {
      setCurrentEventIndex(0);
    }
  };

  // Pagination controls
  const nextEvent = () => {
    if (currentEventIndex < events.length - 1) {
      const nextIndex = currentEventIndex + 1;
      const nextEventId = String(events[nextIndex].eventId);
      setCurrentEventIndex(nextIndex);
      setSelectedEvent(nextEventId);
      fetchTeamMembers(nextEventId);
    }
  };

  const prevEvent = () => {
    if (currentEventIndex > 0) {
      const prevIndex = currentEventIndex - 1;
      const prevEventId = String(events[prevIndex].eventId);
      setCurrentEventIndex(prevIndex);
      setSelectedEvent(prevEventId);
      fetchTeamMembers(prevEventId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="p-4">
        <h1 className="text-3xl font-extrabold text-start tracking-tight">
          Event Role Management
        </h1>
      </div>

      <div className="p-6 space-y-12">
        {/* Assign Role Section */}
        <div className="bg-gray-50 p-8 rounded-2xl shadow-inner">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Assign New Role</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Member Email</label>
              <div className="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
                <FaUser className="ml-3 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter member email"
                  className="flex-1 p-3 border-0 focus:outline-none focus:ring-0"
                />
                <button
                  onClick={searchMember}
                  className="bg-blue-600 text-white px-4 py-2 rounded-[8px] hover:bg-blue-700 transition duration-200 flex items-center mr-2"
                >
                  <FaSearch className="mr-2" />
                </button>
              </div>
              {member && (
                <p className="mt-2 text-sm text-blue-600 font-medium">
                  Found: {member.fullName} ({member.email})
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event</label>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={selectedEvent}
                  onChange={(e) => handleEventSelection(e.target.value)}
                  className="w-full pl-10 p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="">Select Event</option>
                  {events.map((event) => (
                    <option key={event.eventId} value={String(event.eventId)}>
                      {event.eventName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <div className="relative">
                <FaTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full pl-10 p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role.roleID} value={role.roleID}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <button
            onClick={assignRole}
            className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition duration-300 transform hover:scale-105"
          >
            Assign Role
          </button>
          {error && (
            <p className="mt-4 text-red-500 bg-red-50 p-3 rounded-lg text-sm">{error}</p>
          )}
        </div>

        {/* Event Teams Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Event Team</h2>
          {events.length > 0 && selectedEvent ? (
            <div className="bg-gray-50 p-8 rounded-2xl shadow-inner">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-indigo-600">
                  {events.find((event) => String(event.eventId) === String(selectedEvent))?.eventName || 'Selected Event'}
                </h3>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={prevEvent}
                    disabled={currentEventIndex === 0 || isLoading}
                    className={`px-4 py-2 rounded-lg shadow-sm transition duration-200 ${
                      currentEventIndex === 0 || isLoading
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Previous
                  </button>
                  <span className="text-gray-600 font-medium">
                    Event {currentEventIndex + 1} of {events.length}
                  </span>
                  <button
                    onClick={nextEvent}
                    disabled={currentEventIndex === events.length - 1 || isLoading}
                    className={`px-4 py-2 rounded-lg shadow-sm transition duration-200 ${
                      currentEventIndex === events.length - 1 || isLoading
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
              {isLoading ? (
                <p className="text-gray-500 text-center py-6">Loading team members...</p>
              ) : teamMembersByEvent[selectedEvent] && teamMembersByEvent[selectedEvent].length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full bg-white rounded-lg shadow-sm">
                    <thead>
                      <tr className="bg-indigo-100 text-indigo-800">
                        <th className="p-4 text-left font-semibold text-sm uppercase tracking-wider">
                          Full Name
                        </th>
                        <th className="p-4 text-left font-semibold text-sm uppercase tracking-wider">
                          Email
                        </th>
                        <th className="p-4 text-left font-semibold text-sm uppercase tracking-wider">
                          Roles
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamMembersByEvent[selectedEvent].map((member, index) => (
                        <tr
                          key={member.userId}
                          className={`border-b transition duration-150 ${
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                          } hover:bg-indigo-50`}
                        >
                          <td className="p-4 text-gray-800">{member.fullName}</td>
                          <td className="p-4 text-gray-600">{member.email}</td>
                          <td className="p-4 text-gray-600">{member.rolesAssigned.join(', ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-6">
                  No team members assigned to this event.
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-6">
              {events.length === 0 ? 'No events available.' : 'Select an event to view team members.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminRoleAssignment;