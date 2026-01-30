import React, { useEffect, useState } from 'react';
import { BookMarked, BookOpenText, DollarSign, Search, ShoppingCart, Users, TrendingUp, AlertCircle } from 'lucide-react';

const API_BASE = 'http://localhost:3000'; 

const fmtCurrency = (n) => {
  if (n == null) return "Rs. 0";
  const num = Number(n);
  if (Number.isNaN(num)) return "Rs. 0";
  return `Rs. ${num.toLocaleString()}`;
};

const AdminDashboardPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statsData, setStatsData] = useState(null);
  const [coursesData, setCoursesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const buildStats = (backendStats) => {
    const totalBookings = backendStats?.totalBookings ?? 0;
    const totalRevenue = backendStats?.totalRevenue ?? 0;
    const bookingsLast7Days = backendStats?.bookingsLast7Days ?? 0;
    const topCourses = backendStats?.topCourses ?? [];

    return [
      {
        title: "Total Bookings",
        value: totalBookings,
        icon: Users,
        bgColor: "bg-blue-500",
        lightBg: "bg-blue-50",
        textColor: "text-blue-600",
        borderColor: "border-blue-200",
      },
      {
        title: "Total Revenue",
        value: fmtCurrency(totalRevenue),
        icon: DollarSign,
        bgColor: "bg-emerald-500",
        lightBg: "bg-emerald-50",
        textColor: "text-emerald-600",
        borderColor: "border-emerald-200",
      },
      {
        title: "Recent Bookings",
        value: bookingsLast7Days,
        icon: TrendingUp,
        bgColor: "bg-orange-500",
        lightBg: "bg-orange-50",
        textColor: "text-orange-600",
        borderColor: "border-orange-200",
      },
      {
        title: "Top Courses",
        value: (topCourses && topCourses.length) || 0,
        icon: BookMarked,
        bgColor: "bg-purple-500",
        lightBg: "bg-purple-50",
        textColor: "text-purple-600",
        borderColor: "border-purple-200",
      },
    ];
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    // Get token from localStorage
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    
    const headers = {
      "Content-Type": "application/json"
    };
    
    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const fetchStats = () =>
      fetch(`${API_BASE}/api/booking/stats`, { headers })
        .then((r) => {
          if (!r.ok) {
            if (r.status === 401) {
              throw new Error("Authentication required. Please log in to view dashboard.");
            }
            throw new Error(`Failed to fetch stats: ${r.status}`);
          }
          return r.json();
        })
        .then((j) =>
          j.success ? j.stats : Promise.reject(j.message || "Stats error")
        );

    const fetchCourses = () =>
      fetch(`${API_BASE}/api/course`, { headers })
        .then((r) => {
          if (!r.ok) {
            if (r.status === 401) {
              throw new Error("Authentication required. Please log in to view courses.");
            }
            throw new Error(`Failed to fetch courses: ${r.status}`);
          }
          return r.json();
        })
        .then((j) =>
          j.success ? j.courses : Promise.reject(j.message || "Course error")
        );

    Promise.all([fetchStats(), fetchCourses()])
      .then(([stats, courses]) => {
        if (!mounted) return;

        const topLookup = {};
        Array.isArray(stats?.topCourses) &&
          stats.topCourses.forEach((t) => {
            if (!t) return;
            const name = t.courseName || "";
            topLookup[name] = {
              purchases: Number(t.count || 0),
              revenue: Number(t.revenue || 0),
            };
          });

        const mapped = (courses || []).map((c) => {
          const id = c._id ?? c.id ?? c.courseId ?? "";
          const name = c.name ?? c.title ?? "Untitled Course";
          const image = c.image ?? "https://via.placeholder.com/150?text=No+Image";
          const instructor = c.teacher ?? c.instructor ?? "Unknown";
          const metrics = topLookup[name] || { purchases: 0, revenue: 0 };
          const students = metrics.purchases || (c.students ?? 0);
          const purchases = metrics.purchases || (c.purchases ?? 0);
          const earnings = metrics.revenue ?? c.earnings ?? 0;

          let priceDisplay = "Free";
          if (c.price && (c.price.sale || c.price.original)) {
            const sale = c.price.sale != null ? Number(c.price.sale) : null;
            const orig =
              c.price.original != null ? Number(c.price.original) : null;
            priceDisplay =
              sale != null
                ? fmtCurrency(sale)
                : orig != null
                ? fmtCurrency(orig)
                : "Free";
          } else if (c.pricingType && c.pricingType !== "free") {
            priceDisplay = "Rs. 0";
          }

          return {
            id,
            image,
            name,
            instructor,
            students,
            price: priceDisplay,
            purchases,
            earnings: fmtCurrency(earnings),
          };
        });

        setStatsData(buildStats(stats));
        setCoursesData(mapped);
      })
      .catch((err) => {
        console.error("Dashboard fetch error:", err);
        if (mounted) setError(String(err) || "Failed to load dashboard data");
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  const stats = statsData || [
    { title: "Total Bookings", value: 0, icon: Users, bgColor: "bg-blue-500", lightBg: "bg-blue-50", textColor: "text-blue-600", borderColor: "border-blue-200" },
    { title: "Total Revenue", value: "Rs. 0", icon: DollarSign, bgColor: "bg-emerald-500", lightBg: "bg-emerald-50", textColor: "text-emerald-600", borderColor: "border-emerald-200" },
    { title: "Recent Bookings", value: 0, icon: TrendingUp, bgColor: "bg-orange-500", lightBg: "bg-orange-50", textColor: "text-orange-600", borderColor: "border-orange-200" },
    { title: "Top Courses", value: 0, icon: BookMarked, bgColor: "bg-purple-500", lightBg: "bg-purple-50", textColor: "text-purple-600", borderColor: "border-purple-200" },
  ];

  const filteredCourses = coursesData.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.instructor || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Top courses for analytics chart (by purchases)
  const topCoursesForChart = [...coursesData]
    .sort((a, b) => (b.purchases || 0) - (a.purchases || 0))
    .slice(0, 6);
  const maxPurchases = Math.max(1, ...topCoursesForChart.map((c) => c.purchases || 0));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 text-gray-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-base sm:text-lg text-gray-600 font-medium">
            Welcome back! Here's what's happening with your courses today.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-500 rounded-lg p-6 shadow-md">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-900 mb-1">
                  Unable to Load Dashboard
                </h3>
                <p className="text-red-700 font-medium">{error}</p>
                {error.includes("Authentication") && (
                  <button 
                    onClick={() => window.location.href = '/login'}
                    className="mt-4 px-6 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-sm"
                  >
                    Go to Login
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className={`${stat.lightBg} rounded-xl shadow-lg border-2 ${stat.borderColor} p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                      {stat.title}
                    </p>
                    <p className={`text-3xl font-bold ${stat.textColor}`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg shadow-md`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Analytics Chart */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Analytics</h2>
                <p className="text-white/90 text-sm">Top courses by enrollments</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3" />
                <p className="text-gray-500 font-medium">Loading analytics...</p>
              </div>
            ) : topCoursesForChart.length > 0 ? (
              <div className="space-y-4">
                {topCoursesForChart.map((course, idx) => {
                  const pct = maxPurchases ? ((course.purchases || 0) / maxPurchases) * 100 : 0;
                  return (
                    <div key={course.id || idx} className="group">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-semibold text-gray-800 truncate max-w-[70%]" title={course.name}>
                          {course.name}
                        </span>
                        <span className="text-sm font-bold text-indigo-600 tabular-nums">
                          {course.purchases || 0} enrollments
                        </span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-700 ease-out"
                          style={{ width: `${Math.max(pct, 2)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="font-medium">No enrollment data yet</p>
                <p className="text-sm">Analytics will appear once courses have enrollments.</p>
              </div>
            )}
          </div>
        </div>

        {/* Courses Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-lg">
                  <BookOpenText className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Course Performance</h2>
              </div>

              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-2.5 border-2 border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 w-full sm:w-72 transition-all bg-white text-gray-900 placeholder-gray-500 font-medium shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700">
                    Course
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700">
                    Students
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700">
                    Purchases
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700">
                    Earnings
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredCourses.map((course, index) => (
                  <tr
                    key={course.id || `course-${index}`}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={course.image}
                          alt={course.name}
                          className="w-12 h-12 rounded-lg object-cover shadow-sm border border-gray-200"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/150?text=No+Image";
                          }}
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{course.name}</p>
                          <p className="text-sm text-gray-600">{course.instructor}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-500" />
                        <span className="font-semibold text-gray-900">{course.students}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-semibold text-indigo-600">{course.price}</span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-orange-500" />
                        <span className="font-semibold text-gray-900">{course.purchases}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-semibold text-emerald-600">{course.earnings}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredCourses.length === 0 && !loading && (
              <div className="text-center py-16 bg-gray-50">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-indigo-600" />
                </div>
                <p className="text-gray-600 font-semibold text-lg mb-4">No courses found matching your search.</p>
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow-sm"
                >
                  Clear Search
                </button>
              </div>
            )}

            {loading && (
              <div className="text-center py-16 bg-white">
                <div className="inline-block w-10 h-10 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600 font-semibold">Loading dashboard data...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;