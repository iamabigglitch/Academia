export const dashboardStyles = {
  // Layout styles
  pageContainer: "min-h-screen pt-25 bg-gradient-to-br from-gray-50 to-gray-100 font-serif relative",
  backgroundPattern: "absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(28,57,142,0.03)_25%,rgba(28,57,142,0.03)_50%,transparent_50%,transparent_75%,rgba(28,57,142,0.03)_75%)] bg-[length:10px_10px] opacity-20",
  contentContainer: "relative z-10 container mx-auto px-4 sm:px-6 lg:px-12 py-10",

  // Header styles
  headerContainer: "mb-8 text-center sm:text-left animate-fade-in",
  headerTitle: "text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#1c398e] to-[#2d4db5] bg-clip-text text-transparent mb-2 tracking-tight",
  headerSubtitle: "text-gray-600 text-base sm:text-lg",

  // Error Banner
  errorBanner: "bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 shadow-sm",

  // Stats section
  statsGrid: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10",
  statCard: "bg-white border border-gray-200 rounded-2xl md:p-4 lg:p-6 xl:p-6 shadow-lg p-4 sm:p-6 transform transition-all duration-300 hover:shadow-xl hover:scale-105 animate-slide-up",
  statTitle: "text-gray-600 text-sm sm:text-base font-medium mb-2",
  statValue: "text-2xl sm:text-3xl font-bold text-gray-800",
  statIconContainer: (color) => {
    const colorMap = {
      indigo: "bg-gradient-to-br from-[#1c398e] to-[#2d4db5]",
      green: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      yellow: "bg-gradient-to-br from-amber-500 to-amber-600",
      purple: "bg-gradient-to-br from-purple-500 to-purple-600",
    };
    return `${colorMap[color] || colorMap.indigo} p-3 rounded-xl text-white shadow-md`;
  },
  statIcon: "w-5 h-5 sm:w-6 sm:h-6",

  // Courses section
  coursesContainer: "bg-white rounded-2xl shadow-lg overflow-hidden animate-fade-in border border-gray-200",
  coursesHeader: "px-4 sm:px-6 py-5 bg-gradient-to-r from-[#1c398e]/5 to-transparent border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4",
  coursesTitleContainer: "flex items-center gap-3",
  coursesIcon: "w-6 h-6 text-[#1c398e]",
  coursesTitle: "text-xl sm:text-2xl font-bold text-[#1c398e]",

  // Search bar
  searchContainer: "relative w-full sm:w-auto",
  searchIcon: "w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2",
  searchInput: "pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c398e]/50 focus:border-[#1c398e] w-full sm:w-64 transition-all",

  // Table styles
  tableContainer: "overflow-x-auto",
  table: "min-w-full",
  tableHead: "bg-[#1c398e]/5",
  tableHeader: "px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-[#1c398e] uppercase tracking-wider",
  tableBody: "divide-y divide-gray-200",
  tableRow: "hover:bg-[#1c398e]/5 transition-colors duration-200 animate-fade-in",

  // Course item styles
  courseImage: "w-10 h-8 sm:w-12 sm:h-10 rounded-lg object-cover mr-3 sm:mr-4 shadow-sm border border-gray-200",
  courseName: "font-semibold px-3 md:px-0 lg:px-0 xl:px-0 text-gray-900 text-sm sm:text-base hover:text-[#1c398e] transition-colors",
  courseInstructor: "text-xs px-3 md:px-0 lg:px-0 xl:px-0 sm:text-sm text-gray-500",
  studentsCell: "px-9 sm:px-6 py-3 sm:py-4",
  studentsText: "font-medium text-sm sm:text-base text-gray-700",
  priceCell: "px-4 sm:px-6 py-3 sm:py-4 text-gray-900 font-semibold text-sm sm:text-base",
  purchasesContainer: "flex items-center text-gray-700",
  purchasesIcon: "w-4 h-4 mr-2 text-[#1c398e]",
  purchasesText: "text-sm sm:text-base font-medium",
  earningsCell: "px-4 sm:px-6 py-3 sm:py-4 text-[#1c398e] font-bold text-sm sm:text-base",

  // Empty state
  emptyState: "text-center py-16",
  emptyIcon: "w-16 h-16 text-gray-300 mx-auto mb-4",
  emptyText: "text-gray-500 text-base sm:text-lg mb-4",
  clearButton: "mt-2 px-6 py-2 bg-[#1c398e] text-white rounded-lg hover:bg-[#0f2764] transition-all font-medium shadow-md hover:shadow-lg",

  // Loading overlay
  loadingOverlay: "absolute inset-0 bg-white/90 flex items-center justify-center backdrop-blur-sm z-50",
  loadingSpinner: "w-12 h-12 border-4 border-[#1c398e]/20 border-t-[#1c398e] rounded-full animate-spin",
};


export const listStyles = {
  courseList: "flex flex-col gap-4",

  courseCard:
    "bg-white rounded-xl border border-gray-200 shadow-sm " +
    "hover:shadow-md transition-shadow duration-300 overflow-hidden",
  courseCardContent: "w-full",

  courseHeader:
    "flex flex-col sm:flex-row",

  courseImageContainer:
    "flex flex-col sm:flex-row flex-1 min-w-0",
  courseImage:
    "w-full sm:w-90 h-44 sm:h-auto sm:min-h-[160px] object-cover flex-shrink-0 " +
    "border-r-0 sm:border-r border-b sm:border-b-0 border-gray-100",

  courseInfo:
    "flex-1 min-w-0 flex flex-col justify-between p-4 sm:p-5",
  courseTitleRow:
    "flex items-start justify-between gap-3",
  courseTitle:
    "text-base sm:text-lg font-semibold text-gray-900 leading-snug truncate",
  courseInstructor:
    "text-sm text-gray-500 mt-0.5 font-medium",

  courseMeta:
    "flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3",
  metaItem:
    "flex items-center gap-1.5 text-sm text-gray-500",
  metaIcon:
    "w-4 h-4 text-gray-400",

  courseActions:
    "flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-between " +
    "gap-3 px-4 py-3 sm:px-5 sm:py-4 " +
    "border-t sm:border-t-0 sm:border-l border-gray-100 bg-gray-50/50 sm:bg-transparent sm:bg-opacity-0",

  priceContainer: "flex items-center",
  priceFree:
    "inline-block bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200",
  priceRegular:
    "text-sm font-bold text-gray-900",
  originalPrice:
    "text-xs text-gray-400 line-through ml-1.5",

  actionButtons:
    "flex items-center gap-2",
  toggleButton:
    "w-8 h-8 rounded-lg border border-gray-200 bg-white " +
    "flex items-center justify-center text-gray-500 " +
    "hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 " +
    "transition-colors duration-200",
  deleteButton:
    "w-8 h-8 rounded-lg border border-gray-200 bg-white " +
    "flex items-center justify-center text-gray-400 " +
    "hover:border-red-300 hover:text-red-600 hover:bg-red-50 " +
    "transition-colors duration-200",
  actionIcon:
    "w-4 h-4",

  starRating: "flex items-center gap-0.5",
  starFull:   "w-4 h-4 text-amber-400",
  starEmpty:  "w-4 h-4 text-gray-300",

  courseBadge: (type) =>
    type === "top"
      ? "inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full " +
        "bg-amber-50 text-amber-700 border border-amber-200"
      : "inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full " +
        "bg-slate-100 text-slate-600 border border-slate-200",

  expandedCourse:
    "border-t border-gray-100 bg-gray-50/40 px-4 sm:px-5 py-4 " +
    "flex flex-col gap-5",

  descriptionSection: "flex flex-col gap-1.5",
  descriptionTitle:
    "text-xs font-bold uppercase tracking-wider text-gray-400 select-none",
  descriptionText:
    "text-sm text-gray-600 leading-relaxed",

 
  contentSection:
    "flex flex-col gap-2",

  lectureCard:
    "bg-white rounded-lg border border-gray-200 overflow-hidden " +
    "transition-shadow duration-200 hover:shadow-sm",
  lectureHeader: "w-full",
  lectureToggleButton:
    "w-full flex items-center justify-between px-3.5 py-3 text-left " +
    "hover:bg-gray-50 transition-colors duration-150",
  lectureInfo:
    "flex items-start gap-3 flex-1 min-w-0",
  lectureTitle:
    "text-sm font-semibold text-gray-800 leading-snug truncate",
  lectureMeta:
    "flex flex-wrap items-center gap-x-3 gap-y-1 mt-1",

  lectureToggleIcon: (isExpanded) =>
    "w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-300 " +
    (isExpanded ? "rotate-180" : "rotate-0"),

  expandedLecture:
    "border-t border-gray-100",
  chapterList:
    "flex flex-col divide-y divide-gray-100",

  // single chapter row
  chapterCard:
    "hover:bg-indigo-50/40 transition-colors duration-150",
  chapterContent: "w-full",
  chapterHeader:
    "flex items-start gap-3 px-4 py-2.5",

  // play-icon circle
  chapterIcon:
    "flex-shrink-0 w-7 h-7 mt-0.5 rounded-full bg-indigo-100 " +
    "flex items-center justify-center",
  chapterIconSvg:
    "w-3.5 h-3.5 text-indigo-600",

  // text block next to icon
  chapterDetails:
    "flex-1 min-w-0 flex flex-col gap-0.5",
  chapterTitle:
    "text-sm font-semibold text-indigo-700 hover:text-indigo-900 " +
    "hover:underline transition-colors duration-150 truncate",
  chapterTopic:
    "text-xs text-gray-500 truncate",
  chapterMeta:
    "flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5",
  chapterDuration:
    "flex items-center gap-1 text-xs text-gray-400",
  chapterVideoLink:
    "text-xs text-indigo-400 hover:text-indigo-600 truncate " +
    "transition-colors duration-150",

  emptyState:
    "flex flex-col items-center justify-center py-16 px-4 " +
    "bg-white rounded-xl border border-gray-200 shadow-sm",
  emptyIcon:
    "w-10 h-10 text-gray-300 mb-3",
  emptyText:
    "text-sm text-gray-500 font-medium text-center",
  clearButton:
    "mt-4 px-5 py-2 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-700 " +
    "hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200 shadow-sm",
};

export const addPageStyles = {
  // Layout styles
  pageContainer: "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30 py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6",
  contentContainer: "max-w-4xl pt-30 font-serif mx-auto",

  // Header styles
  headerContainer: "text-center mb-8 sm:mb-10 lg:mb-12",
  headerGradient: "relative inline-block",
  headerGlow: "absolute -inset-2 sm:-inset-3 lg:-inset-4 bg-gradient-to-r from-[#1c398e] to-[#2d4db5] rounded-2xl blur-lg opacity-20",
  headerTitle: "relative text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#1c398e] to-[#2d4db5] bg-clip-text text-transparent mb-3 sm:mb-4",
  headerSubtitle: "text-base sm:text-lg lg:text-xl text-gray-600 font-light max-w-2xl mx-auto px-2",

  // Form styles
  form: "space-y-6 sm:space-y-8",

  // Card styles
  card: "bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/50 shadow-xl sm:shadow-2xl",
  courseTypeCard: "shadow-[#1c398e]/10",
  courseInfoCard: "shadow-[#1c398e]/10", 
  lecturesCard: "shadow-purple-100/50",

  // Card header styles
  cardHeader: "flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8",
  cardIconContainer: "p-2 sm:p-3 bg-gradient-to-br from-[#1c398e] to-[#2d4db5] rounded-full shadow-lg",
  cardIcon: "text-white",
  cardTitle: "text-xl sm:text-2xl font-bold text-[#1c398e]",
  cardSubtitle: "text-sm sm:text-base text-gray-600",

  // Course type selection
  courseTypeGrid: "grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6",
  courseTypeLabel: (isSelected, type) => 
    `flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border-2 rounded-full cursor-pointer transition-all duration-300 ${
      isSelected
        ? type === 'top' 
          ? "border-orange-500 bg-orange-50 shadow-md shadow-orange-500/20"
          : "border-[#1c398e] bg-[#1c398e]/5 shadow-md shadow-[#1c398e]/20"
        : "border-gray-200 hover:border-gray-300"
    }`,
  courseTypeInput: "w-4 h-4 sm:w-5 sm:h-5",
  courseTypeText: "text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2",

  // Form grid
  formGrid: "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6",
  formFullWidth: "lg:col-span-2",

  // Input styles
  inputContainer: "space-y-2",
  inputLabel: "text-gray-700 font-semibold flex items-center gap-2 text-sm sm:text-base",
  inputIcon: "text-[#1c398e]",
  input: "w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border-2 border-gray-200 rounded-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1c398e]/50 focus:border-[#1c398e] transition-all duration-300 shadow-sm text-sm sm:text-base",
  textarea: "w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1c398e]/50 focus:border-[#1c398e] transition-all duration-300 shadow-sm resize-none text-sm sm:text-base",

  // Duration grid
  durationGrid: "grid grid-cols-2 gap-2 sm:gap-3",
  durationHelper: "text-xs text-gray-500 mt-1 block",
  durationFormatted: "text-sm text-[#1c398e] font-medium",

  // Star rating
  starRating: "flex gap-1",
  starButton: "text-2xl transition-colors duration-200 focus:outline-none hover:scale-110 transform",
  starFull: "text-yellow-400 fill-current",
  starEmpty: "text-gray-300 hover:text-yellow-400",

  // File upload
  uploadContainer: "flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4",
  uploadLabel: "flex-1 w-full cursor-pointer group",
  uploadInput: "hidden",
  uploadBox: "w-full px-3 sm:px-4 py-3 sm:py-4 bg-gradient-to-br from-white to-gray-50 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1c398e]/50 focus:border-[#1c398e] transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 group-hover:border-[#1c398e] group-hover:bg-[#1c398e]/5 group-hover:text-[#1c398e] shadow-sm text-sm sm:text-base",
  uploadIcon: "transition-transform group-hover:scale-110",
  imagePreview: "w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-white shadow-lg ring-2 ring-[#1c398e]/20 flex-shrink-0",

  // Select input
  select: "w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border-2 border-gray-200 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1c398e]/50 focus:border-[#1c398e] transition-all duration-300 shadow-sm appearance-none bg-gradient-to-b from-white to-gray-50 text-sm sm:text-base",

  // Lectures header
  lecturesHeader: "flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8",
  addLectureButton: "bg-gradient-to-r from-[#1c398e] to-[#2d4db5] cursor-pointer hover:shadow-xl text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 transform shadow-lg hover:scale-105 text-sm sm:text-base w-full sm:w-auto justify-center",

  // Lectures list
  lecturesList: "space-y-3 sm:space-y-4",
  lectureCard: "bg-gradient-to-br from-white to-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300",
  lectureHeader: "flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4",
  lectureContent: "flex items-center gap-3 sm:gap-4 flex-1",
  lectureToggleButton: "p-2 bg-[#1c398e]/10 text-[#1c398e] rounded-full hover:bg-[#1c398e] hover:text-white cursor-pointer transition-all duration-200 flex-shrink-0",
  lectureInfo: "flex-1 min-w-0",
  lectureTitle: "text-lg sm:text-xl font-bold text-gray-800 break-words",
  lectureMeta: "text-gray-600 flex items-center gap-2 mt-1 text-sm sm:text-base",
  lectureActions: "flex items-center gap-2 justify-end sm:justify-start",
  addChapterButton: "bg-gradient-to-r from-[#1c398e] to-[#2d4db5] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg hover:scale-105 text-xs sm:text-sm",
  deleteButton: "p-1.5 sm:p-2 text-red-400 hover:text-red-600 cursor-pointer hover:bg-red-50 rounded-full transition-colors duration-200 ml-1 sm:ml-2",

  // Chapters list
  chaptersContainer: (isExpanded) => 
    `ml-0 sm:ml-10 lg:ml-12 space-y-2 sm:space-y-3 border-l-0 sm:border-l-2 border-[#1c398e]/20 pl-0 sm:pl-4 lg:pl-6 mt-3 sm:mt-0 ${
      isExpanded ? 'block' : 'hidden'
    }`,
  chapterCard: "bg-gradient-to-r from-[#1c398e]/5 to-purple-50/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-[#1c398e]/10 shadow-sm hover:shadow-md transition-all",
  chapterContent: "flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0",
  chapterInfo: "flex-1 min-w-0",
  chapterTitle: "text-gray-800 font-semibold text-sm sm:text-base break-words",
  chapterTopic: "text-gray-600 text-xs sm:text-sm mt-1 break-words",
  chapterMeta: "flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2",
  chapterDuration: "text-[#1c398e] text-xs sm:text-sm flex items-center gap-1 font-medium",
  chapterUrl: "text-[#2d4db5] text-xs sm:text-sm font-medium break-all max-w-full sm:max-w-xs hover:underline",
  chapterDeleteButton: "p-1 text-red-400 hover:text-red-600 cursor-pointer hover:bg-red-50 rounded-full transition-colors duration-200 ml-0 sm:ml-4 self-end sm:self-auto mt-2 sm:mt-0",

  // Submit button
  submitContainer: "text-center",
  submitButton: "bg-gradient-to-r from-[#1c398e] to-[#2d4db5] cursor-pointer hover:from-[#0f2764] hover:to-[#1c398e] text-white px-8 sm:px-12 lg:px-16 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg transition-all duration-300 transform shadow-2xl hover:shadow-3xl hover:scale-105 relative overflow-hidden group w-full sm:w-auto",

  // Modal styles
  modalOverlay: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50",
  modal: "bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 max-w-md w-full border border-white/50 shadow-2xl mx-2",
  modalHeader: "flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6",
  modalIconContainer: (color) => `p-2 ${color} rounded-full`,
  modalTitle: "text-xl sm:text-2xl font-bold text-[#1c398e]",
  modalContent: "space-y-3 sm:space-y-4",
  modalActions: "flex gap-2 sm:gap-3 pt-3 sm:pt-4",
  modalButton: "flex-1 py-2 sm:py-3 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base",
  modalButtonPrimary: "bg-gradient-to-r from-[#1c398e] to-[#2d4db5] cursor-pointer hover:shadow-xl hover:scale-105 text-white",
  modalButtonSecondary: "bg-gray-200 hover:bg-gray-300 text-gray-700 cursor-pointer",
  modalButtonCompact: "flex-1 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base",
  modalButtonCompactPrimary: "bg-gradient-to-r from-[#1c398e] to-[#2d4db5] hover:from-[#0f2764] hover:to-[#1c398e] text-white shadow-lg hover:scale-105 cursor-pointer",
  modalButtonCompactSecondary: "bg-gray-200 hover:bg-gray-300 text-gray-700 cursor-pointer",

  // Chapters list in modal
  chaptersList: "space-y-2 max-h-24 sm:max-h-32 overflow-y-auto",
  chapterPreview: "bg-[#1c398e]/5 rounded-lg p-2 sm:p-3 text-xs sm:text-sm border border-[#1c398e]/20",
  chapterPreviewTitle: "font-medium text-gray-800",
  chapterPreviewDuration: "text-[#1c398e] text-xs font-semibold"
};

export const navbarStyles = {
  // Main navbar styles
  nav: (isVisible) => 
    `fixed top-6 left-0 right-0 z-50 pointer-events-auto transition-transform duration-500 ease-in-out ${
      isVisible ? "translate-y-0" : "-translate-y-24"
    }`,
  navContainer: "w-full flex justify-center",
  navInner: (isMenuOpen) => 
    `relative w-[90%] rounded-xl xl:rounded-full md:rounded-full sm:w-[90%] md:w-[95%] lg:w-[70%] xl:w-[90%] max-w-6xl mx-auto lg:rounded-full px-4 py-1 md:py-3 lg:py-3 xl:py-3 sm:py-3 backdrop-blur-md bg-white/60 border border-white/30 shadow-xl shadow-sky-600/8 transition-all duration-500`,

  // Glow effect
  glowEffect: "pointer-events-none absolute -inset-1 rounded-3xl blur-[18px] opacity-30 bg-gradient-to-r from-blue-400 to-cyan-300 mix-blend-screen",

  // Navbar content
  navbarContent: "flex items-center justify-between gap-4 relative z-10",

  // Logo section
  logoContainer: "flex items-center gap-3 select-none",
  logoImage: "w-12 h-12 object-contain",
  logoText: "text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-700 to-cyan-600",

  // Desktop navigation
  desktopNav: "hidden md:flex items-center justify-center flex-1",
  desktopNavInner: "inline-flex items-center gap-2 bg-white/40 backdrop-blur-sm rounded-full p-1 shadow-sm",
  desktopNavItem: (isActive) => 
    `relative flex items-center gap-2 cursor-pointer px-4 py-2 rounded-full font-medium transition-all duration-300 transform group overflow-hidden ${
      isActive
        ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg'
        : 'text-slate-700 hover:text-sky-700'
    }`,
  desktopNavIcon: "w-4 h-4",
  desktopNavText: "text-sm",
  desktopActiveGlow: "absolute -inset-px rounded-full pointer-events-none blur-sm opacity-80 bg-gradient-to-r from-blue-400 to-cyan-300 mix-blend-screen",

  // Mobile menu toggle
  mobileToggleContainer: "flex items-center gap-3 md:hidden",
  mobileToggleButton: "w-10 h-10 rounded-xl bg-white/60 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-sm",
  mobileToggleIcon: "w-5 h-5 text-slate-700",

  // Mobile menu
  mobileMenu: (isMenuOpen) => 
    `md:hidden mt-3 transition-[max-height,opacity,padding] duration-350 ease-in-out overflow-hidden ${
      isMenuOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
    }`,
  mobileMenuInner: "flex flex-col gap-2",
  mobileMenuItem: (isActive) => 
    `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
      isActive
        ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow'
        : 'bg-white/60 hover:bg-white/80 text-slate-700'
    }`,
  mobileMenuIcon: "w-5 h-5",
  mobileMenuText: "font-medium"
};

export const bookingsStyles = {
  // Layout styles
  pageContainer: "min-h-screen pt-35 bg-sky-50 font-serif p-6",
  contentContainer: "max-w-6xl mx-auto",

  // Header styles
  headerContainer: "mb-8",
  headerTitle: "text-3xl font-bold text-sky-500 mb-2",
  headerSubtitle: "text-sky-700",

  // Search styles
  searchContainer: "p-4 mb-8",
  searchInputContainer: "relative max-w-md",
  searchIcon: "absolute left-3 top-1/2 -translate-y-1/2 text-sky-500 h-5 w-5",
  searchInput: "w-full pl-10 pr-4 py-2 border border-sky-300 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 bg-sky-50 text-sky-900",

  // Bookings grid
  bookingsGrid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",

  // Booking card
  bookingCard: "bg-white rounded-xl shadow-sm border border-sky-200 p-6 hover:shadow-md transition",

  // Student section
  studentSection: "flex items-center mb-4",
  studentIconContainer: "bg-sky-100 p-2 rounded-full",
  studentIcon: "h-6 w-6 text-sky-600",
  studentInfo: "ml-3",
  studentName: "font-semibold text-sky-900 text-lg",
  purchaseDate: "text-sm text-sky-600",

  // Course details
  courseDetails: "space-y-3",
  detailItem: "flex items-center",
  detailIcon: "h-4 w-4 text-sky-500 mr-2",
  detailLabel: "text-sky-800 font-medium",
  detailValue: "ml-2 text-sky-900 truncate",
  priceValue: "ml-2 text-green-600 font-semibold",

  // Status
  statusContainer: "mt-4 pt-4 border-t border-sky-100",
  statusBadge: "inline-flex px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800",

  // Empty state
  emptyState: "text-center py-12",
  emptyContainer: "bg-white rounded-lg p-8 max-w-md mx-auto",
  emptyIcon: "h-12 w-12 text-sky-400 mx-auto mb-4",
  emptyTitle: "text-lg font-semibold text-sky-900 mb-2",
  emptyText: "text-sky-600"
};