import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, BookOpen, GraduationCap, Users, Award } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import api from '../../api/axios.js';

const Login = () => {
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!loginData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (loginData.username.length > 50) {
      newErrors.username = 'Username too long';
    }
    
    if (!loginData.password) {
      newErrors.password = 'Password is required';
    } else if (loginData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/signin", loginData);
      console.log(res.data.token);
      console.log('User role:', res.data);
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success(res.data.message || "Login successful!");
      console.log(res.data.user.role)
      if (res.data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/courses');
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed. Please try again.";
      toast.error(msg);
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950 flex items-center justify-center p-4 relative overflow-hidden">
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />

      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full opacity-10 blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300 rounded-full opacity-10 blur-3xl animate-float-delay"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center text-white relative z-10 px-8">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/20 shadow-xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl xl:text-4xl font-bold tracking-tight">Academia</h1>
          </div>
          <p className="text-lg xl:text-xl mb-8 text-blue-100/90">
            Empowering Learning, One Course at a Time
          </p>
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="bg-indigo-500/80 p-2.5 rounded-xl shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-base">Expert-Led Courses</h3>
                <p className="text-blue-200/90 text-sm">Learn from industry professionals</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-indigo-500/80 p-2.5 rounded-xl shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-base">Collaborative Learning</h3>
                <p className="text-blue-200/90 text-sm">Connect with fellow learners</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-indigo-500/80 p-2.5 rounded-xl shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-base">Earn Certificates</h3>
                <p className="text-blue-200/90 text-sm">Get recognized for your achievements</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative z-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 w-full max-w-md p-6 sm:p-8 animate-fadeIn">
          <div className="lg:hidden flex justify-center mb-4">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-2xl shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-600 text-sm">Sign in to continue to Academia</p>
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); handleLogin(); }}
            className="space-y-4"
          >
            <div>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Username"
                  value={loginData.username}
                  onChange={(e) => {
                    setLoginData({ ...loginData, username: e.target.value });
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
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={loginData.password}
                  onChange={(e) => {
                    setLoginData({ ...loginData, password: e.target.value });
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

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline transition-all"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <span className="relative flex justify-center">
              <span className="bg-white px-3 text-sm text-gray-500">New to Academia?</span>
            </span>
          </div>

          <p className="text-center text-gray-600 text-sm">
            <Link
              to="/signup"
              className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-all"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes float-delay {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(20px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delay {
          animation: float-delay 8s ease-in-out infinite;
        }

        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
};

export default Login;