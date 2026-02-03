import React, { useEffect, useRef, useState } from 'react';
import { Search, User, BookOpen, BadgeDollarSign, GraduationCap, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const API_BASE = "http://localhost:3000";

const BookingPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page] = useState(1);
  const limit = 200;
  const [processingBookingId, setProcessingBookingId] = useState(null);

  const debounceRef = useRef(null);
  const abortRef = useRef(null);

  const fetchBookings = async (search = "") => {
    setLoading(true);
    setError(null);

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const q = new URLSearchParams();
      if (search) q.set("search", search);
      q.set("limit", String(limit));
      q.set("page", String(page));

      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      const headers = {
        "Content-Type": "application/json"
      };
    
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE}/api/booking?${q.toString()}`, {
        method: "GET",
        signal: controller.signal,
        headers: headers,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        
        if (res.status === 401) {
          throw new Error("Authentication required. Please log in to view bookings.");
        }
        
        throw new Error(
          body.message || `Request failed with status ${res.status}`
        );
      }

      const data = await res.json();
      console.log(data)
      if (data && data.success) {
        const normalized = (data.bookings || []).map((b, idx) => ({
          id: b._id || b.bookingId || String(idx),
          bookingId: b.bookingId,
          studentName: b.user.username || b.userName || "Unknown student",
          courseName: b.courseName || "Untitled course",
          price: b.price ?? 0,
          teacherName: b.teacherName || "Unknown teacher",
          orderStatus: b.orderStatus || "Pending",
          paymentStatus: b.paymentStatus || "Unpaid",
          purchaseDate: b.createdAt
            ? new Date(b.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })
            : b.purchaseDate || "",
          raw: b,
        }));

        setBookings(normalized);
      } else {
        setBookings([]);
        setError(data?.message || "No data available");
      }
    } catch (err) {
      if (err.name === "AbortError") {
        // aborted — ignore
      } else {
        console.error("fetchBookings error:", err);
        setError(err.message || "Failed to fetch bookings");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApproveBooking = async (bookingId) => {
    setProcessingBookingId(bookingId);
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      const res = await fetch(`${API_BASE}/api/booking/${bookingId}/approve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to approve booking");
      }

      await fetchBookings(searchTerm.trim());
      
      alert("Booking approved successfully!");
    } catch (err) {
      console.error("Approve booking error:", err);
      alert(err.message || "Failed to approve booking");
    } finally {
      setProcessingBookingId(null);
    }
  };

  const handleRejectBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to reject this booking?")) {
      return;
    }
    
    setProcessingBookingId(bookingId);
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      const res = await fetch(`${API_BASE}/api/booking/${bookingId}/reject`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to reject booking");
      }

      await fetchBookings(searchTerm.trim());
      
      alert("Booking rejected successfully!");
    } catch (err) {
      console.error("Reject booking error:", err);
      alert(err.message || "Failed to reject booking");
    } finally {
      setProcessingBookingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case "Completed":
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm bg-green-50 text-[#22C55E]">
            <CheckCircle className="w-4 h-4 mr-1" />
            Completed
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm bg-yellow-50 text-yellow-600">
            <AlertCircle className="w-4 h-4 mr-1" />
            Pending Approval
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm bg-red-50 text-red-600">
            <XCircle className="w-4 h-4 mr-1" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm bg-gray-50 text-gray-600">
            {status}
          </span>
        );
    }
  };

  useEffect(() => {
    fetchBookings("");
    return () => {
      if (abortRef.current) abortRef.current.abort();
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchBookings(searchTerm.trim());
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-[#F1F5F9] pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl text-base text-center text-[#1c398e] sm:text-4xl font-bold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
            Course Bookings
          </h1>
          <p className="text-base text-center text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
            Manage and track all course enrollments
          </p>
        </div>

        <div className="mb-8">
          <div className="relative max-w-xl">
            <Search 
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" 
            />
            <input 
              type="text" 
              placeholder="Search by student, course, or teacher..."
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm transition-all text-gray-900 placeholder-gray-400 font-medium"
            />
          </div>
        </div>

        {loading && (
          <div className="text-center py-16">
            <div 
              className="inline-block w-12 h-12 border-4 rounded-full animate-spin mb-4 border-gray-200"
              style={{
                borderTopColor: "#4F46E5"
              }}
            ></div>
            <p className="text-gray-600 font-medium text-lg">Loading bookings...</p>
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8 shadow-sm">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-red-800 font-semibold text-lg mb-1">Error Loading Bookings</h3>
                <p className="text-red-600 font-medium">{error}</p>
                {error.includes("Authentication") && (
                  <button 
                    onClick={() => window.location.href = '/login'}
                    className="mt-4 px-6 py-2.5 bg-[#EF4444] text-white rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-sm"
                  >
                    Go to Login
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bookings.map((booking) => (
              <div 
                key={booking.id} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="flex items-center mb-5 pb-4 border-b border-gray-100">
                  <div 
                    className="p-3 rounded-xl shadow-sm bg-indigo-50 group-hover:shadow-md transition-shadow"
                  >
                    <User className="h-6 w-6 text-indigo-600" />
                  </div>
                  
                  <div className="ml-3 flex-1 min-w-0">
                    <h3 className="font-bold text-lg truncate text-gray-900">
                      {booking.studentName}
                    </h3>
                    <p className="text-sm font-medium text-gray-500">
                      {booking.purchaseDate}
                    </p>
                  </div>
                </div>

                <div className="space-y-3.5 mb-5">
                  <div className="flex items-start">
                    <BookOpen className="h-5 w-5 mr-2.5 flex-shrink-0 mt-0.5 text-indigo-600" />
                    <div className="min-w-0 flex-1">
                      <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">
                        Course
                      </span>
                      <span className="block font-semibold text-gray-900 leading-tight">
                        {booking.courseName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <BadgeDollarSign className="h-5 w-5 mr-2.5 flex-shrink-0 mt-0.5 text-[#22C55E]" />
                    <div>
                      <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">
                        Price
                      </span>
                      <span className="block font-bold text-xl text-[#22C55E]">
                        Rs:{booking.price.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <GraduationCap className="h-5 w-5 mr-2.5 flex-shrink-0 mt-0.5 text-indigo-600" />
                    <div className="min-w-0 flex-1">
                      <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">
                        Instructor
                      </span>
                      <span className="block font-semibold text-gray-900 leading-tight">
                        {booking.teacherName}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 mb-4">
                  {getStatusBadge(booking.orderStatus)}
                </div>

                {booking.orderStatus === "Pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproveBooking(booking.bookingId)}
                      disabled={processingBookingId === booking.bookingId}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
                    >
                      {processingBookingId === booking.bookingId ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleRejectBooking(booking.bookingId)}
                      disabled={processingBookingId === booking.bookingId}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
                    >
                      {processingBookingId === booking.bookingId ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && bookings.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl p-12 max-w-md mx-auto shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center bg-indigo-50 ring-4 ring-indigo-100">
                <Search className="h-10 w-10 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">
                No bookings found
              </h3>
              <p className="text-gray-600 font-medium">
                Try adjusting your search or check back later for new enrollments.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>    
  );
};

export default BookingPage;