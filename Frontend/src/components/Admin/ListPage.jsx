// import React, { useState } from 'react'
// import { listStyles } from '../../assets/dummyStylesAdmin';
// import {toast, Toaster} from "react-hot-toast";
// import axios from 'axios';

// const ListPage = () => {

//   const [searchTerm, setSearchTerm] = useState("");
//   const [expandedCourse, setExpandedCourse] = useState(null);
//   const [expandedLectures, setExpandedLectures] = useState({});
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const API_BASE = "http://localhost:4000";

//     //build image URL for fetching
//    const getImageUrl = (imagePath) => {
//     if (!imagePath) return "";
//     if (imagePath.startsWith("http://") || imagePath.startsWith("https://"))
//       return imagePath;

//     // If the server sends path like "/uploads/..." or "uploads/..."
//     if (imagePath.startsWith("/")) return `${API_BASE}${imagePath}`;
//     if (imagePath.includes("/uploads/"))
//       return `${API_BASE}/${imagePath}`.replace(/\/\/+/g, "/");
//     return `${API_BASE}/uploads/${imagePath}`;
//   };

//     //parse duration into total minutes 
//     const parseDuration = (v) => {
//     if (v == null) return 0;

//     // number -> assume minutes
//     if (typeof v === "number" && Number.isFinite(v))
//       return Math.max(0, Math.floor(v));

//     // String -> try "1h 20m" or "80m" or plain number string
//     if (typeof v === "string") {
//       const s = v.trim();
//       // match hours and minutes like "1h 20m" or "1 h 20 m"
//       const hMatch = s.match(/(\d+)\s*h/i);
//       const mMatch = s.match(/(\d+)\s*m/i);
//       let total = 0;
//       if (hMatch) total += parseInt(hMatch[1], 10) * 60;
//       if (mMatch) total += parseInt(mMatch[1], 10);
//       if (total > 0) return total;
//       // maybe it's just a plain number in minutes
//       const plain = parseInt(s.replace(/[^\d-]/g, ""), 10);
//       if (Number.isFinite(plain)) return Math.max(0, plain);
//       // ISO-ish fallback: try PT#M / PT#H#M
//       const isoHM = s.match(/PT(?:(\d+)H)?(?:(\d+)M)?/i);
//       if (isoHM) {
//         const h = Number(isoHM[1] || 0);
//         const m = Number(isoHM[2] || 0);
//         return h * 60 + m;
//       }
//       return 0;
//     }

//     // Object -> check known fields
//     if (typeof v === "object") {
//       // nested duration: { duration: { hours, minutes } }
//       if (v.duration) return parseDuration(v.duration);

//       if ("totalMinutes" in v && Number.isFinite(Number(v.totalMinutes))) {
//         return Math.max(0, Math.floor(Number(v.totalMinutes)));
//       }
//       if ("minutes" in v && "hours" in v) {
//         const hrs = Number(v.hours) || 0;
//         const mins = Number(v.minutes) || 0;
//         return Math.max(0, Math.floor(hrs * 60 + mins));
//       }
//       if ("hours" in v || "mins" in v || "min" in v) {
//         const hrs = Number(v.hours) || 0;
//         const mins = Number(v.minutes || v.mins || v.min) || 0;
//         return Math.max(0, Math.floor(hrs * 60 + mins));
//       }
//       if ("minutes" in v) {
//         return Math.max(0, Math.floor(Number(v.minutes) || 0));
//       }
//       // sometimes backend may send { length: 80 } or { durationMin: 80 }
//       if ("durationMin" in v && Number.isFinite(Number(v.durationMin))) {
//         return Math.max(0, Math.floor(Number(v.durationMin)));
//       }
//       if ("length" in v && Number.isFinite(Number(v.length))) {
//         return Math.max(0, Math.floor(Number(v.length)));
//       }
//     }

//     return 0;
//   };

//   // Format minutes into consistent string like "1h 20m" or "45m"
//   const formatMinutes = (mins) => {
//     const m = Math.max(0, Math.floor(Number(mins) || 0));
//     const h = Math.floor(m / 60);
//     const rem = m % 60;
//     if (h === 0) return `${rem}m`;
//     if (rem === 0) return `${h}h`;
//     return `${h}h ${rem}m`;
//   };

    

//     return(
//         <div>
//             </div>
//     )
// }

// export default ListPage