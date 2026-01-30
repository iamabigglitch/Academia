import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  GraduationCap,
  Calendar,
  ChevronRight,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Star,
  Play,
} from "lucide-react";

const API_BASE = "http://localhost:3000";

const getImageUrl = (imagePath) => {
  if (!imagePath) return "https://via.placeholder.com/400x240?text=Course";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://"))
    return imagePath;
  if (imagePath.startsWith("/")) return `${API_BASE}${imagePath}`;
  return `${API_BASE}/uploads/${imagePath}`.replace(/\/\/+/g, "/");
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const MyCourses = () => {
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token") || localStorage.getItem("authToken");
    if (!token) {
      setError("Please log in to view your courses.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/booking/my-bookings`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 401) {
          setError("Session expired. Please log in again.");
          return;
        }
        throw new Error(data.message || `Failed to load courses (${res.status})`);
      }

      if (!data.success || !Array.isArray(data.bookings)) {
        setEnrolledCourses([]);
        return;
      }

      const normalized = data.bookings.map((b) => {
        const course = b.course || {};
        const courseId = b.courseId || course.id || b.id;
        const name = b.courseName || course.name || "Untitled Course";
        const teacher = b.teacherName || course.teacher || "Instructor";
        const image = getImageUrl(course.image || b.image);
        const isPaid = (b.paymentStatus || "").toLowerCase() === "paid";
        const isConfirmed =
          (b.orderStatus || "").toLowerCase() === "confirmed" ||
          (b.orderStatus || "").toLowerCase() === "completed";

        return {
          id: b.id,
          bookingId: b.bookingId,
          courseId,
          name,
          teacher,
          image,
          price: b.price ?? 0,
          paymentStatus: b.paymentStatus || "Unpaid",
          orderStatus: b.orderStatus || "Pending",
          enrolledAt: b.createdAt,
          isAccessible: isPaid || isConfirmed || (b.price ?? 0) === 0,
        };
      });

      setEnrolledCourses(normalized);
    } catch (err) {
      console.error("fetchMyBookings error:", err);
      setError(err.message || "Failed to load your courses.");
      setEnrolledCourses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyBookings();
  }, [fetchMyBookings]);

  const handleViewCourse = (courseId) => {
    if (courseId) navigate(`/course/${courseId}`);
  };

  const handleBrowseCourses = () => {
    navigate("/courses");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/60 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-100 mb-6">
              <BookOpen className="w-8 h-8 text-indigo-600 animate-pulse" />
            </div>
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-700">Loading your courses...</p>
            <p className="text-sm text-gray-500 mt-1">Fetching enrollments</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/60 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-md mx-auto text-center py-20">
            <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-50 mb-4">
                <AlertCircle className="w-7 h-7 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Couldn't load courses</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={fetchMyBookings}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try again
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Go to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (enrolledCourses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/60 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-lg mx-auto text-center py-20">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-10">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-blue-100 mb-6">
                <Sparkles className="w-10 h-10 text-indigo-600" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                No courses yet
              </h1>
              <p className="text-gray-600 mb-8">
                You haven't enrolled in any courses. Browse our catalog and start learning today.
              </p>
              <button
                type="button"
                onClick={handleBrowseCourses}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
              >
                <BookOpen className="w-5 h-5" />
                Browse courses
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/60 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-white/80 shadow-md border border-indigo-100">
              <GraduationCap className="w-7 h-7 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                My Courses
              </h1>
              <p className="text-gray-600 mt-0.5">
                {enrolledCourses.length} course{enrolledCourses.length !== 1 ? "s" : ""} enrolled
              </p>
            </div>
          </div>
        </div>

        {/* Course grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {enrolledCourses.map((course) => (
            <div
              key={course.id || course.bookingId || course.courseId}
              className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative overflow-hidden aspect-video bg-gray-100">
                <img
                  src={course.image}
                  alt={course.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x240?text=Course";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-3 right-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${
                      course.isAccessible
                        ? "bg-emerald-500/90 text-white"
                        : "bg-amber-500/90 text-white"
                    }`}
                  >
                    {course.isAccessible ? (
                      <>
                        <Star className="w-3 h-3" />
                        Active
                      </>
                    ) : (
                      "Pending"
                    )}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h2 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                  {course.name}
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <GraduationCap className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <span className="truncate">{course.teacher}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(course.enrolledAt)}
                  </span>
                  {course.price > 0 && (
                    <span className="font-semibold text-gray-700">
                      Rs. {Number(course.price).toLocaleString()}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleViewCourse(course.courseId)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg group/btn"
                >
                  <Play className="w-4 h-4 flex-shrink-0" size={18} />
                  {course.isAccessible ? "Continue learning" : "View course"}
                  <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyCourses;
