import React, { useState } from 'react';
import { Mail, Lock, BookOpen, Shield, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});

  // Validate email
  const validateEmail = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleForgotPassword = async (e) => {
    e?.preventDefault?.();
    
    if (!validateEmail()) {
      return;
    }

    const trimmed = email.trim();

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE}/auth/forgot-password`,
        { email: trimmed },
        { headers: { 'Content-Type': 'application/json' }, timeout: 15000 }
      );

      if (response.status === 200 && (response.data?.success !== false)) {
        setEmailSent(true);
        toast.success('If an account exists, we\'ve sent reset instructions.');
      } else {
        setEmailSent(true);
      }
    } catch (error) {
      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network')) {
        toast.error('Unable to connect. Please try again later.');
      } else if (error.response?.status === 404) {
        toast.error('Password reset is not configured yet. Please contact support.');
      } else {
        const msg = error.response?.data?.message || 'Failed to send reset email.';
        toast.error(msg);
      }
      console.error('Forgot password error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950 flex items-center justify-center p-4 relative overflow-hidden">
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl animate-drift"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-slate-400 rounded-full opacity-10 blur-3xl animate-drift-reverse"></div>
        <div className="absolute inset-0 bg-mesh-pattern opacity-5"></div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center gap-6 lg:gap-10 relative z-10">
        {/* Left Side - Information */}
        <div className="w-full lg:w-1/2 text-white space-y-6">
          <div className="lg:hidden flex justify-center mb-6">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/20 animate-pulse-gentle">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl xl:text-4xl font-bold tracking-tight">Academia</h1>
          </div>

          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 hover:bg-white/15 transition-all">
              <div className="flex items-start gap-3">
                <div className="bg-indigo-500/80 p-2.5 rounded-xl shrink-0">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-1">Secure Process</h3>
                  <p className="text-blue-200 text-sm">
                    We'll send a secure link to reset your password. The link expires in 1 hour.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 hover:bg-white/15 transition-all">
              <div className="flex items-start gap-3">
                <div className="bg-indigo-500/80 p-2.5 rounded-xl shrink-0">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-1">Check Your Email</h3>
                  <p className="text-blue-200 text-sm">
                    Look for an email from Academia. Don't forget to check your spam folder.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 hover:bg-white/15 transition-all">
              <div className="flex items-start gap-3">
                <div className="bg-indigo-500/80 p-2.5 rounded-xl shrink-0">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-1">Create New Password</h3>
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
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-6 sm:p-8 animate-fadeIn">
            {!emailSent ? (
              <>
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4">
                    <div className="bg-indigo-100 p-4 rounded-2xl">
                      <Lock className="w-8 h-8 text-indigo-600" />
                    </div>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Forgot Password?</h2>
                  <p className="text-gray-600 text-sm">
                    No worries! Enter your email and we'll send you reset instructions.
                  </p>
                </div>

                <form onSubmit={handleForgotPassword} className="space-y-5">
                  <div>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
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

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>

                  <Link
                    to="/login"
                    className="flex items-center justify-center gap-2 text-gray-600 hover:text-indigo-600 font-medium transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                  </Link>
                </form>
              </>
            ) : (
              <div className="text-center py-4 animate-scaleIn">
                <div className="flex justify-center mb-5">
                  <div className="bg-green-100 p-4 rounded-2xl animate-bounce-once">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">Check Your Email</h2>
                <p className="text-gray-600 mb-1 text-sm">If an account exists for:</p>
                <p className="text-indigo-600 font-semibold mb-5 break-all">{email}</p>
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-5 text-left">
                  <p className="text-sm text-indigo-800">
                    <strong>Didn't receive the email?</strong> Check your spam folder or try another email below.
                  </p>
                </div>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => { setEmailSent(false); setEmail(''); setErrors({}); }}
                    className="w-full bg-gray-100 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                  >
                    Try Another Email
                  </button>
                  <Link
                    to="/login"
                    className="flex items-center justify-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold py-2 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                  </Link>
                </div>
              </div>
            )}
          </div>
          <p className="text-center text-white/70 text-sm mt-5">
            Need help? <Link to="/contact" className="text-white hover:underline font-semibold">Contact support</Link>
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