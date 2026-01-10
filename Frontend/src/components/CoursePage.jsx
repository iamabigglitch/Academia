import React, { useEffect, useState } from "react";
import { coursePageStyles, coursePageCustomStyles } from "../assets/dummyStyles";
import courses from "../assets/dummyCourse";
import { Search, Star, StarHalf, User, X, SmilePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast, Slide, ToastContainer } from "react-toastify";

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

  // persist rating when changed
  useEffect(() => {
    try {
      localStorage.setItem("userCourseRatings", JSON.stringify(ratings));
    } catch {
      // ignore
    }
  }, [ratings]);

  const handleRating = (courseId, newRating, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setRatings((prev) => ({
      ...prev,
      [courseId]: newRating,
    }));
  };

  const filteredCourses = courses.filter((course) =>
course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
course.category.toLowerCase().includes(searchQuery.toLowerCase())
);

  // Decide which courses to show (8 by default)

  const VISIBLE_COUNT = 8;
  const visibleCourses = showAll
    ? filteredCourses
    : filteredCourses.slice(0, VISIBLE_COUNT);

    // Small, animated top-right toast — only shown when user clicks a course and token missing

  const showLoginToast = () => {
    toast.error("Please login to access this course", {
      position: "top-right",
      transition: Slide,
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    });
  };

  // navigate to course details if logged in else
  const openCourse = (courseId) => {
    const token = localStorage.getItem("token");
    if (token) {
      showLoginToast();
      return;
    }
    navigate(`/course/${courseId}`);
  };

  const isCourseFree = (course) => {
    return course.isFree || !course.price;
  };

  const getPriceDisplay = (course) => {
    if (isCourseFree(course)) {
      return "Free";
    }

    if (course.price?.sale != null) {
      return {
        current: `Rs:${course.price.sale}`,
        original:
          course.price.original > course.price.sale
            ? `Rs:${course.price.original}`
            : null,
      };
    }

    if (course.price?.original != null) {
      return {
        current: `Rs:${course.price.original}`,
        original: null,
      };
    }

    return "Free";
  };

  return (
    <div className={coursePageStyles.pageContainer}>
      <div className={coursePageStyles.headerContainer}>
        <div className={coursePageStyles.headerTransform}>
          <h1 className={coursePageStyles.headerTitle}>LEARN & GROW</h1>
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

        {/* result count */}

        {searchQuery && (
          <div className="text-center">
            <p className={coursePageStyles.resultsCount}>
              Found {filteredCourses.length} course
              {filteredCourses.length !== 1 ? "s" : ""} matching "{searchQuery}"
            </p>
          </div>
        )}
      </div>

      {/* Courses Grid */}

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
          <div className={coursePageStyles.coursesGridContainer}>
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
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className={coursePageStyles.courseCardInner}>
                    <div className={coursePageStyles.courseCardContent}>
                      <div className={coursePageStyles.courseImageContainer}>
                        <img
                          src={course.image}
                          alt={course.name}
                          className={coursePageStyles.courseImage}
                        />
                      </div>

                      <div className={coursePageStyles.courseInfo}>
                        <h3 className={coursePageStyles.courseName}>
                          {course.name}
                        </h3>

                        <div className={coursePageStyles.teacherContainer}>
                          <UserIcon />
                          <span className={coursePageStyles.teacherName}>
                            {course.teacher}
                          </span>
                        </div>

                        <div className={coursePageStyles.ratingContainer}>
                          <div className={coursePageStyles.ratingStars}>
                            <div className={coursePageStyles.ratingStarsInner}>
                              {[1, 2, 3, 4, 5].map((star) => {
                                const filled = star <= userRating;
                                return (
                                  <button
                                    key={star}
                                    onClick={(e) =>
                                      handleRating(course.id, star, e)
                                    }
                                    className={
                                      coursePageStyles.ratingStarButton
                                    }
                                  >
                                    <StarIcon
                                      filled={filled}
                                      className={
                                        filled
                                          ? "text-yellow-400"
                                          : "text-gray-300"
                                      }
                                    />
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        <div className={coursePageStyles.priceContainer}>
                          <div className="flex items-center space-x-2">
                            {isFree ? (
                              <span className={coursePageStyles.priceFree}>
                                Free
                              </span>
                            ) : (
                              <>
                                <span className={coursePageStyles.priceCurrent}>
                                  {typeof priceDisplay === "object"
                                    ? priceDisplay.current
                                    : priceDisplay}
                                </span>
                                {typeof priceDisplay === "object" &&
                                  priceDisplay.original && (
                                    <span
                                      className={
                                        coursePageStyles.priceOriginal
                                      }
                                    >
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
