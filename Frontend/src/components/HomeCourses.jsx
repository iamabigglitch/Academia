import React, { useEffect, useState } from "react";
import { homeCoursesStyles } from "../assets/dummyStyles";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Star, User } from "lucide-react";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = "http://localhost:3000";

const getImageUrl = (imagePath) => {
  if (!imagePath) return "https://via.placeholder.com/400x240?text=Course";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath;
  if (imagePath.startsWith("/")) return `${API_BASE}${imagePath}`;
  return `${API_BASE}/uploads/${imagePath}`.replace(/\/\/+/g, "/");
};

const HomeCourses = () => {
  const navigate = useNavigate();
  const { title, course: courseFont, detail } = homeCoursesStyles.fonts;
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [userRatings, setUserRatings] = useState(() => {
    try {
      const raw = localStorage.getItem("userCourseRatings");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const [hoverRatings, setHoverRatings] = useState({});

  useEffect(() => {
    try {
      localStorage.setItem(
        "userCourseRatings",
        JSON.stringify(userRatings)
      );
    } catch (err) {
      console.warn("Failed to save ratings:", err);
    }
  }, [userRatings]);

  //fetch
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/api/course/public?home=true&limit=8`)
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || 'Failed to fetch courses from server');
        }
        return res.json();
      })
      .then((json) => {
        if (!mounted) return;
        const items = (json && (json.items || json.courses || json.data || [])) || [];
        const mapped = items.map((c) => ({
          id: c._id || c.id,
          name: c.name || "Untitled Course",
          teacher: c.teacher || "Instructor",
          image: getImageUrl(c.image),
          price: c.price || {
            original: c.price?.original,
            sale: c.price?.sale,
          },
          isFree:
            c.pricingType === "free" ||
            !c.price ||
            (c.price && !c.price.sale && !c.price.original),
          avgRating:
            typeof c.avgRating !== "undefined" ? c.avgRating : c.rating || 0,
          totalRatings:
            typeof c.totalRatings !== "undefined"
              ? c.totalRatings
              : c.ratingCount || 0,
          courseType: c.courseType || "regular",
        }));
        setCourses(mapped);
      })
      .catch((err) => {
        console.error("Failed to load courses", err);
        if (mounted) setError("Failed to load courses from server");
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  const showLoginToast = () => {
    toast.error("Please login to access this course", {
      position: "top-right",
      transition: Slide,
      autoClose: 3000,
      theme: "dark",
    });
  };

  const handleCourseClick = (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      showLoginToast();
      return;
    }
    navigate(`/course/${id}`);
  };

  const handleBrowseClick = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to access courses", {
        position: "top-right",
        transition: Slide,
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }
    navigate("/courses");
  };

  const submitRatingToServer = async (courseId, ratingValue) => {
    try {
      const headers = { "Content-Type": "application/json" };
      
      const token = localStorage.getItem("token");
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE}/api/course/${courseId}/rate`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({ rating: ratingValue }),
      });
      const data = await res.json().catch(() => ({ success: false }));
      if (!res.ok && !data.success) {
        const msg =
          (data && (data.message || data.error)) ||
          `Failed to rate (${res.status})`;
        throw new Error(msg);
      }

      const avg =
        data.avgRating ??
        data.course?.avgRating ??
        data.course?.avgRating;
      const total =
        data.totalRatings ??
        data.course?.ratingCount ??
        data.course?.ratingCount;

      setCourses((prev) =>
        prev.map((c) =>
          c.id === courseId
            ? {
                ...c,
                avgRating: typeof avg === "number" ? avg : c.avgRating,
                totalRatings:
                  typeof total === "number" ? total : c.totalRatings,
              }
            : c
        )
      );

      setUserRatings((prev) => ({ ...prev, [courseId]: ratingValue }));

      toast.success("Thanks for your rating!");
      return { success: true, avg, total };
    } catch (err) {
      console.error("submitRatingToServer:", err);
      toast.error(err.message || "Failed to submit rating");
      return { success: false, error: err };
    }
  };

  const handleSetRating = async (e, courseId, rating) => {
    e.stopPropagation();
    setUserRatings((prev) => ({ ...prev, [courseId]: rating }));
    await submitRatingToServer(courseId, rating);
  };

  const renderInteractiveStars = (course) => {
    const userRating = userRatings[course.id] || 0;
    const hover = hoverRatings[course.id] || 0;
    const displayRating = hover || userRating;

    return (
      <div className={homeCoursesStyles.starsContainer}>
        <div
          className={homeCoursesStyles.interactiveStars}
          onClick={(e) => e.stopPropagation()}
        >
          {Array.from({ length: 5 }).map((_, i) => {
            const idx = i + 1;
            const filled = idx <= displayRating;

            return (
              <button
                key={i}
                onClick={(e) => handleSetRating(e, course.id, idx)}
                onMouseEnter={() =>
                  setHoverRatings((s) => ({ ...s, [course.id]: idx }))
                }
                onMouseLeave={() =>
                  setHoverRatings((s) => ({ ...s, [course.id]: 0 }))
                }
                className={`${homeCoursesStyles.starButton} ${
                  filled
                    ? homeCoursesStyles.starButtonActive
                    : homeCoursesStyles.starButtonInactive
                }`}
                style={{ background: "transparent" }}
              >
                <Star
                  size={16}
                  fill={filled ? "currentColor" : "none"}
                  stroke="currentColor"
                  className={homeCoursesStyles.starIcon}
                />
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={homeCoursesStyles.container}>
      <div className={homeCoursesStyles.mainContainer}>
        <div className={homeCoursesStyles.header}>
          <h2 className={`${title} ${homeCoursesStyles.title} text-blue-900`}>
            <Star className="text-blue-600" />
            Explore Top Courses
            <Star className="text-blue-600" />
          </h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading courses...</p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto text-center py-12 px-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-red-100 shadow-lg">
            <p className="text-red-600 font-medium mb-4">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            <div className={homeCoursesStyles.coursesGrid}>
              {courses.map((course) => {
                const isFree = !!course.isFree || !course.price;

                return (
                  <div
                    key={course.id}
                    onClick={() => handleCourseClick(course.id)}
                    className={homeCoursesStyles.coursesCard}
                  >
                    <div className={`${homeCoursesStyles.imageContainer} aspect-video bg-gray-100`}>
                      <img
                        src={course.image}
                        alt={course.name}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/400x240?text=Course";
                        }}
                      />
                    </div>

                    <div className={homeCoursesStyles.courseInfo}>
                      <h3
                        className={`${courseFont} ${homeCoursesStyles.courseName}`}
                      >
                        {course.name}
                      </h3>

                      <div
                        className={`${detail} ${homeCoursesStyles.teacherInfo}`}
                      >
                        <User
                          size={15}
                          className={homeCoursesStyles.teacherIcon}
                        />
                        <span className={homeCoursesStyles.teacherName}>
                          {course.teacher}
                        </span>
                      </div>

                      <div className={homeCoursesStyles.ratingContainer}>
                        {renderInteractiveStars(course)}
                      </div>

                      <div className={homeCoursesStyles.pricingContainer}>
                        {isFree ? (
                          <span className={homeCoursesStyles.freePrice}>
                            Free
                          </span>
                        ) : (
                          <>
                            <span className={homeCoursesStyles.salePrice}>
                              Rs: {course.price?.sale ?? "-"}
                            </span>
                            {course.price?.original && (
                              <span className={homeCoursesStyles.originalPrice}>
                                Rs: {course.price.original}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <div className={homeCoursesStyles.ctaContainer}>
          <div className={homeCoursesStyles.ctaWrapper}>
            <button
              type="button"
              onClick={handleBrowseClick}
              className="relative z-10 inline-flex items-center gap-3 px-8 py-4 text-lg font-bold rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-xl hover:from-blue-700 hover:to-blue-900 hover:shadow-2xl transition-all duration-300 cursor-pointer active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-300/50"
            >
              <span>Discover Courses</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        transition={Slide}
      />

      <style>{homeCoursesStyles.animations}</style>
    </div>
  );
};

export default HomeCourses;