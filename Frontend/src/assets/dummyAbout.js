import { Users, BookOpen, Award, Globe, GraduationCap, Clock, Target, Eye, Heart } from "lucide-react";

// Counter targets for stats
export const counterTargets = {
  students: 75000,
  courses: 3200,
  successRate: 97,
  countries: 180,
  certificates: 1200000,
  support: 24,
};

// Stats metadata with icons and colors
export const statsMeta = [
  {
    key: "students",
    label: "Active Students",
    icon: Users,
    color: "from-indigo-500 to-blue-500",
    bgColor: "bg-gradient-to-br from-indigo-50 to-blue-50",
  },
  {
    key: "courses",
    label: "Courses",
    icon: BookOpen,
    color: "from-pink-500 to-purple-500",
    bgColor: "bg-gradient-to-br from-pink-50 to-purple-50",
  },
  {
    key: "successRate",
    label: "Success Rate",
    icon: Award,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
  },
  {
    key: "countries",
    label: "Countries",
    icon: Globe,
    color: "from-orange-500 to-red-500",
    bgColor: "bg-gradient-to-br from-orange-50 to-red-50",
  },
  {
    key: "certificates",
    label: "Certificates",
    icon: GraduationCap,
    color: "from-teal-500 to-cyan-500",
    bgColor: "bg-gradient-to-br from-teal-50 to-cyan-50",
  },
  {
    key: "support",
    label: "Support",
    icon: Clock,
    color: "from-yellow-500 to-orange-500",
    bgColor: "bg-gradient-to-br from-yellow-50 to-orange-50",
  },
];

// Mission, Vision, Values with dotLottie and position hints
export const missionVisionValues = [
  {
    type: "mission",
    icon: Target,
    title: "Our Mission",
    subtitle: "Empower Learners Worldwide",
    description:
      "We aim to create a platform where learners everywhere can acquire knowledge, skills, and confidence to succeed in life and career.",
    dotLottie: "https://lottie.host/d4aed205-8352-4490-a20a-83e4b3b3e2f6/f3nl34gaEN.lottie",
    features: [
      "Accessible education for everyone",
      "Affordable and flexible learning",
      "Global learning community",
      "Industry-focused courses",
    ],
    color: "from-blue-600 to-cyan-600",
    bgColor: "bg-gradient-to-br from-blue-50 to-cyan-100",
  },
  {
    type: "vision",
    icon: Eye,
    title: "Our Vision",
    subtitle: "Shaping Future Innovators",
    description:
      "To be the most trusted global education platform enabling people to unlock their potential and make a positive impact in the world.",
    dotLottie: "https://lottie.host/591f8a0f-faba-495a-9a38-ff1bf44b5fad/W30zLs2vep.lottie",
    features: [
      "Lifelong learning mindset",
      "Future-ready skills",
      "Global community impact",
      "Innovation-driven approach",
    ],
    color: "from-purple-600 to-pink-600",
    bgColor: "bg-gradient-to-br from-purple-50 to-pink-100",
  },
  {
    type: "values",
    icon: Heart,
    title: "Our Values",
    subtitle: "Guiding Principles",
    description:
      "We are committed to integrity, innovation, and excellence, placing our students and community at the heart of every decision.",
    dotLottie: "https://lottie.host/4cf976d2-0a1a-4017-b021-c3fe2b0a4c18/ksM0OM58Dd.lottie",
    features: [
      "Student success first",
      "Excellence in teaching",
      "Innovation & creativity",
      "Collaboration & community",
    ],
    color: "from-green-600 to-emerald-600",
    bgColor: "bg-gradient-to-br from-green-50 to-emerald-100",
  },
];

// Values with features
export const values = [
  {
    title: "Quality Education",
    description:
      "We provide carefully curated courses by experts to ensure learners gain real-world skills.",
    features: ["Expert Instructors", "Updated Curriculum", "Industry Relevance"],
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Learner First",
    description:
      "All our decisions focus on enhancing the learner’s journey and success.",
    features: ["Personalized Experience", "Career Support", "Community Building"],
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Continuous Creation",
    description:
      "We continuously integrate new learning technologies to keep our platform ahead.",
    features: ["AI-driven Learning", "Interactive Labs", "Mobile-First Design"],
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Lifetime Learning",
    description:
      "Learners get lifelong access to all courses and updates for continuous growth.",
    features: ["Forever Access", "Free Updates", "Progress Tracking"],
    color: "from-orange-500 to-amber-500",
  },
];

// Default export
export default {
  counterTargets,
  statsMeta,
  missionVisionValues,
  values,
};
