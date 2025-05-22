import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const EventTypeManagement = () => {
    const [allEventTypes, setAllEventTypes] = useState([]);
    const [eventTypes, setEventTypes] = useState([]);
    const [newTypeName, setNewTypeName] = useState("");
    const [editEventType, setEditEventType] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const token = localStorage.getItem("token");

    // Fetch all event types
    const fetchEventTypes = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:8080/api/events-type/get-all-event-types",{
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
            setAllEventTypes(response.data);
            setEventTypes(response.data);
            setCurrentPage(1); // Reset to first page on new fetch
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to load event types: " + (error.response?.data?.message || error.message),
            });
        } finally {
            setLoading(false);
        }
    };

    // Search event types on frontend
    const searchEventTypes = (types, term) => {
        if (!term.trim()) return types;
        return types.filter((type) =>
            type.typeName.toLowerCase().includes(term.toLowerCase())
        );
    };

    // Load event types on mount
    useEffect(() => {
        fetchEventTypes();
    }, []);

    // Filter event types when searchTerm changes
    useEffect(() => {
        const filtered = searchEventTypes(allEventTypes, searchTerm);
        setEventTypes(filtered);
        setCurrentPage(1); // Reset to first page on search
    }, [searchTerm, allEventTypes]);

    // Handle add event type
    const handleAddEventType = async (e) => {
        e.preventDefault();
        if (!newTypeName.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Warning",
                text: "Type name cannot be empty",
            });
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                "http://localhost:8080/api/events-type/create-types",
                { typeName: newTypeName },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.data.status !== 200) {
                throw new Error(response.data.message);
            }
            const newEventType = response.data.data;
            setAllEventTypes([...allEventTypes, newEventType]);
            setEventTypes([...eventTypes, newEventType]);
            setNewTypeName("");
            setSearchTerm(""); // Clear search to show all
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Event type added successfully!",
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to add event type: " + (error.response?.data?.message || error.message),
            });
        } finally {
            setLoading(false);
        }
    };

    // Handle edit event type
    const handleEditEventType = async (e) => {
        e.preventDefault();
        if (!editEventType.typeName.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Warning",
                text: "Type name cannot be empty",
            });
            return;
        }

        setLoading(true);
        try {
            const response = await axios.put(
                `http://localhost:8080/api/events-type/${editEventType.id}`,
                { typeName: editEventType.typeName },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.data.status !== 200) {
                throw new Error(response.data.message);
            }
            const updatedEventType = response.data.data;
            setAllEventTypes(
                allEventTypes.map((type) =>
                    type.id === editEventType.id ? updatedEventType : type
                )
            );
            setEventTypes(
                eventTypes.map((type) =>
                    type.id === editEventType.id ? updatedEventType : type
                )
            );
            setIsModalOpen(false);
            setEditEventType(null);
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Event type updated successfully!",
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to update event type: " + (error.response?.data?.message || error.message),
            });
        } finally {
            setLoading(false);
        }
    };

    // Handle delete event type
    const handleDeleteEventType = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
            setLoading(true);
            try {
                await axios.delete(`http://localhost:8080/api/events-type/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setAllEventTypes(allEventTypes.filter((type) => type.id !== id));
                setEventTypes(eventTypes.filter((type) => type.id !== id));
                setCurrentPage(1); // Reset to first page
                Swal.fire({
                    icon: "success",
                    title: "Deleted!",
                    text: "Event type deleted successfully.",
                });
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to delete event type: " + (error.response?.data?.message || error.message),
                });
            } finally {
                setLoading(false);
            }
        }
    };

    // Open edit modal
    const openEditModal = (eventType) => {
        setEditEventType(eventType);
        setIsModalOpen(true);
    };

    // Close edit modal
    const closeEditModal = () => {
        setIsModalOpen(false);
        setEditEventType(null);
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = eventTypes.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(eventTypes.length / itemsPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
                Event Type Management
            </h1>

            {/* Search and Add Event Type Form */}
            <div className="bg-white p-8 rounded-2xl shadow-lg mb-8 max-w-3xl mx-auto transition-all duration-300">
                <h2 className="text-2xl font-semibold text-gray-700 mb-6">Add New Event Type</h2>
                <form onSubmit={handleAddEventType} className="flex gap-4 mb-6">
                    <input
                        type="text"
                        value={newTypeName}
                        onChange={(e) => setNewTypeName(e.target.value)}
                        placeholder="Enter type name"
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all duration-200"
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 text-white inline" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
                            </svg>
                        ) : (
                            "Add"
                        )}
                    </button>
                </form>
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by type name"
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    />
                    <button
                        onClick={() => setSearchTerm("")}
                        className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all duration-200"
                    >
                        Clear
                    </button>
                </div>
            </div>

            {/* Event Types Table */}
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-5xl mx-auto">
                <h2 className="text-2xl font-semibold text-gray-700 mb-6">Event Types List</h2>
                {loading ? (
                    <div className="text-center">
                        <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
                        </svg>
                    </div>
                ) : eventTypes.length === 0 ? (
                    <div className="text-center text-gray-500">No event types found.</div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-blue-100">
                                        <th className="p-4 text-left text-gray-700 font-semibold">ID</th>
                                        <th className="p-4 text-left text-gray-700 font-semibold">Type Name</th>
                                        <th className="p-4 text-center text-gray-700 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((type) => (
                                        <tr key={type.id} className="border-b hover:bg-gray-50 transition-all duration-200">
                                            <td className="p-4">{type.id}</td>
                                            <td className="p-4">{type.typeName}</td>
                                            <td className="p-4 text-center">
                                                <button
                                                    onClick={() => openEditModal(type)}
                                                    className="text-blue-600 hover:text-blue-800 mr-4 transition-colors duration-200"
                                                    title="Edit"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteEventType(type.id)}
                                                    className="text-red-600 hover:text-red-800 transition-colors duration-200"
                                                    title="Delete"
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-between items-center mt-6">
                            <div className="text-gray-600">
                                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, eventTypes.length)} of {eventTypes.length} entries
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-all duration-200"
                                >
                                    Previous
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => paginate(page)}
                                        className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                                            currentPage === page
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-all duration-200"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full transform transition-all duration-300 scale-95 animate-modal-open">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Edit Event Type</h2>
                        <form onSubmit={handleEditEventType}>
                            <div className="mb-6">
                                <label className="block text-gray-700 mb-2 font-medium">Type Name</label>
                                <input
                                    type="text"
                                    value={editEventType?.typeName || ""}
                                    onChange={(e) =>
                                        setEditEventType({
                                            ...editEventType,
                                            typeName: e.target.value,
                                        })
                                    }
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                />
                            </div>
                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all duration-200"
                                >
                                    {loading ? (
                                        <svg className="animate-spin h-5 w-5 text-white inline" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
                                        </svg>
                                    ) : (
                                        "Save"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventTypeManagement;