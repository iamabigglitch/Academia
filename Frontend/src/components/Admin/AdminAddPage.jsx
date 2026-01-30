import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { DollarSign, Star } from 'lucide-react';
import { Image as ImageIcon, Upload, Video, Plus, BookOpenText, Clock, ListOrdered, PenLine, UserPen, ChevronUp, ChevronDown, X } from 'lucide-react';

const API_BASE = 'http://localhost:3000';

const formatDuration = (a, b) => {
  let hours = 0;
  let minutes = 0;
  if (typeof a === "object" && a !== null) {
    hours = Number(a.hours) || 0;
    minutes = Number(a.minutes) || 0;
  } else {
    hours = Number(a) || 0;
    minutes = Number(b) || 0;
  }
  const totalMinutes = Math.max(0, Math.floor(hours * 60 + minutes));
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`;
  if (hrs > 0) return `${hrs}h`;
  return `${mins}m`;
};

// Helper function to normalize lecture/chapter totals
const computeCourseTotals = (lectures = []) => {
  const cloned = (Array.isArray(lectures) ? lectures : []).map((lecture) => {
    const lec = {
      ...lecture,
      duration: {
        hours: Number(lecture?.duration?.hours) || 0,
        minutes: Number(lecture?.duration?.minutes) || 0,
      },
      chapters: Array.isArray(lecture?.chapters) ? [...lecture.chapters] : [],
    };

    // compute chapter totals and sum
    let chaptersMinutes = 0;
    lec.chapters = lec.chapters.map((ch) => {
      const chHours = Number(ch?.duration?.hours) || 0;
      const chMins = Number(ch?.duration?.minutes) || 0;
      const chTotal = Math.max(0, chHours * 60 + chMins);
      chaptersMinutes += chTotal;
      return {
        ...ch,
        duration: { hours: chHours, minutes: chMins },
        totalMinutes: chTotal,
      };
    });

    // rule: chapters override lecture.duration when present
    let lectureTotalMinutes = 0;
    if (lec.chapters.length > 0) {
      lectureTotalMinutes = chaptersMinutes;
    } else {
      lectureTotalMinutes = Math.max(
        0,
        (Number(lec.duration.hours) || 0) * 60 +
          (Number(lec.duration.minutes) || 0)
      );
    }

    // normalize lecture.duration from computed total
    const lh = Math.floor(lectureTotalMinutes / 60);
    const lm = lectureTotalMinutes % 60;

    return {
      ...lec,
      totalMinutes: lectureTotalMinutes,
      duration: { hours: lh, minutes: lm },
    };
  });

  const courseTotalMinutes = cloned.reduce(
    (s, l) => s + (Number(l.totalMinutes) || 0),
    0
  );

  return {
    lectures: cloned,
    totalLectures: cloned.length,
    totalDuration: {
      hours: Math.floor(courseTotalMinutes / 60),
      minutes: courseTotalMinutes % 60,
    },
  };
};

const AddPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    teacher: "",
    image: null,
    rating: 0,
    pricingType: "free",
    price: { original: "", sale: "" },
    overview: "",
    totalDuration: { hours: "", minutes: "" },
    totalLectures: "",
    lectures: [],
    courseType: "regular",
  });

  const [currentLecture, setCurrentLecture] = useState({
    title: "",
    duration: { hours: "", minutes: "" },
    chapters: [],
  });

  const [currentChapter, setCurrentChapter] = useState({
    name: "",
    topic: "",
    duration: { hours: "", minutes: "" },
    videoUrl: "",
  });

  const [showLectureForm, setShowLectureForm] = useState(false);
  const [showChapterForm, setShowChapterForm] = useState(false);
  const [expandedLectures, setExpandedLectures] = useState([]);
  const [selectedLectureIndex, setSelectedLectureIndex] = useState(null);

  // Toggle lectures
  const toggleLecture = (index) =>
    setExpandedLectures((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("price.")) {
      const priceField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        price: { ...prev.price, [priceField]: value },
      }));
    } else if (name.includes("totalDuration.")) {
      const durationField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        totalDuration: { ...prev.totalDuration, [durationField]: value },
      }));
    } else if (name === "totalLectures") {
      setFormData((prev) => ({ ...prev, totalLectures: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCourseTypeChange = (type) => {
    setFormData((prev) => ({ ...prev, courseType: type }));
    toast.success(
      type === "top"
        ? "Course set as Top Course!"
        : "Course set as Regular Course!"
    );
  };

  // Image handling
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setFormData((prev) => ({
        ...prev,
        image: { file, preview: ev.target.result },
      }));
      toast.success("Image uploaded successfully!");
    };
    reader.readAsDataURL(file);
  };

  const handleRatingChange = (rating) =>
    setFormData((prev) => ({ ...prev, rating }));

  const handleLectureChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("duration.")) {
      const durationField = name.split(".")[1];
      setCurrentLecture((prev) => ({
        ...prev,
        duration: { ...prev.duration, [durationField]: value },
      }));
    } else {
      setCurrentLecture((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleChapterChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("duration.")) {
      const durationField = name.split(".")[1];
      setCurrentChapter((prev) => ({
        ...prev,
        duration: { ...prev.duration, [durationField]: value },
      }));
    } else {
      setCurrentChapter((prev) => ({ ...prev, [name]: value }));
    }
  };

  const calculateTotalMinutes = (hours, minutes) =>
    (parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0);

  const calculateTotalCourseDuration = () => {
    const { totalDuration } = computeCourseTotals(formData.lectures);
    return formatDuration(totalDuration);
  };

  const calculateTotalLectures = () => formData.lectures.length;

  const formatTotalDuration = () => formatDuration(formData.totalDuration);

  // Validate form fields
  const validateForm = () => {
    if (!formData.name?.trim()) {
      toast.error("Please enter course name");
      return false;
    }
    if (!formData.teacher?.trim()) {
      toast.error("Please enter instructor name");
      return false;
    }
    if (!formData.image?.file) {
      toast.error("Please upload a course image");
      return false;
    }
    if (!formData.overview?.trim()) {
      toast.error("Please enter course overview");
      return false;
    }
    if (!formData.totalLectures || Number(formData.totalLectures) <= 0) {
      toast.error("Please enter valid total lectures count");
      return false;
    }
    if (!formData.totalDuration.hours && !formData.totalDuration.minutes) {
      toast.error("Please enter total duration");
      return false;
    }
    if (formData.pricingType === "paid") {
      if (
        !formData.price.original ||
        parseFloat(formData.price.original) <= 0
      ) {
        toast.error("Please enter valid original price for paid course");
        return false;
      }
     
      if (formData.price.sale && parseFloat(formData.price.sale) >= parseFloat(formData.price.original)) {
        toast.error("Sale price should be less than original price");
        return false;
      }
    }
    if (formData.lectures.length === 0) {
      toast.error("Please add at least one lecture");
      return false;
    }
    for (let i = 0; i < formData.lectures.length; i++) {
      const lecture = formData.lectures[i];
      if (!lecture.title?.trim()) {
        toast.error(`Lecture ${i + 1} has no title`);
        return false;
      }
      if (
        (lecture.chapters?.length || 0) === 0 &&
        !lecture.duration.hours &&
        !lecture.duration.minutes
      ) {
        toast.error(`Lecture ${i + 1} has no duration`);
        return false;
      }
    }
    return true;
  };

  // Add lecture
  const addLecture = () => {
    if (!currentLecture.title?.trim()) {
      toast.error("Please enter lecture title");
      return;
    }

    const hasChapters =
      Array.isArray(currentLecture.chapters) &&
      currentLecture.chapters.length > 0;
    if (
      !hasChapters &&
      !currentLecture.duration.hours &&
      !currentLecture.duration.minutes
    ) {
      toast.error(
        "Please enter lecture duration or add chapters with durations"
      );
      return;
    }

    const lecture = {
      id: `lecture-${Date.now()}`,
      title: currentLecture.title.trim(),
      duration: {
        hours: Number(currentLecture.duration.hours) || 0,
        minutes: Number(currentLecture.duration.minutes) || 0,
      },
      chapters: (currentLecture.chapters || []).map((ch) => ({ ...ch })),
    };

    const newLectures = [...formData.lectures, lecture];
    const computed = computeCourseTotals(newLectures);

    setFormData((prev) => ({
      ...prev,
      lectures: computed.lectures,
      totalDuration: computed.totalDuration,
      totalLectures: computed.totalLectures,
    }));

    setCurrentLecture({
      title: "",
      duration: { hours: "", minutes: "" },
      chapters: [],
    });
    setShowLectureForm(false);
    setExpandedLectures((prev) => [...prev, (formData.lectures || []).length]);
    toast.success("Lecture added successfully!");
  };

  // Add chapter
  const addChapter = () => {
    if (!currentChapter.name?.trim()) {
      toast.error("Please enter chapter name");
      return;
    }
    if (!currentChapter.topic?.trim()) {
      toast.error("Please enter chapter topic");
      return;
    }
    if (!currentChapter.duration.hours && !currentChapter.duration.minutes) {
      toast.error("Please enter chapter duration");
      return;
    }
    if (!currentChapter.videoUrl?.trim()) {
      toast.error("Please enter video URL");
      return;
    }

    const chapter = {
      id: `chapter-${Date.now()}`,
      name: currentChapter.name.trim(),
      topic: currentChapter.topic.trim(),
      duration: {
        hours: Number(currentChapter.duration.hours) || 0,
        minutes: Number(currentChapter.duration.minutes) || 0,
      },
      totalMinutes: calculateTotalMinutes(
        currentChapter.duration.hours,
        currentChapter.duration.minutes
      ),
      videoUrl: currentChapter.videoUrl.trim(),
    };

    let newLectures = [...formData.lectures];

    if (
      selectedLectureIndex !== null &&
      typeof selectedLectureIndex === "number"
    ) {
      if (!newLectures[selectedLectureIndex]) {
        toast.error("Selected lecture not found");
        return;
      }
      newLectures[selectedLectureIndex] = {
        ...newLectures[selectedLectureIndex],
        chapters: [
          ...(newLectures[selectedLectureIndex].chapters || []),
          chapter,
        ],
      };

      const computed = computeCourseTotals(newLectures);
      setFormData((prev) => ({
        ...prev,
        lectures: computed.lectures,
        totalDuration: computed.totalDuration,
        totalLectures: computed.totalLectures,
      }));
      toast.success("Chapter added successfully!");
    } else {
      setCurrentLecture((prev) => ({
        ...prev,
        chapters: [...(prev.chapters || []), chapter],
      }));
      toast.success("Chapter added to current lecture draft!");
    }

    setCurrentChapter({
      name: "",
      topic: "",
      duration: { hours: "", minutes: "" },
      videoUrl: "",
    });
    setShowChapterForm(false);
    setSelectedLectureIndex(null);
  };

  const openAddChapter = (lectureIndex = null) => {
    setSelectedLectureIndex(lectureIndex);
    setShowChapterForm(true);
  };

  const removeLecture = (index) => {
    const updated = formData.lectures.filter((_, i) => i !== index);
    const computed = computeCourseTotals(updated);
    setFormData((prev) => ({
      ...prev,
      lectures: computed.lectures,
      totalDuration: computed.totalDuration,
      totalLectures: computed.totalLectures,
    }));
    setExpandedLectures((prev) =>
      prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i))
    );
    toast.success("Lecture removed");
  };

  const removeChapter = (lectureIndex, chapterIndex) => {
    const updated = formData.lectures.map((lec, li) => {
      if (li !== lectureIndex) return lec;
      return {
        ...lec,
        chapters: (lec.chapters || []).filter((_, ci) => ci !== chapterIndex),
      };
    });
    const computed = computeCourseTotals(updated);
    setFormData((prev) => ({
      ...prev,
      lectures: computed.lectures,
      totalDuration: computed.totalDuration,
      totalLectures: computed.totalLectures,
    }));
    toast.success("Chapter removed");
  };

  // Submit
  const submitToBackend = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const computed = computeCourseTotals(formData.lectures);
      const fd = new FormData();

      fd.append("name", formData.name);
      fd.append("teacher", formData.teacher);
      fd.append("rating", String(formData.rating || 0));
      fd.append("pricingType", formData.pricingType);
      fd.append("overview", formData.overview);
      fd.append(
        "totalLectures",
        String(formData.totalLectures || computed.totalLectures || 0)
      );
      fd.append("courseType", formData.courseType);

      fd.append("price", JSON.stringify(formData.price));
      fd.append("totalDuration", JSON.stringify(computed.totalDuration));
      fd.append("lectures", JSON.stringify(computed.lectures));

      if (formData.image?.file) fd.append("image", formData.image.file);

      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/api/course`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const message =
          data?.message || data?.error || "Failed to create course";
        toast.error(message);
        setLoading(false);
        return;
      }

      toast.success("Course created successfully!");
      navigate("/listcourse");
    } catch (err) {
      console.error("submitToBackend error:", err);
      toast.error("Server error while creating course");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitToBackend();
  };

  const StarRating = ({ rating, onRatingChange }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          className="transition-all duration-200 hover:scale-110 focus:outline-none"
        >
          {star <= rating ? (
            <Star className="fill-yellow-400 text-yellow-400" size={24} />
          ) : (
            <Star className="text-gray-300 hover:text-yellow-300" size={24} />
          )}
        </button>
      ))}
    </div>
  );

  const PRIMARY_COLOR = "#4F46E5";
  const SUCCESS_COLOR = "#22C55E";
  const WARNING_COLOR = "#F59E0B";
  const DANGER_COLOR = "#EF4444";
  
  return (
    
    <div className="min-h-screen bg-[#F1F5F9] pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <Toaster position='top-right' toastOptions={{ duration: 3000 }} />

      <div className="max-w-5xl mx-auto">
       
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
            Create New Course
          </h1>
          <p className="text-base text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
            Build an exceptional learning experience for your students
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Course Type */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">

            <div className="flex items-start gap-3 mb-5">
              <div className="p-2.5 rounded-lg bg-indigo-50">
                <BookOpenText className="text-indigo-600" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900" style={{ fontFamily: "'Inter', sans-serif" }}>Course Type</h2>
                <p className="text-sm text-gray-600 mt-0.5">Select the type of course you want to create</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                htmlFor="top"
                className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  formData.courseType === "top"
                    ? 'border-[#F59E0B] bg-amber-50/50'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  id="top"
                  name="courseType"
                  value="top"
                  checked={formData.courseType === "top"}
                  onChange={() => handleCourseTypeChange("top")}
                  className="w-4 h-4 text-[#F59E0B] border-gray-300 focus:ring-[#F59E0B] focus:ring-2"
                />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Top Course</h3>
                </div>
              </label>

              <label
                htmlFor="regular"
                className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  formData.courseType === "regular"
                    ? `bg-indigo-50/50 border-[${PRIMARY_COLOR}]`
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
                style={formData.courseType === "regular" ? { borderColor: PRIMARY_COLOR } : {}}
              >
                <input
                  type="radio"
                  id="regular"
                  name="courseType"
                  value="regular"
                  checked={formData.courseType === "regular"}
                  onChange={() => handleCourseTypeChange("regular")}
                  className="w-4 h-4 border-gray-300 focus:ring-2"
                  style={{ color: PRIMARY_COLOR, accentColor: PRIMARY_COLOR }}
                />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Regular Course</h3>
                </div>
              </label>
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start gap-3 mb-5">
              <div className="p-2.5 rounded-lg bg-indigo-50">
                <BookOpenText className="text-indigo-600" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900" style={{ fontFamily: "'Inter', sans-serif" }}>Course Information</h2>
                <p className="text-sm text-gray-600 mt-0.5">Basic details about your course</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Course Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <PenLine size={16} className="text-indigo-600" />
                  Course Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  placeholder="Course Name"
                  required
                />
              </div>

              {/* Instructor Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <UserPen size={16} className="text-indigo-600" />
                  Instructor Name *
                </label>
                <input
                  type="text"
                  name="teacher"
                  value={formData.teacher}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  placeholder="Instructor Name"
                  required
                />
              </div>

              {/* Course Rating */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Star size={16} className="text-indigo-600" />
                  Course Rating
                </label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <StarRating
                    rating={formData.rating}
                    onRatingChange={handleRatingChange}
                  />
                </div>
              </div>

              {/* Total Duration */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Clock size={16} className="text-indigo-600" />
                  Total Duration *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="number"
                      name="totalDuration.hours"
                      value={formData.totalDuration.hours}
                      onChange={handleInputChange}
                      placeholder="Hours"
                      min="0"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900"
                    />
                    <span className="text-xs text-gray-500 mt-1 block">Hours</span>
                  </div>
                  <div>
                    <input
                      type="number"
                      name="totalDuration.minutes"
                      value={formData.totalDuration.minutes}
                      onChange={handleInputChange}
                      placeholder="Minutes"
                      min="0"
                      max="59"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900"
                    />
                    <span className="text-xs text-gray-500 mt-1 block">Minutes</span>
                  </div>
                </div>
                {(formData.totalDuration.hours || formData.totalDuration.minutes) && (
                  <p className="text-sm text-gray-600 mt-2">
                    Total: {formatTotalDuration()}
                  </p>
                )}
              </div>

              {/* Total Lectures */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <ListOrdered size={16} className="text-indigo-600" />
                  Total Lectures *
                </label>
                <input
                  type="number"
                  name="totalLectures"
                  value={formData.totalLectures}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900"
                  placeholder="Enter total number of lectures"
                  required
                />
              </div>

              {/* Pricing Type */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <DollarSign size={16} className="text-indigo-600" />
                  Pricing Type *
                </label>
                <select
                  name="pricingType"
                  value={formData.pricingType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <option value="free">Free Course</option>
                  <option value="paid">Paid Course</option>
                </select>
              </div>

              {/* Paid Course Prices */}
              {formData.pricingType === "paid" && (
                <>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <DollarSign size={16} className="text-indigo-600" />
                      Original Price *
                    </label>
                    <input
                      type="number"
                      name="price.original"
                      value={formData.price.original}
                      onChange={handleInputChange}
                      min="1"
                      step="0.01"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900"
                      placeholder="200"
                      required={formData.pricingType === "paid"}
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <DollarSign size={16} className="text-indigo-600" />
                      Sale Price (Optional)
                    </label>
                    <input
                      type="number"
                      name="price.sale"
                      value={formData.price.sale}
                      onChange={handleInputChange}
                      min="1"
                      step="0.01"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900"
                      placeholder="99"
                    />
                  </div>
                </>
              )}

              {/* Course Image */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <ImageIcon size={16} className="text-indigo-600" />
                  Course Image *
                </label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      required
                    />
                    <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50/30 transition-colors">
                      <Upload size={18} className="text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">
                        {formData.image ? "Change Image" : "Upload Course Image"}
                      </span>
                    </div>
                  </label>
                  {formData.image && (
                    <div className="w-full sm:w-48 h-32 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 shadow-sm">
                      <img
                        src={formData.image.preview}
                        alt="Course preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Course Overview */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <BookOpenText size={16} className="text-indigo-600" />
                  Course Overview *
                </label>
                <textarea
                  name="overview"
                  value={formData.overview}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900 resize-none"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  placeholder="Describe what students will learn in this course..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Lectures Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-indigo-50">
                  <Video className="text-indigo-600" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900" style={{ fontFamily: "'Inter', sans-serif" }}>Course Content</h2>
                  {formData.lectures.length > 0 ? (
                    <p className="text-sm text-gray-600 mt-0.5">
                      {calculateTotalLectures()} lectures • {calculateTotalCourseDuration()} total
                    </p>
                  ) : (
                    <p className="text-sm text-gray-600 mt-0.5">Add lectures and chapters to structure your course</p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLectureForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#4F46E5] text-white rounded-lg text-sm font-medium transition-all hover:bg-indigo-700 shadow-sm"
              >
                <Plus size={16} /> Add Lecture
              </button>
            </div>

            {/* Lectures List */}
            <div className="space-y-3">
              {formData.lectures.map((lecture, lectureIndex) => (
                <div key={lecture.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between p-4 bg-gray-50">
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        type="button"
                        onClick={() => toggleLecture(lectureIndex)}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {expandedLectures.includes(lectureIndex) ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </button>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">{lecture.title}</h3>
                        <p className="text-xs text-gray-600 mt-0.5 flex items-center gap-1">
                          <Clock size={12} /> {formatDuration(lecture.duration)}
                          {lecture.chapters?.length > 0 && ` • ${lecture.chapters.length} chapters`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openAddChapter(lectureIndex)}
                        className="px-3 py-1.5 text-xs font-medium bg-[#4F46E5] text-white rounded-lg transition-all hover:bg-indigo-700"
                      >
                        <Plus size={12} className="inline mr-1" /> Chapter
                      </button>
                      <button
                        type="button"
                        onClick={() => removeLecture(lectureIndex)}
                        className="p-1.5 text-[#EF4444] hover:bg-red-50 rounded transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Chapters */}
                  {expandedLectures.includes(lectureIndex) && lecture.chapters?.length > 0 && (
                    <div className="p-4 space-y-2 bg-white">
                      {lecture.chapters.map((chapter, chapterIndex) => (
                        <div
                          key={chapter.id}
                          className="flex items-start justify-between p-3 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors bg-gray-50/50"
                        >
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900">{chapter.name}</h4>
                            <p className="text-xs text-gray-600 mt-0.5">{chapter.topic}</p>
                            <div className="flex items-center gap-3 mt-1.5">
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock size={11} /> {formatDuration(chapter.duration)}
                              </span>
                              <p className="text-xs text-gray-400 truncate max-w-xs">{chapter.videoUrl}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeChapter(lectureIndex, chapterIndex)}
                            className="p-1 text-[#EF4444] hover:bg-red-50 rounded transition-colors ml-2"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="relative px-8 py-3 bg-[#4F46E5] text-white rounded-lg font-medium text-base transition-all hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group shadow-lg shadow-indigo-500/30"
              disabled={loading}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="relative">
                {loading ? "Creating..." : `Create ${formData.courseType === "top" ? "Top" : "Regular"} Course`}
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* Lecture Modal */}
      {showLectureForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-50">
                  <Video className="text-indigo-600" size={20} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Add New Lecture</h3>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lecture Title *</label>
                <input
                  type="text"
                  name="title"
                  value={currentLecture.title}
                  onChange={handleLectureChange}
                  placeholder="Enter Title of the Lecture"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration *</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="number"
                      name="duration.hours"
                      value={currentLecture.duration.hours}
                      onChange={handleLectureChange}
                      placeholder="Hours"
                      min="0"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                    <span className="text-xs text-gray-500 mt-1 block">Hours</span>
                  </div>
                  <div>
                    <input
                      type="number"
                      name="duration.minutes"
                      value={currentLecture.duration.minutes}
                      onChange={handleLectureChange}
                      placeholder="Minutes"
                      min="0"
                      max="59"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                    <span className="text-xs text-gray-500 mt-1 block">Minutes</span>
                  </div>
                </div>
              </div>

              {currentLecture.chapters.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chapters in this lecture:</label>
                  <div className="space-y-2">
                    {currentLecture.chapters.map((chapter) => (
                      <div key={chapter.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-sm font-medium text-gray-900">{chapter.name}</div>
                        <div className="text-xs text-gray-600">{formatDuration(chapter.duration)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => openAddChapter()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Plus size={14} /> Add Chapter
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={addLecture}
                  className="flex-1 px-4 py-2.5 bg-[#4F46E5] text-white rounded-lg font-medium transition-all hover:bg-indigo-700"
                >
                  Add Lecture
                </button>
                <button
                  type="button"
                  onClick={() => setShowLectureForm(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chapter Modal */}
      {showChapterForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-50">
                  <Plus className="text-[#22C55E]" size={20} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedLectureIndex !== null ? "Add Chapter to Lecture" : "Add Chapter to Current Lecture"}
                </h3>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chapter Name *</label>
                <input
                  type="text"
                  name="name"
                  value={currentChapter.name}
                  onChange={handleChapterChange}
                  placeholder="Enter Chapter Name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Topic *</label>
                <input
                  type="text"
                  name="topic"
                  value={currentChapter.topic}
                  onChange={handleChapterChange}
                  placeholder="What we'll build"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration *</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="number"
                      name="duration.hours"
                      value={currentChapter.duration.hours}
                      onChange={handleChapterChange}
                      placeholder="Hours"
                      min="0"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                    <span className="text-xs text-gray-500 mt-1 block">Hours</span>
                  </div>
                  <div>
                    <input
                      type="number"
                      name="duration.minutes"
                      value={currentChapter.duration.minutes}
                      onChange={handleChapterChange}
                      placeholder="Minutes"
                      min="0"
                      max="59"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                    <span className="text-xs text-gray-500 mt-1 block">Minutes</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Video URL *</label>
                <input
                  type="url"
                  name="videoUrl"
                  value={currentChapter.videoUrl}
                  onChange={handleChapterChange}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={addChapter}
                  className="flex-1 px-4 py-2.5 bg-[#4F46E5] text-white rounded-lg font-medium transition-all hover:bg-indigo-700"
                >
                  Add Chapter
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowChapterForm(false);
                    setSelectedLectureIndex(null);
                  }}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPage;