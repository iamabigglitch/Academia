import React, { useState } from "react";
import { Eye, EyeOff, User, Mail, Phone, Lock, BookOpen, Sparkles, Globe, Clock } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import api from "../../api/axios.js";

const Signup = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
    number: "",
  });

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!signupData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (signupData.username.length > 50) {
      newErrors.username = 'Username too long';
    }
    
    if (!signupData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!signupData.number.trim()) {
      newErrors.number = 'Phone number is required';
    } else if (signupData.number.length < 10) {
      newErrors.number = 'Number must be 10 digits';
    } else if (!/^\d+$/.test(signupData.number)) {
      newErrors.number = 'Number must contain only digits';
    }
    
    if (!signupData.password) {
      newErrors.password = 'Password is required';
    } else if (signupData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e?.preventDefault?.();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/signup", signupData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success(res.data.message || "Account created successfully!");
      navigate("/courses");
    } catch (error) {
      const msg = error.response?.data?.message || "Signup failed. Please try again.";
      toast.error(msg);
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-950 flex items-center justify-center p-4 pt-16 sm:pt-18 relative overflow-hidden">
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />

      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-20 w-64 h-64 bg-purple-400 rounded-full opacity-10 blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-32 right-16 w-80 h-80 bg-blue-400 rounded-full opacity-10 blur-3xl animate-pulse-slower"></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-indigo-400 rounded-full opacity-10 blur-3xl animate-float"></div>
        <div className="absolute inset-0 bg-dots-pattern opacity-10"></div>
      </div>

      {/* Left Side - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative z-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 w-full max-w-md p-5 sm:p-6 animate-slideIn">
          <div className="lg:hidden flex justify-center mb-3">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-3 rounded-2xl shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="text-center mb-5">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Join Academia</h2>
            <p className="text-gray-600 text-sm">Start your learning journey today</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-3">
            <div>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Username"
                  value={signupData.username}
                  onChange={(e) => {
                    setSignupData({ ...signupData, username: e.target.value });
                    if (errors.username) setErrors({ ...errors, username: '' });
                  }}
                  className={`w-full pl-12 pr-4 py-2.5 border-2 ${
                    errors.username ? 'border-red-500' : 'border-gray-200'
                  } rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all text-gray-900 placeholder-gray-400`}
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.username}</p>
              )}
            </div>

            <div>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={signupData.email}
                  onChange={(e) => {
                    setSignupData({ ...signupData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  className={`w-full pl-12 pr-4 py-2.5 border-2 ${
                    errors.email ? 'border-red-500' : 'border-gray-200'
                  } rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all text-gray-900 placeholder-gray-400`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={signupData.number}
                  onChange={(e) => {
                    setSignupData({ ...signupData, number: e.target.value });
                    if (errors.number) setErrors({ ...errors, number: '' });
                  }}
                  className={`w-full pl-12 pr-4 py-2.5 border-2 ${
                    errors.number ? 'border-red-500' : 'border-gray-200'
                  } rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all text-gray-900 placeholder-gray-400`}
                />
              </div>
              {errors.number && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.number}</p>
              )}
            </div>

            <div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={signupData.password}
                  onChange={(e) => {
                    setSignupData({ ...signupData, password: e.target.value });
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  className={`w-full pl-12 pr-12 py-2.5 border-2 ${
                    errors.password ? 'border-red-500' : 'border-gray-200'
                  } rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all text-gray-900 placeholder-gray-400`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <span className="relative flex justify-center">
              <span className="bg-white px-3 text-sm text-gray-500">Already have an account?</span>
            </span>
          </div>

          <p className="text-center text-gray-600 text-sm">
            <Link
              to="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-all"
            >
              Sign in instead
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Benefits */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center text-white relative z-10 px-8">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/20 shadow-xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl xl:text-4xl font-bold tracking-tight">Academia</h1>
          </div>
          <h3 className="text-lg xl:text-xl font-semibold mb-6 text-blue-100/90">
            Why join Academia?
          </h3>
          <div className="space-y-5">
            <div className="flex items-start gap-3 group">
              <div className="bg-indigo-500/80 p-2.5 rounded-xl shrink-0 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-base">Unlimited Access</h4>
                <p className="text-blue-200/90 text-sm">Access thousands of courses anytime</p>
              </div>
            </div>
            <div className="flex items-start gap-3 group">
              <div className="bg-indigo-500/80 p-2.5 rounded-xl shrink-0 group-hover:scale-105 transition-transform">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-base">Learn Anywhere</h4>
                <p className="text-blue-200/90 text-sm">Study on any device, at your own pace</p>
              </div>
            </div>
            <div className="flex items-start gap-3 group">
              <div className="bg-indigo-500/80 p-2.5 rounded-xl shrink-0 group-hover:scale-105 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-base">Flexible Schedule</h4>
                <p className="text-blue-200/90 text-sm">Learn at times that work for you</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes pulse-slow {
          0%,100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.15; transform: scale(1.05); }
        }
        @keyframes pulse-slower {
          0%,100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.1); }
        }
        .animate-slideIn { animation: slideIn 0.6s ease-out; }
        .animate-float { animation: float 7s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-pulse-slower { animation: pulse-slower 6s ease-in-out infinite; }
        .bg-dots-pattern {
          background-image: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 30px 30px;
        }
      `}
      </style>
    </div>
  );
};

export default Signup;