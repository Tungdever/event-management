import { useEffect, useState } from "react";
import axios from "axios";
import TicketItem from "./TicketItem";
import Footer from "../../components/Footer";
import Loader from "../../components/Loading";

export default function ViewTicket() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [sortBy, setSortBy] = useState("eventStart");
    const [sortOrder, setSortOrder] = useState("asc");
    const [filterDate, setFilterDate] = useState("");
    const [search, setSearch] = useState("");
    const token = localStorage.getItem("token");

    // Debounce function to reduce search request frequency
    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    };

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 250);
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            setError(null);

            let userId;
            if (!token) {
                setError("Please log in to view tickets.");
                setLoading(false);
                return;
            }

            try {
                const payload = token.split(".")[1];
                const decodedPayload = JSON.parse(atob(payload));
                userId = decodedPayload.userId;
            } catch (e) {
                setError("Invalid token. Please log in again.");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(
                    `http://localhost:8080/api/ticket/view-all-tickets/${userId}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        params: {
                            page,
                            size: 10,
                            sortBy,
                            sortOrder,
                            date: filterDate,
                            search,
                        },
                    }
                );
                setData(response.data.content || []);
                setTotalPages(response.data.totalPages || 0);
            } catch (err) {
                console.error("Error fetching tickets:", err);
                if (err.response?.status === 400) {
                    setError("Invalid date format. Please use YYYY-MM-DD.");
                } else {
                    setError("Unable to load tickets. Please try again later.");
                }
                setData([]);
                setTotalPages(0);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [page, sortBy, sortOrder, filterDate, search]);

    const handleSortChange = (e) => {
        const [newSortBy, newSortOrder] = e.target.value.split(":");
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
        setPage(0); // Reset to first page
    };

    const handleDateFilter = (e) => {
        setFilterDate(e.target.value);
        setPage(0); // Reset to first page
    };

    const handleSearch = debounce((e) => {
        setSearch(e.target.value);
        setPage(0); // Reset to first page
    }, 300);

    return (
        <>
            <div className="max-w-2xl mx-auto p-4">
                <h2 className="text-2xl font-bold mb-4">Your Tickets:</h2>

                {/* Filter and search section */}
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <select
                        className="border p-2 rounded bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={handleSortChange}
                        value={`${sortBy}:${sortOrder}`}
                    >
                        <option value="eventStart:asc">Date (Ascending)</option>
                        <option value="eventStart:desc">Date (Descending)</option>
                        <option value="price:asc">Price (Ascending)</option>
                        <option value="price:desc">Price (Descending)</option>
                    </select>
                    <input
                        type="date"
                        className="border p-2 rounded bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filterDate}
                        onChange={handleDateFilter}
                        placeholder="Select date"
                    />
                    <input
                        type="text"
                        className="border p-2 rounded bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Event name / ticket code"
                        onChange={handleSearch}
                    />
                </div>

                {/* Display error */}
                {error && (
                    <p className="text-center text-red-500 mb-4">{error}</p>
                )}

                {/* Display loading */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader />
                    </div>
                ) : (
                    <>
                        {/* Message when no tickets are found */}
                        {!error && data.length === 0 && totalPages === 0 && (
                            <p className="text-center text-gray-500">No tickets found.</p>
                        )}

                        {/* Ticket list */}
                        <div className="space-y-2">
                            {data.map((ticket) => (
                                <TicketItem
                                    key={ticket?.ticketInfo?.ticketId}
                                    ticket={ticket}
                                    event={ticket?.eventInfo}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 0 && (
                            <div className="flex justify-between items-center mt-4">
                                <button
                                    className="border p-2 rounded disabled:opacity-50 hover:bg-blue-100"
                                    disabled={page === 0}
                                    onClick={() => setPage(page - 1)}
                                >
                                    Previous Page
                                </button>
                                <span>
                                    Page {page + 1} of {totalPages}
                                </span>
                                <button
                                    className="border p-2 rounded disabled:opacity-50 hover:bg-blue-100"
                                    disabled={page >= totalPages - 1}
                                    onClick={() => setPage(page + 1)}
                                >
                                    Next Page
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
            <Footer />
        </>
    );
}