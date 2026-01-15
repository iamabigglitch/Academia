import React, { useEffect, useMemo, useState } from "react";
import { BookOpen, Target, X, Clock, ArrowLeft, User, Play, ChevronDown, ArrowRight, Award, Sparkles, CheckCircle, Circle, } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const BRAND = "#1c398e";

const fmtMinutes = (mins = 0) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
};

const toEmbedUrl = (url) => {
  if (!url) return "";
  if (url.includes("embed")) return url;
  const yt = url.match(/[?&]v=([^&#]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const short = url.match(/youtu\.be\/([^?&#]+)/);
  if (short) return `https://www.youtube.com/embed/${short[1]}`;
  return url;
};

const isDirectVideo = (url) =>
  /\.(mp4|webm|ogg)(\?.*)?$/i.test(url || "");

const Toast = ({ message, type = "info", onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`fixed top-6 right-6 z-50 px-5 py-4 rounded-xl shadow-xl text-white animate-slide-in ${
        type === "error" ? "bg-red-600" : "bg-[#1c398e]"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">{message}</span>
        <button onClick={onClose}>
          <X className="w-4 h-4 opacity-80 hover:opacity-100" />
        </button>
      </div>
    </div>
  );
};

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const courseId = Number(id);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [expanded, setExpanded] = useState(new Set());
  const [completed, setCompleted] = useState(new Set());
  const [selected, setSelected] = useState(null);

  // const { isAuthenticated } = useAuth();
  // const isEnrolled = course?.pricingType === "free";


  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`${API_BASE_URL}/courses/${courseId}`);
        setCourse(res.data.course);
      } catch {
        setToast({ message: "Failed to load course", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  const selectedLecture = useMemo(
    () => course?.Lectures?.find((l) => l.id === selected?.lectureId),
    [course, selected]
  );

  const selectedChapter = useMemo(
    () =>
      selectedLecture?.Chapters?.find(
        (c) => c.id === selected?.chapterId
      ),
    [selectedLecture, selected]
  );

  const video = selectedChapter || selectedLecture;
  const videoUrl = toEmbedUrl(video?.videoUrl);
  const totalMinutes =
    (course?.totalDurationHours || 0) * 60 +
    (course?.totalDurationMinutes || 0);

  
  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-gray-500">
        Loading course…
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen grid place-items-center">
        <button
          onClick={() => navigate("/courses")}
          className="px-5 py-2 rounded-lg bg-[#1c398e] text-white"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Back */}
      <button
        onClick={() => navigate("/courses")}
        className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#1c398e] mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Courses
      </button>

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10 animate-fade-up">
        <span className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-full bg-[#1c398e]/10 text-[#1c398e] font-medium">
          <BookOpen className="w-4 h-4" />
          {course.pricingType === "free" ? "Free Course" : "Premium Course"}
        </span>

        <h1 className="mt-4 text-3xl md:text-5xl font-bold text-gray-900">
          {course.name}
        </h1>

        <p className="mt-4 max-w-3xl text-gray-600">
          {course.overview}
        </p>

        <div className="flex gap-6 mt-6 text-sm text-gray-600">
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#1c398e]" />
            {fmtMinutes(totalMinutes)}
          </span>
          <span className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#1c398e]" />
            {course.teacher}
          </span>
        </div>
      </div>

      {/* Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Video */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden animate-fade-up">
          {videoUrl ? (
            isDirectVideo(videoUrl) ? (
              <video controls className="w-full h-[460px]" src={videoUrl} />
            ) : (
              <iframe
                className="w-full h-[460px]"
                src={videoUrl}
                allowFullScreen
              />
            )
          ) : (
            <div className="h-[460px] grid place-items-center text-gray-400">
              <Play className="w-10 h-10 mb-2" />
              Select a lecture to start
            </div>
          )}

          <div className="p-6">
            <h3 className="text-xl font-semibold">
              {video?.title || video?.name}
            </h3>
            <p className="text-gray-600 mt-1">
              {video?.description}
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 animate-fade-up">
          {/* Content */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h4 className="font-semibold mb-4">Course Content</h4>

            {course.Lectures.map((lec) => (
              <div key={lec.id} className="border-b last:border-none">
                <button
                  onClick={() =>
                    setExpanded((s) =>
                      s.has(lec.id)
                        ? new Set([...s].filter((x) => x !== lec.id))
                        : new Set(s).add(lec.id)
                    )
                  }
                  className="w-full flex justify-between items-center py-3"
                >
                  <span className="font-medium">{lec.title}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition ${
                      expanded.has(lec.id) ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {expanded.has(lec.id) &&
                  lec.Chapters.map((ch) => (
                    <div
                      key={ch.id}
                      onClick={() =>
                        setSelected({
                          lectureId: lec.id,
                          chapterId: ch.id,
                        })
                      }
                      className={`flex justify-between items-center px-3 py-2 rounded-lg cursor-pointer text-sm ${
                        selected?.chapterId === ch.id
                          ? "bg-[#1c398e]/10 text-[#1c398e]"
                          : "hover:bg-slate-100"
                      }`}
                    >
                      <span>{ch.name}</span>
                      <span className="text-gray-400">
                        {fmtMinutes(ch.totalMinutes)}
                      </span>
                    </div>
                  ))}
              </div>
            ))}
          </div>

          {/* Progress */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-[#1c398e]" />
              <h4 className="font-semibold">Your Progress</h4>
            </div>

            <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-[#1c398e] transition-all"
                style={{
                  width: `${
                    (completed .size /
                      (course.Lectures.flatMap((l) => l.Chapters).length ||
                        1)) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>
        </aside>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateX(30px); }
            to { opacity: 1; transform: translateX(0); }
          }
          .animate-fade-up { animation: fadeUp .6s ease both; }
          .animate-slide-in { animation: slideIn .4s ease both; }
        `}
      </style>
    </div>
  );
};

export default CourseDetailPage;
