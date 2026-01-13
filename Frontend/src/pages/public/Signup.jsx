import React, { useState } from 'react';
import { Eye, EyeOff, User, Mail, Phone, Lock, BookOpen, Sparkles, Globe, Clock } from 'lucide-react';
import axios from "axios";

const Signup = () => {
  // State for password visibility toggle
  const [showPassword, setShowPassword] = useState(false);
  
  // State for loading during API call
  const [loading, setLoading] = useState(false);
  
  // State for form data
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: '',
    number: ''
  });

  // Handle Signup submission
  const handleSignup = async () => {
    setLoading(true);

    try {
     const res = await axios.post(
        "http://localhost:5000/auth/signup",
    signupData
    );

    localStorage.setItem("token", res.data.token);
    alert(res.data.message || "Account created successfully!");
        } catch (error) {
      // Handle network or server errors
      alert('Error connecting to server');
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        {/* Floating shapes */}
        <div className="absolute top-10 left-20 w-64 h-64 bg-purple-400 rounded-full opacity-10 blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-32 right-16 w-80 h-80 bg-blue-400 rounded-full opacity-10 blur-3xl animate-pulse-slower"></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-indigo-400 rounded-full opacity-10 blur-3xl animate-float"></div>
        
        {/* Dots pattern */}
        <div className="absolute inset-0 bg-dots-pattern opacity-10"></div>
      </div>

      {/* Left Side - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 lg:p-10 animate-slideIn">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-6">
            <div className="bg-blue-900 p-3 rounded-full animate-bounce-slow">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Form Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Join Academia</h2>
            <p className="text-gray-600">Start your learning journey today</p>
          </div>

          {/* Signup Form */}
          <div className="space-y-4">
            
            {/* Username Input */}
            <div className="relative group">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-blue-900 transition-colors" />
              <input
                type="text"
                placeholder="Username"
                value={signupData.username}
                onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-900 focus:outline-none transition-all"
              />
            </div>

            {/* Email Input */}
            <div className="relative group">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-blue-900 transition-colors" />
              <input
                type="email"
                placeholder="Email Address"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-900 focus:outline-none transition-all"
              />
            </div>

            {/* Phone Input */}
            <div className="relative group">
              <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-blue-900 transition-colors" />
              <input
                type="tel"
                placeholder="Phone Number"
                value={signupData.number}
                onChange={(e) => setSignupData({ ...signupData, number: e.target.value })}
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-900 focus:outline-none transition-all"
              />
            </div>

            {/* Password Input */}
            <div className="relative group">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-blue-900 transition-colors" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                className="w-full pl-11 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-900 focus:outline-none transition-all"
              />
              {/* Toggle password visibility */}
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-blue-900 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Password Requirements */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                <strong>Password must contain:</strong>
                <br />• At least 6 characters
                <br />• At least one number
              </p>
            </div>

            {/* Sign Up Button */}
            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Already have an account?</span>
            </div>
          </div>

          {/* Login Link */}
          <p className="text-center text-gray-600">
            <a
              href="/login"
              className="text-blue-900 font-semibold hover:underline transition-all"
            >
              Sign in instead
            </a>
          </p>
        </div>
      </div>

      {/* Right Side - Benefits */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center text-white relative z-10 px-12">
        <div className="max-w-md">
          {/* Logo and Title */}
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-white p-3 rounded-xl animate-bounce-slow">
              <BookOpen className="w-10 h-10 text-blue-900" />
            </div>
            <h1 className="text-5xl font-bold">Academia</h1>
          </div>

          {/* Benefits Heading */}
          <h3 className="text-2xl font-semibold mb-8 text-blue-100">
            Why join Academia?
          </h3>

          {/* Benefits List */}
          <div className="space-y-6">
            <div className="flex items-start gap-4 group">
              <div className="bg-purple-700 p-3 rounded-lg group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Unlimited Access</h4>
                <p className="text-blue-200">Access thousands of courses anytime</p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="bg-purple-700 p-3 rounded-lg group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Learn Anywhere</h4>
                <p className="text-blue-200">Study on any device, at your own pace</p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="bg-purple-700 p-3 rounded-lg group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Flexible Schedule</h4>
                <p className="text-blue-200">Learn at times that work for you</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-blue-700">
            <div className="text-center">
              <p className="text-3xl font-bold">10K+</p>
              <p className="text-sm text-blue-200">Students</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">500+</p>
              <p className="text-sm text-blue-200">Courses</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">98%</p>
              <p className="text-sm text-blue-200">Satisfaction</p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.15;
            transform: scale(1.05);
          }
        }

        @keyframes pulse-slower {
          0%, 100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.2;
            transform: scale(1.1);
          }
        }

        @keyframes bounceSlow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-slideIn {
          animation: slideIn 0.6s ease-out;
        }

        .animate-float {
          animation: float 7s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-pulse-slower {
          animation: pulse-slower 6s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounceSlow 2s ease-in-out infinite;
        }

        .bg-dots-pattern {
          background-image: radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 30px 30px;
        }
      `}</style>
    </div>
  );
};

export default Signup;