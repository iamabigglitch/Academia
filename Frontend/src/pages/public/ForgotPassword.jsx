import React, { useState } from 'react';
import { Mail, Lock, BookOpen, Shield, ArrowLeft, CheckCircle } from 'lucide-react';
import axios from 'axios';

const ForgotPassword = () => {
  // State for loading during API call
  const [loading, setLoading] = useState(false);
  
  // State for success message
  const [emailSent, setEmailSent] = useState(false);
  
  // State for email input
  const [email, setEmail] = useState('');

  // Handle Forgot Password submission
  
  const handleForgotPassword = async () => {
  if (!email) {
    alert("Please enter your email");
    return;
  }

  setLoading(true);

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`,
      { email }
    );

    if (response.status === 200) {
      setEmailSent(true);
    }
  } catch (error) {
    if (error.response) {
      alert(error.response.data.message || "Failed to send reset email");
    } else {
      alert("Error connecting to server");
    }
    console.error("Forgot password error:", error);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl animate-drift"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-slate-400 rounded-full opacity-10 blur-3xl animate-drift-reverse"></div>
        
        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 bg-mesh-pattern opacity-5"></div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center gap-8 lg:gap-12 relative z-10">
        {/* Left Side - Information */}
        <div className="w-full lg:w-1/2 text-white space-y-8">
          {/* Logo for mobile */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="bg-white p-4 rounded-2xl">
              <BookOpen className="w-10 h-10 text-blue-900" />
            </div>
          </div>

          {/* Desktop logo and title */}
          <div className="hidden lg:flex items-center gap-4 mb-8">
            <div className="bg-white p-4 rounded-2xl animate-pulse-gentle">
              <BookOpen className="w-12 h-12 text-blue-900" />
            </div>
            <h1 className="text-5xl font-bold">Academia</h1>
          </div>

          {/* Information cards */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all">
              <div className="flex items-start gap-4">
                <div className="bg-blue-500 p-3 rounded-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Secure Process</h3>
                  <p className="text-blue-200 text-sm">
                    We'll send a secure link to reset your password. The link expires in 1 hour.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all">
              <div className="flex items-start gap-4">
                <div className="bg-blue-500 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Check Your Email</h3>
                  <p className="text-blue-200 text-sm">
                    Look for an email from Academia. Don't forget to check your spam folder.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all">
              <div className="flex items-start gap-4">
                <div className="bg-blue-500 p-3 rounded-lg">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Create New Password</h3>
                  <p className="text-blue-200 text-sm">
                    Click the link in your email to create a new secure password.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Reset Form */}
        <div className="w-full lg:w-1/2">
          <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10 animate-fadeIn">
            {!emailSent ? (
              <>
                {/* Form Header */}
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <div className="bg-blue-100 p-4 rounded-full">
                      <Lock className="w-8 h-8 text-blue-900" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Forgot Password?</h2>
                  <p className="text-gray-600">
                    No worries! Enter your email and we'll send you reset instructions.
                  </p>
                </div>

                {/* Email Input Form */}
                <div className="space-y-6">
                  {/* Email Input */}
                  <div className="relative group">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-blue-900 transition-colors" />
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-900 focus:outline-none transition-all"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleForgotPassword}
                    disabled={loading}
                    className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>

                  {/* Back to Login */}
                  <a
                    href="/login"
                    className="flex items-center justify-center gap-2 text-gray-600 hover:text-blue-900 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                  </a>
                </div>
              </>
            ) : (
              // Success State
              <div className="text-center py-8 animate-scaleIn">
                <div className="flex justify-center mb-6">
                  <div className="bg-green-100 p-4 rounded-full animate-bounce-once">
                    <CheckCircle className="w-16 h-16 text-green-600" />
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Check Your Email!</h2>
                
                <p className="text-gray-600 mb-2">
                  We've sent password reset instructions to:
                </p>
                <p className="text-blue-900 font-semibold mb-6">{email}</p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>Didn't receive the email?</strong>
                    <br />
                    Check your spam folder or try resending in a few minutes.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setEmailSent(false);
                      setEmail('');
                    }}
                    className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-all"
                  >
                    Try Another Email
                  </button>
                  
                  <a
                    href="/login"
                    className="flex items-center justify-center gap-2 text-gray-600 hover:text-blue-900 transition-colors py-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Help Text */}
          <p className="text-center text-white/70 text-sm mt-6">
            Need help? Contact our{' '}
            <a href="/support" className="text-white hover:underline font-semibold">
              support team
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

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes drift {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(20px, -20px);
          }
          50% {
            transform: translate(-10px, 10px);
          }
          75% {
            transform: translate(10px, 20px);
          }
        }

        @keyframes drift-reverse {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(-20px, 20px);
          }
          50% {
            transform: translate(10px, -10px);
          }
          75% {
            transform: translate(-10px, -20px);
          }
        }

        @keyframes pulse-gentle {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        @keyframes bounce-once {
          0%, 100% {
            transform: translateY(0);
          }
          25% {
            transform: translateY(-20px);
          }
          50% {
            transform: translateY(0);
          }
          75% {
            transform: translateY(-10px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out;
        }

        .animate-drift {
          animation: drift 20s ease-in-out infinite;
        }

        .animate-drift-reverse {
          animation: drift-reverse 25s ease-in-out infinite;
        }

        .animate-pulse-gentle {
          animation: pulse-gentle 3s ease-in-out infinite;
        }

        .animate-bounce-once {
          animation: bounce-once 1s ease-out;
        }

        .bg-mesh-pattern {
          background-image: 
            linear-gradient(45deg, rgba(255, 255, 255, 0.05) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(255, 255, 255, 0.05) 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, rgba(255, 255, 255, 0.05) 75%),
            linear-gradient(-45deg, transparent 75%, rgba(255, 255, 255, 0.05) 75%);
          background-size: 60px 60px;
          background-position: 0 0, 0 30px, 30px -30px, -30px 0px;
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;