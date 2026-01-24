import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, BookOpen, GraduationCap, Users, Award } from 'lucide-react';
import api from '../../api/axios.js';

const Login = () => {
  // State for password visibility toggle
  const [showPassword, setShowPassword] = useState(false);
  
  // State for loading during API call
  const [loading, setLoading] = useState(false);
  
  // State for form data
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  // Handle Login submission

  const handleLogin = async () => {
    setLoading(true);

    try {
      const res = await api.post("/auth/signin", loginData);
 console.log(res.data.token)
    localStorage.setItem("token", res.data.token);
    alert(res.data.message || "Login successful!");

    } catch (error) {

      // Handle network or server errors
      alert(error.response?.data?.message);
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        {/* Floating circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full opacity-10 blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300 rounded-full opacity-10 blur-3xl animate-float-delay"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center text-white relative z-10 px-12">
        <div className="max-w-md">

          {/* Logo and Title */}
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-white p-3 rounded-xl">
              <BookOpen className="w-10 h-10 text-blue-900" />
            </div>
            <h1 className="text-5xl font-bold">Academia</h1>
          </div>

          {/* Tagline */}
          <p className="text-2xl mb-12 text-blue-100">
            Empowering Learning, One Course at a Time
          </p>

          {/* Features List */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-800 p-3 rounded-lg">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Expert-Led Courses</h3>
                <p className="text-blue-200">Learn from industry professionals</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-800 p-3 rounded-lg">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Collaborative Learning</h3>
                <p className="text-blue-200">Connect with fellow learners</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-800 p-3 rounded-lg">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Earn Certificates</h3>
                <p className="text-blue-200">Get recognized for your achievements</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 lg:p-10 animate-fadeIn">

          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-6">
            <div className="bg-blue-900 p-3 rounded-full">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Form Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to continue to Academia</p>
          </div>

          {/* Login Form */}
          <div className="space-y-5">

            {/* Username Input */}
            <div className="relative group">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-blue-900 transition-colors" />
              <input
                type="text"
                placeholder="Username"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-900 focus:outline-none transition-all"
              />
            </div>

            {/* Password Input */}
            <div className="relative group">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-blue-900 transition-colors" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full pl-11 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-900 focus:outline-none transition-all"
              />
              {/* Toggle password visibility */}
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-blue-900 transition-colors"
              >
                {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <a
                href="/forgot-password"
                className="text-sm text-blue-900 hover:underline transition-all"
              >
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">New to Academia?</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-gray-600">
            <a
              href="/signup"
              className="text-blue-900 font-semibold hover:underline transition-all"
            >
              Create an account
            </a>
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