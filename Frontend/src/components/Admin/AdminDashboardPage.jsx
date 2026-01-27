import React, { useEffect, useState } from 'react';
import { BookMarked, BookOpenText, DollarSign, Search, ShoppingCart, Users, TrendingUp } from 'lucide-react';

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
        color: "bg-blue-500",
        lightColor: "bg-blue-50",
        textColor: "text-blue-600",
      },
      {
        title: "Total Revenue",
        value: fmtCurrency(totalRevenue),
        icon: DollarSign,
        color: "bg-green-500",
        lightColor: "bg-green-50",
        textColor: "text-green-600",
      },
      {
        title: "Recent Bookings",
        value: bookingsLast7Days,
        icon: TrendingUp,
        color: "bg-orange-500",
        lightColor: "bg-orange-50",
        textColor: "text-orange-600",
      },
      {
        title: "Top Courses",
        value: (topCourses && topCourses.length) || 0,
        icon: BookMarked,
        color: "bg-purple-500",
        lightColor: "bg-purple-50",
        textColor: "text-purple-600",
      },
    ];
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    const fetchStats = () =>
      fetch(`${API_BASE}/api/booking/stats`)
        .then((r) => r.json())
        .then((j) =>
          j.success ? j.stats : Promise.reject(j.message || "Stats error")
        );

    const fetchCourses = () =>
      fetch(`${API_BASE}/api/course`)
        .then((r) => r.json())
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
    { title: "Total Bookings", value: 0, icon: Users, color: "bg-blue-500", lightColor: "bg-blue-50", textColor: "text-blue-600" },
    { title: "Total Revenue", value: "Rs. 0", icon: DollarSign, color: "bg-green-500", lightColor: "bg-green-50", textColor: "text-green-600" },
    { title: "Recent Bookings", value: 0, icon: TrendingUp, color: "bg-orange-500", lightColor: "bg-orange-50", textColor: "text-orange-600" },
    { title: "Top Courses", value: 0, icon: BookMarked, color: "bg-purple-500", lightColor: "bg-purple-50", textColor: "text-purple-600" },
  ];

  const filteredCourses = coursesData.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.instructor || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your courses today.</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg" role="alert">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.lightColor} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Courses Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-50 rounded-lg">
                  <BookOpenText className="w-6 h-6" style={{ color: '#1c398e' }} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Course Performance</h2>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent w-full sm:w-64"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Students</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Purchases</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Earnings</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {filteredCourses.map((course, index) => (
                  <tr
                    key={course.id || `course-${index}`}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={course.image}
                          alt={course.name}
                          className="w-12 h-12 rounded-lg object-cover"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/150?text=No+Image";
                          }}
                        />
                        <div>
                          <p className="font-medium text-gray-900">{course.name}</p>
                          <p className="text-sm text-gray-500">{course.instructor}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{course.students}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-medium" style={{ color: '#1c398e' }}>{course.price}</span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-700">{course.purchases}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-semibold text-green-600">{course.earnings}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredCourses.length === 0 && !loading && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No courses found matching your search.</p>
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-all"
                  style={{ backgroundColor: '#1c398e' }}
                >
                  Clear Search
                </button>
              </div>
            )}

            {loading && (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-sky-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-500">Loading dashboard data...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;