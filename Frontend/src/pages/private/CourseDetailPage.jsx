import React, { useEffect, useMemo, useState } from "react";
import { courseDetailStyles } from "../../assets/dummyStyles";
import { BookOpen, Target, X, Clock, ArrowLeft, User, Play, ChevronDown, ArrowRight, Award, Sparkles, CheckCircle, Circle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const fmtMinutes = (mins) => {
  const h = Math.floor((mins || 0) / 60);
  const m = (mins || 0) % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
};

const Toast = ({ message, type = "info", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`${courseDetailStyles.toast} ${
        type === "error" 
        ? courseDetailStyles.toastError 
        : courseDetailStyles.toastInfo
      }`}
    >
      <div className={courseDetailStyles.toastContent}>
        <span>{message}</span>
        <button onClick={onClose} className={courseDetailStyles.toastClose}>
          <X className={courseDetailStyles.toastCloseIcon} />
        </button>
      </div>
    </div>
  );
};

const toEmbedUrl = (url) => {
  if (!url) return "";
  try {
    const trimmed = String(url).trim();
    if (/\/embed\//.test(trimmed)) return trimmed;

    const watchMatch = trimmed.match(/[?&]v=([^&#]+)/);
    if (watchMatch && watchMatch[1]) {
      return `https://www.youtube.com/embed/${watchMatch[1]}`;
    }

    const shortMatch = trimmed.match(/youtu\.be\/([^?&#/]+)/);
    if (shortMatch && shortMatch[1]) {
      return `https://www.youtube.com/embed/${shortMatch[1]}`;
    }

    if (/drive\.google\.com/.test(trimmed)) {
      const fileMatch = trimmed.match(/\/file\/d\/([^/]+)(?:\/|$)/);
      if (fileMatch && fileMatch[1]) {
        return `https://drive.google.com/file/d/${fileMatch[1]}/preview`;
      }

      const idMatch = trimmed.match(/[?&]id=([^&#]+)/);
      if (idMatch && idMatch[1]) {
        return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
      }

      const ucMatch = trimmed.match(/[?&]export=download.*[?&]id=([^&#]+)/);
      if (ucMatch && ucMatch[1]) {
        return `https://drive.google.com/file/d/${ucMatch[1]}/preview`;
      }

      return trimmed;
    }
    const lastSeg = trimmed.split("/").filter(Boolean).pop();
    if (lastSeg && lastSeg.length === 11 && /^[a-zA-Z0-9_-]+$/.test(lastSeg)) {
      return `https://www.youtube.com/embed/${lastSeg}`;
    }

    return trimmed;
  } catch {
    return url;
  }
};

const appendAutoplay = (embedUrl, autoplay = true) => {
  if (!embedUrl) return "";
  if (!autoplay) return embedUrl;
  return embedUrl.includes("?")
    ? `${embedUrl}&autoplay=1`
    : `${embedUrl}?autoplay=1`;
};

const isDirectVideoFile = (url) => {
  if (!url) return false;
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
};

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const courseId = parseInt(id, 10);

  // State for course data
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // User and enrollment state (replace with actual auth logic)
  const [isLoggedIn] = useState(true); // Get from auth context
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);

  const [toast, setToast] = useState(null);
  const [expandedLectures, setExpandedLectures] = useState(new Set());
  const [completedChapters, setCompletedChapters] = useState(new Set());
  const [isTeacherAnimating, setIsTeacherAnimating] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  // Fetch course data from backend
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await api.get(`${API_BASE_URL}/courses/${courseId}`);
        
        if (response.data.success) {
          setCourse(response.data.course);
          
          // Check if course is free (pricingType === "free")
          const isFree = response.data.course.pricingType === "free";
          if (isFree) {
            setIsEnrolled(true);
          }
        }
      } catch (err) {
        console.error("Error fetching course:", err);
        setError(err.response?.data?.message || "Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  useEffect(() => {
    if (course) {
      setIsTeacherAnimating(true);
      const timer = setTimeout(() => setIsTeacherAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [course]);

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  // Check if course is free
  const isCourseFree = course?.pricingType === "free";

  const [selectedContent, setSelectedContent] = useState({
    type: null,
    lectureId: null,
    chapterId: null,
  });

  const selectedLecture = useMemo(() => {
    if (!selectedContent.lectureId) return null;
    return (
      (course?.Lectures || []).find(
        (l) => l.id === selectedContent.lectureId
      ) || null
    );
  }, [course, selectedContent.lectureId]);

  const selectedChapter = useMemo(() => {
    if (!selectedContent.chapterId || !selectedLecture) return null;
    return (
      (selectedLecture.Chapters || []).find(
        (ch) => ch.id === selectedContent.chapterId
      ) || null
    );
  }, [selectedLecture, selectedContent.chapterId]);

  const currentVideoContent = useMemo(() => {
    if (selectedContent.type === "chapter" && selectedChapter) {
      return selectedChapter;
    }
    if (selectedContent.type === "lecture" && selectedLecture) {
      return selectedLecture;
    }
    return null;
  }, [selectedContent, selectedLecture, selectedChapter]);

  const totalMinutes = useMemo(() => {
    if (!course) return 0;
    const totalHours = course.totalDurationHours || 0;
    const totalMins = course.totalDurationMinutes || 0;
    return totalHours * 60 + totalMins;
  }, [course]);

  const onLectureHeaderClick = (lectureId) => {
    if (!isLoggedIn) {
      setToast({
        message: "Please login to access course content",
        type: "error",
      });
      return;
    }
    if (!isCourseFree && !isEnrolled) {
      setToast({
        message: "Please enroll in the course to access content",
        type: "error",
      });
      return;
    }
    setExpandedLectures((prev) => {
      const next = new Set(prev);
      if (next.has(lectureId)) next.delete(lectureId);
      else next.add(lectureId);
      return next;
    });
  };

  const handleContentSelect = (lectureId, chapterId = null) => {
    if (!isLoggedIn) {
      setToast({
        message: "Please login to access course content",
        type: "error",
      });
      return;
    }

    if (isCourseFree || isEnrolled) {
      setSelectedContent({
        type: chapterId ? "chapter" : "lecture",
        lectureId,
        chapterId,
      });

      setExpandedLectures((prev) => {
        const next = new Set(prev);
        next.add(lectureId);
        return next;
      });
      return;
    }

    if (!isCourseFree && !isEnrolled) {
      setToast({
        message: "Please enroll in the course to access this content",
        type: "error",
      });
      return;
    }
  };

  const toggleChapterCompletion = (chapterId, e) => {
    if (e) e.stopPropagation();

    if (!isLoggedIn || !isEnrolled) {
      setToast({
        message: "Please enroll and login to track progress",
        type: "error",
      });
      return;
    }

    setCompletedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(chapterId)) next.delete(chapterId);
      else next.add(chapterId);
      return next;
    });
  };

  const handleEnroll = async () => {
    if (!isLoggedIn) {
      setToast({
        message: "Please login to enroll in the course",
        type: "error",
      });
      return;
    }

    setIsEnrolling(true);
    // TODO: Add actual enrollment API call here
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsEnrolled(true);
    setIsEnrolling(false);
    setToast({
      message: "Successfully enrolled in the course! You can now access all content.",
      type: "info",
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className={courseDetailStyles.notFoundContainer}>
        <div className={courseDetailStyles.notFoundContent}>
          <h2 className={courseDetailStyles.notFoundTitle}>Loading...</h2>
          <p className={courseDetailStyles.notFoundMessage}>Please wait while we load the course.</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !course) {
    return (
      <div className={courseDetailStyles.notFoundContainer}>
        <div className={courseDetailStyles.notFoundContent}>
          <h2 className={courseDetailStyles.notFoundTitle}>Course Not Found</h2>
          <p className={courseDetailStyles.notFoundMessage}>
            {error || "The course you are looking for does not exist."}
          </p>
          <button
            onClick={() => navigate("/courses")}
            className={courseDetailStyles.notFoundButton}
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const currentRawUrl = currentVideoContent?.videoUrl || null;
  const currentEmbedUrl = currentRawUrl ? toEmbedUrl(currentRawUrl) : null;
  const currentIsDirectVideo = isDirectVideoFile(currentEmbedUrl);

  return (
    <div className={courseDetailStyles.container}>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div
        className={`${courseDetailStyles.mainContainer} ${
          isPageLoaded
            ? courseDetailStyles.containerVisible
            : courseDetailStyles.containerHidden
        }`}
      >
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/courses")}
            className={courseDetailStyles.backButton}
          >
            <ArrowLeft className={courseDetailStyles.backIcon} />
            <span className={courseDetailStyles.backText}>Back To Home</span>
          </button>
        </div>

        <div className={courseDetailStyles.header}>
          <div className={courseDetailStyles.badge}>
            <BookOpen className={courseDetailStyles.badgeIcon} />
            <span className={courseDetailStyles.badgeText}>
              {isCourseFree ? "Free Course" : "Premium Course"}
            </span>
          </div>

          <h1 className={courseDetailStyles.title}>{course.name}</h1>

          {course.overview && (
            <div className={courseDetailStyles.overviewContainer}>
              <div className={courseDetailStyles.overview}>
                <div className={courseDetailStyles.overviewHeader}>
                  <Target className={courseDetailStyles.overviewIcon} />
                  <h3 className={courseDetailStyles.overviewTitle}>
                    Course Overview
                  </h3>
                </div>
                <p className={courseDetailStyles.overviewText}>
                  {course.overview}
                </p>
              </div>
            </div>
          )}

          <div className={`${courseDetailStyles.statsContainer} animation-delay-300`}>
            <div className={courseDetailStyles.statItem}>
              <Clock className={courseDetailStyles.statIcon} />
              <span className={courseDetailStyles.statText}>
                {fmtMinutes(totalMinutes)}
              </span>
            </div>

            <div className={courseDetailStyles.statItem}>
              <BookOpen className={courseDetailStyles.statIcon} />
              <span className={courseDetailStyles.statText}>
                {course.totalLectures || 0} Lectures
              </span>
            </div>

            <div
              className={`${courseDetailStyles.teacherStat} ${
                isTeacherAnimating ? courseDetailStyles.teacherAnimating : ""
              }`}
            >
              <User className={courseDetailStyles.statIcon} />
              <span className={courseDetailStyles.statText}>
                {course.teacher}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className={courseDetailStyles.mainGrid}>
          {/* Video Player */}
          <div className={courseDetailStyles.videoSection}>
            <div className={courseDetailStyles.videoContainer}>
              {currentEmbedUrl ? (
                currentIsDirectVideo ? (
                  <video
                    controls
                    src={currentEmbedUrl}
                    className={courseDetailStyles.video}
                  />
                ) : (
                  <iframe
                    title={
                      currentVideoContent.title ||
                      currentVideoContent.name ||
                      "video-player"
                    }
                    src={appendAutoplay(
                      currentEmbedUrl,
                      isLoggedIn && (isEnrolled || isCourseFree)
                    )}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className={courseDetailStyles.iframe}
                  />
                )
              ) : (
                <div className={courseDetailStyles.videoPlaceholder}>
                  <div className={courseDetailStyles.videoPlaceholderBg}>
                    <div className={courseDetailStyles.videoPlaceholderOrb1}></div>
                    <div className={courseDetailStyles.videoPlaceholderOrb2}></div>
                  </div>
                  <div className={courseDetailStyles.videoPlaceholderContent}>
                    <div className={courseDetailStyles.videoPlaceholderIcon}>
                      <Play className={courseDetailStyles.videoPlaceholderPlayIcon} />
                    </div>
                    <p className={courseDetailStyles.videoPlaceholderText}>
                      Select a lecture or chapter to play video
                    </p>
                    {(!isLoggedIn || (!isEnrolled && !isCourseFree)) && (
                      <p className={courseDetailStyles.videoPlaceholderSubtext}>
                        {!isLoggedIn ? "Login required" : "Enrollment required"}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className={courseDetailStyles.videoInfo}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className={courseDetailStyles.videoTitle}>
                      {currentVideoContent?.title ||
                        currentVideoContent?.name ||
                        "Select content to play"}
                    </h3>
                    <p className={courseDetailStyles.videoDescription}>
                      {selectedContent.type === "chapter"
                        ? `Part of: ${selectedLecture?.title}`
                        : currentVideoContent?.description}
                    </p>
                    {currentVideoContent?.totalMinutes && (
                      <div className={courseDetailStyles.videoMeta}>
                        <div className={courseDetailStyles.durationBadge}>
                          <Clock className={courseDetailStyles.durationIcon} />
                          <span>
                            {fmtMinutes(currentVideoContent.totalMinutes)}
                          </span>
                        </div>
                        {selectedContent.type === "chapter" && (
                          <span className={courseDetailStyles.chapterBadge}>
                            Chapter
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {isLoggedIn &&
                  (isEnrolled || isCourseFree) &&
                  selectedContent.chapterId && (
                    <div className={courseDetailStyles.completionSection}>
                      <button
                        onClick={() =>
                          toggleChapterCompletion(selectedContent.chapterId)
                        }
                        className={`${courseDetailStyles.completionButton} ${
                          completedChapters.has(selectedContent.chapterId)
                            ? courseDetailStyles.completionButtonCompleted
                            : courseDetailStyles.completionButtonIncomplete
                        }`}
                      >
                        {completedChapters.has(selectedContent.chapterId) ? (
                          <>
                            <CheckCircle className={courseDetailStyles.completionIcon} />
                            Chapter Completed
                          </>
                        ) : (
                          <>
                            <Circle className={courseDetailStyles.completionIcon} />
                            Mark as Complete
                          </>
                        )}
                      </button>
                      <p className={courseDetailStyles.completionText}>
                        {completedChapters.has(selectedContent.chapterId)
                          ? "Great job! You've completed this chapter."
                          : "Click to mark this chapter as completed."}
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className={courseDetailStyles.sidebar}>
            <div className={courseDetailStyles.contentCard}>
              <div className={courseDetailStyles.contentHeader}>
                <h4 className={courseDetailStyles.contentTitle}>
                  Course Content
                </h4>
                {isCourseFree && (
                  <div className={courseDetailStyles.freeBadge}>
                    <Sparkles className={courseDetailStyles.freeBadgeIcon} />
                    Free Access
                  </div>
                )}
              </div>

              <div className={courseDetailStyles.contentList}>
                {(course.Lectures || []).map((lecture, index) => (
                  <div
                    key={lecture.id}
                    className={courseDetailStyles.lectureItem}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div
                      className={`${courseDetailStyles.lectureHeader} ${
                        expandedLectures.has(lecture.id)
                          ? courseDetailStyles.lectureHeaderExpanded
                          : courseDetailStyles.lectureHeaderCollapsed
                      }`}
                      onClick={() => onLectureHeaderClick(lecture.id)}
                    >
                      <div className={courseDetailStyles.lectureHeaderContent}>
                        <div className={courseDetailStyles.lectureLeftSection}>
                          <div
                            className={`${courseDetailStyles.lectureChevron} ${
                              expandedLectures.has(lecture.id)
                                ? courseDetailStyles.lectureChevronExpanded
                                : courseDetailStyles.lectureChevronCollapsed
                            }`}
                          >
                            <ChevronDown className="w-5 h-5" />
                          </div>
                          <div className={courseDetailStyles.lectureInfo}>
                            <div className={courseDetailStyles.lectureTitle}>
                              {lecture.title}
                            </div>
                            <div className={courseDetailStyles.lectureMeta}>
                              <div className={courseDetailStyles.lectureDuration}>
                                <Clock className="w-4 h-4" />
                                {fmtMinutes(lecture.totalMinutes || 0)}
                              </div>
                              <span className={courseDetailStyles.lectureChapterCount}>
                                {lecture.Chapters?.length || 0} chapters
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {expandedLectures.has(lecture.id) && (
                      <div className={courseDetailStyles.chapterList}>
                        {(lecture.Chapters || []).map((chapter) => {
                          const isCompleted = completedChapters.has(chapter.id);
                          const isSelected =
                            selectedContent.chapterId === chapter.id &&
                            selectedContent.lectureId === lecture.id;

                          return (
                            <div
                              key={chapter.id}
                              className={`${courseDetailStyles.chapterItem} ${
                                isSelected
                                  ? courseDetailStyles.chapterSelected
                                  : courseDetailStyles.chapterNotSelected
                              } ${
                                !isCourseFree && !isEnrolled
                                  ? courseDetailStyles.chapterDisabled
                                  : ""
                              }`}
                              onClick={() =>
                                handleContentSelect(lecture.id, chapter.id)
                              }
                            >
                              <div className={courseDetailStyles.chapterContent}>
                                <div className={courseDetailStyles.chapterLeftSection}>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (isCourseFree || isEnrolled) {
                                        toggleChapterCompletion(chapter.id, e);
                                      }
                                    }}
                                    className={`${courseDetailStyles.completionToggle} ${
                                      isCompleted
                                        ? courseDetailStyles.completionToggleCompleted
                                        : courseDetailStyles.completionToggleIncomplete
                                    }`}
                                    disabled={!isCourseFree && !isEnrolled}
                                  >
                                    {isCompleted ? (
                                      <CheckCircle
                                        className={courseDetailStyles.completionIconSmall}
                                      />
                                    ) : (
                                      <Circle
                                        className={courseDetailStyles.completionIconSmall}
                                      />
                                    )}
                                  </button>
                                  <div className={courseDetailStyles.chapterText}>
                                    <div
                                      className={`${courseDetailStyles.chapterName} ${
                                        isSelected
                                          ? courseDetailStyles.chapterNameSelected
                                          : courseDetailStyles.chapterNameNotSelected
                                      }`}
                                    >
                                      {chapter.name}
                                    </div>
                                    <div className={courseDetailStyles.chapterTopic}>
                                      {chapter.topic}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className={courseDetailStyles.chapterDuration}>
                                    {fmtMinutes(chapter.totalMinutes || 0)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Card */}
            <div className={`${courseDetailStyles.pricingCard} animation-delay-200`}>
              <div className={courseDetailStyles.pricingHeader}>
                <h5 className={courseDetailStyles.pricingTitle}>Pricing</h5>
              </div>

              <div className={courseDetailStyles.pricingAmount}>
                <div className={courseDetailStyles.price}>
                  {isCourseFree ? "Free" : "Premium"}
                </div>
              </div>

              <p className={courseDetailStyles.pricingDescription}>
                {isCourseFree
                  ? "Free access · Learn anytime"
                  : "One-time payment · Lifetime access"}
              </p>

              <div className="mt-6">
                {isCourseFree ? (
                  <button
                    disabled
                    className={`${courseDetailStyles.enrollButton} ${courseDetailStyles.freeEnrolledButton}`}
                  >
                    <CheckCircle className={courseDetailStyles.enrollIcon} />
                    Free Course - Access Granted
                  </button>
                ) : !isEnrolled ? (
                  <button
                    onClick={handleEnroll}
                    disabled={isEnrolling}
                    className={`${courseDetailStyles.enrollButton} ${courseDetailStyles.enrollPaidButton}`}
                  >
                    {isEnrolling ? (
                      <>
                        <div className={courseDetailStyles.enrollSpinner}></div>
                        Enrolling...
                      </>
                    ) : (
                      <>
                        <Play className={courseDetailStyles.enrollIcon} />
                        Enroll Now
                        <span>
                          <ArrowRight className={courseDetailStyles.enrollArrow} />
                        </span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    disabled
                    className={`${courseDetailStyles.enrollButton} ${courseDetailStyles.enrolledButton}`}
                  >
                    <CheckCircle className={courseDetailStyles.enrollIcon} />
                    Enrolled
                  </button>
                )}
              </div>
            </div>

            {/* Progress Summary */}
            <div className={`${courseDetailStyles.progressCard} animation-delay-400`}>
              <div className={courseDetailStyles.progressHeader}>
                <Award className={courseDetailStyles.progressIcon} />
                <h5 className={courseDetailStyles.progressTitle}>
                  Your Progress
                </h5>
              </div>
              <div className={courseDetailStyles.progressContent}>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Course Completion</span>
                    <span className="font-semibold text-indigo-600">
                      {Math.round(
                        (completedChapters.size /
                          (course.Lectures?.flatMap((l) => l.Chapters || [])
                            .length || 1)) *
                          100
                      )}
                      %
                    </span>
                  </div>
                  <div className={courseDetailStyles.progressBar}>
                    <div
                      className={courseDetailStyles.progressFill}
                      style={{
                        width: `${
                          (completedChapters.size /
                            (course.Lectures?.flatMap((l) => l.Chapters || [])
                              .length || 1)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
                <div className={courseDetailStyles.progressStats}>
                  <div className={courseDetailStyles.progressStat}>
                    <div className={courseDetailStyles.progressStatValue}>
                      {fmtMinutes(totalMinutes)}
                    </div>
                    <div className={courseDetailStyles.progressStatLabel}>
                      Total Duration
                    </div>
                  </div>
                  <div className={courseDetailStyles.progressStat}>
                    <div className={courseDetailStyles.progressStatValue}>
                      {completedChapters.size}
                    </div>
                    <div className={courseDetailStyles.progressStatLabel}>
                      Completed
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style jsx>{courseDetailStyles.animations}</style>
    </div>
  );
};

export default CourseDetailPage;