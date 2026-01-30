import React, { useEffect, useState } from "react";
import { coursePageStyles, coursePageCustomStyles } from "../assets/dummyStyles";
import { Search, Star, StarHalf, User, X, SmilePlus, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast, Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = 'http://localhost:3000'; 

const StarIcon = ({ filled = false, half = false, className = "" }) => {
  if (half) {
    return (
      <StarHalf
        className={`w-4 h-4 ${className}`}
        fill="currentColor"
      />
    );
  }
  return (
    <Star
      className={`w-4 h-4 ${className}`}
      fill={filled ? "currentColor" : "none"}
    />
  );
};

const UserIcon = () => <User className={coursePageStyles.teacherIcon} />;
const SearchIcon = () => <Search className={coursePageStyles.searchIcon} />;

const RatingStars = ({
  courseId,
  userRating = 0,
  avgRating = 0,
  totalRatings = 0,
  onRate,
}) => {
  const [hover, setHover] = useState(0);
  const base = userRating || Math.round(avgRating || 0);
  const display = hover || base;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ display: "flex", gap: 6 }}
      >
        {Array.from({ length: 5 }).map((_, i) => {
          const idx = i + 1;
          const filled = idx <= display;
          return (
            <button
              key={idx}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRate && onRate(courseId, idx);
              }}
              onMouseEnter={() => setHover(idx)}
              onMouseLeave={() => setHover(0)}
              aria-label={`Rate ${idx} star${idx > 1 ? "s" : ""}`}
              style={{
                background: "transparent",
                border: "none",
                padding: 2,
                cursor: "pointer",
              }}
            >
              <StarIcon
                filled={filled}
                className={filled ? "text-yellow-400" : "text-gray-300"}
              />
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", flexDirection: "column", marginLeft: 6 }}>
        <div style={{ fontWeight: 700, fontSize: 13 }}>
          {(avgRating || 0).toFixed(1)}
        </div>
        <div style={{ fontSize: 12, color: "#6b7280" }}>
          ({totalRatings || 0})
        </div>
      </div>
    </div>
  );
};

const CoursePage = () => {
  const navigate = useNavigate();

  const [ratings, setRatings] = useState(() => {
    try {
      const raw = localStorage.getItem("userCourseRatings");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem("userCourseRatings", JSON.stringify(ratings));
    } catch {
      // ignore
    }
  }, [ratings]);

  // Fetch public courses
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/api/course/public`)
      .then(async (res) => {
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(txt || "Failed to fetch courses");
        }
        return res.json();
      })
      .then((json) => {
        if (!mounted) return;
        const raw = json.items || json.courses || [];
        const regular = raw.filter((c) =>
          c.courseType ? c.courseType !== "top" : true
        );

        const mapped = regular.map((c) => ({
          id: String(c._id || c.id || ""),
          name: c.name,
          teacher: c.teacher || c.instructor || "",
          category: c.category || "",
          image: c.image || "",
          isFree:
            c.pricingType === "free" ||
            !c.price ||
            (!c.price.sale && !c.price.original),
          price:
            c.price ||
            (c.originalPrice
              ? { original: c.originalPrice, sale: c.price }
              : {}),
          avgRating:
            typeof c.avgRating === "number"
              ? c.avgRating
              : typeof c.rating === "number"
              ? c.rating
              : parseFloat(c.rating) || 0,
          totalRatings:
            typeof c.totalRatings === "number"
              ? c.totalRatings
              : c.ratingCount ?? 0,
          raw: c,
        }));

        setCourses(mapped);
      })
      .catch((err) => {
        console.error("Failed to load courses:", err);
        if (mounted) setError(err.message || "Failed to load courses");
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  const submitRatingToServer = async (courseId, ratingValue) => {
    try {
      const headers = { "Content-Type": "application/json" };
      
      const token = localStorage.getItem("token");
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await fetch(
        `${API_BASE}/api/course/${encodeURIComponent(courseId)}/rate`,
        {
          method: "POST",
          headers,
          credentials: "include",
          body: JSON.stringify({ rating: ratingValue }),
        }
      );

      const data = await res.json().catch(() => null);
      if (!res.ok && !data.success) {
        const msg =
          (data && (data.message || data.error)) || 
          `Failed to rate (${res.status})`;
        if (res.status === 401) toast.error("Please login to submit rating");
        throw new Error(msg);
      }

      const avg = data.avgRating ?? data.course?.avgRating ?? data.avg ?? null;
      const total =
        data.totalRatings ?? data.course?.totalRatings ?? data.count ?? null;

      if (avg !== null || total !== null) {
        setCourses((prev) =>
          prev.map((c) =>
            String(c.id) === String(courseId)
              ? {
                  ...c,
                  avgRating: typeof avg === "number" ? avg : c.avgRating,
                  totalRatings:
                    typeof total === "number" ? total : c.totalRatings,
                }
              : c
          )
        );
      }

      setRatings((prev) => ({ ...prev, [courseId]: ratingValue }));
      toast.success("Thanks for rating!");
      return true;

    } catch (err) {
      console.error("Error submitting rating:", err);
      toast.error(
        err.message || "Failed to submit rating. Please try again later."
      );
      return false;
    }
  };

  const handleRating = async (courseId, newRating, e) => {
    if (e && e.stopPropagation) {
      e.preventDefault();
      e.stopPropagation();
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to submit rating");
      return;
    }

    setRatings((prev) => ({
      ...prev,
      [courseId]: newRating,
    }));
    await submitRatingToServer(courseId, newRating);
  };

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.teacher.toLowerCase().includes(searchQuery.toLowerCase()) || 
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const VISIBLE_COUNT = 9;
  const visibleCourses = showAll
    ? filteredCourses
    : filteredCourses.slice(0, VISIBLE_COUNT);

  const showLoginToast = () => {
    toast.error("Please login to access this course", {
      position: "top-right",
      transition: Slide,
      autoClose: 3000,
      theme: "dark",
    });
  };

  const openCourse = (courseId) => {
    const token = localStorage.getItem("token");
    if (!token) { 
      showLoginToast();
      return;
    }
    navigate(`/courses/${courseId}`);
  };

  const isCourseFree = (course) => {
    return course.isFree || !course.price;
  };

  const getPriceDisplay = (course) => {
    if (isCourseFree(course)) {
      return "Free";
    }

    const price = course.price || {};

    if (price.sale != null && price.sale !== 0) {
      return {
        current: `Rs: ${price.sale}`,
        original:
          price.original && price.original > price.sale
            ? `Rs: ${price.original}`
            : null,
      };
    }

    if (price.original != null) {
      return {
        current: `Rs: ${price.original}`,
        original: null,
      };
    }

    return "Free";
  };

  if (loading) 
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <div className="text-xl font-semibold text-gray-700">Loading courses...</div>
      </div>
    </div>
  );

if (error) 
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center p-8 max-w-md">
        <div className="mb-6 flex justify-center">
          <BookOpen className="w-32 h-32 text-blue-600" strokeWidth={1.5} />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Courses Coming Soon!</h2>
        <p className="text-gray-600 mb-4">The course management system is being set up by the admin.</p>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-600 font-mono">{error}</p>
        </div>
        <button
          onClick={() => navigate('/home')}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );

  return (
    <div className={coursePageStyles.pageContainer}>
      <div className={coursePageStyles.headerContainer}>
        <div className={coursePageStyles.headerTransform}>
          <h1 className={coursePageStyles.headerTitle} style={{ color: '#1c398e' }}>
            LEARN & GROW
          </h1>
        </div>

        <p className={coursePageStyles.headerSubtitle}>
          Explore our wide range of courses designed to help you achieve your goals.
        </p>

        <div className={coursePageStyles.searchContainer}>
          <div className={coursePageStyles.searchGradient} />
          <div className={coursePageStyles.searchInputContainer}>
            <div className={coursePageStyles.searchIconContainer}>
              <SearchIcon />
            </div>

            <input
              type="text"
              placeholder="Search courses by name, instructor, or category...."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowAll(false);
              }}
              className={coursePageStyles.searchInput}
            />

            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setShowAll(false);
                }}
                className={coursePageStyles.clearButton}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {searchQuery && (
          <div className="text-center">
            <p className={coursePageStyles.resultsCount}>
              Found {filteredCourses.length} course
              {filteredCourses.length !== 1 ? "s" : ""} matching "{searchQuery}"
            </p>
          </div>
        )}
      </div>

      <div className={coursePageStyles.coursesGrid}>
        {filteredCourses.length === 0 ? (
          <div className={coursePageStyles.noCoursesContainer}>
            <SmilePlus className={coursePageStyles.noCoursesIcon} />
            <h3 className={coursePageStyles.noCoursesTitle}>
              No courses found
            </h3>
            <button
              onClick={() => {
                setSearchQuery("");
                setShowAll(false);
              }}
              className={coursePageStyles.noCoursesButton}
            >
              Show All Courses
            </button>
          </div>
        ) : (
          <div className={coursePageStyles.coursesGridContainer} style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '2rem',
            maxWidth: '1400px',
            margin: '0 auto'
          }}>
            {visibleCourses.map((course, index) => {
              const userRating = ratings[course.id] || 0;
              const isFree = isCourseFree(course);
              const priceDisplay = getPriceDisplay(course);

              return (
                <div
                  key={course.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => openCourse(course.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") openCourse(course.id);
                  }}
                  className={coursePageStyles.courseCard}
                  style={{ 
                    animationDelay: `${index * 80}ms`,
                    minHeight: '480px',
                    width: '100%'
                  }}
                >
                  <div className={coursePageStyles.courseCardInner}>
                    <div className={coursePageStyles.courseCardContent}>
                      <div className={coursePageStyles.courseImageContainer} style={{ height: '260px' }}>
                        <img
                          src={course.image}
                          alt={course.name}
                          className={coursePageStyles.courseImage}
                        />
                      </div>

                      <div className={coursePageStyles.courseInfo} style={{ padding: '1.25rem' }}>
                        <h3 className={coursePageStyles.courseName} style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>
                          {course.name}
                        </h3>

                        <div className={coursePageStyles.teacherContainer} style={{ marginBottom: '1rem' }}>
                          <UserIcon />
                          <span className={coursePageStyles.teacherName}>
                            {course.teacher}
                          </span>
                        </div>

                        <div className={coursePageStyles.ratingContainer} style={{ marginBottom: '1rem' }}>
                          <RatingStars
                            courseId={course.id}
                            userRating={userRating}
                            avgRating={course.avgRating}
                            totalRatings={course.totalRatings}
                            onRate={handleRating}
                          />
                        </div>

                        <div className={coursePageStyles.priceContainer}>
                          <div className="flex items-center space-x-2">
                            {isFree ? (
                              <span className={coursePageStyles.priceFree} style={{ fontSize: '1.125rem' }}>
                                Free
                              </span>
                            ) : (
                              <>
                                <span className={coursePageStyles.priceCurrent} style={{ fontSize: '1.125rem' }}>
                                  {typeof priceDisplay === "object"
                                    ? priceDisplay.current
                                    : priceDisplay}
                                </span>
                                {typeof priceDisplay === "object" &&
                                  priceDisplay.original && (
                                    <span className={coursePageStyles.priceOriginal}>
                                      {priceDisplay.original}
                                    </span>
                                  )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        transition={Slide}
        theme="dark"
      />

      <style>{coursePageCustomStyles}</style>
    </div>
  );
};

export default CoursePage;