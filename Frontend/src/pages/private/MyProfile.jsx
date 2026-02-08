import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Edit2, Save, X, User, Mail, Shield, AlertCircle, Trash2, Lock, Eye, EyeOff, Send, CheckCircle, Contact } from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { useAuth } from "../../context/authContext";

function MyProfile() {
  const navigate = useNavigate();
  const authContext = useAuth();
  const user = authContext?.user;
  const login = authContext?.login;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    number: "",
    profileImage: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Password change state
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [changingPassword, setChangingPassword] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Forgot password state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [sendingResetEmail, setSendingResetEmail] = useState(false);

  // Load profile data
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/profile");
      const profileData = res.data.data || res.data;
      setProfile(profileData);
      
      setFormData({
        username: profileData.username || "",
        email: profileData.email || "",
        number: profileData.number || "",
        profileImage: null,
      });
      
      if (profileData.profileImage) {
        setImagePreview(`http://localhost:3000/${profileData.profileImage}`);
      }
    } catch (error) {
      toast.error("Failed to load profile");
      console.error("Profile fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: null,
    }));
  };

  // Handle password input changes
  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setPasswordErrors((prev) => ({
      ...prev,
      [field]: null,
    }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        toast.error("Only JPG, PNG, and WebP images are allowed");
        e.target.value = "";
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("Image size cannot exceed 5MB");
        e.target.value = "";
        return;
      }

      setIsUploadingImage(true);
      setFormData((prev) => ({
        ...prev,
        profileImage: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setIsUploadingImage(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove profile image
  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      profileImage: null,
    }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.username || formData.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.number && !/^\d{10}$/.test(formData.number)) {
      newErrors.number = "Phone number must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate password change
  const validatePasswordChange = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    } else if (!/[0-9]/.test(passwordData.newPassword)) {
      newErrors.newPassword = "Password must contain at least one number";
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (passwordData.currentPassword && passwordData.newPassword && 
        passwordData.currentPassword === passwordData.newPassword) {
      newErrors.newPassword = "New password must be different from current password";
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Send forgot password email
  const handleForgotPassword = async () => {
    if (!resetEmail) {
      toast.error("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setSendingResetEmail(true);
    try {
      await api.post("/auth/forgot-password", { email: resetEmail });
      toast.success("Password reset link sent! Check your email.");
      setShowForgotPassword(false);
      setResetEmail("");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to send reset link";
      toast.error(errorMessage);
    } finally {
      setSendingResetEmail(false);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (!validatePasswordChange()) {
      toast.error("Please fix the errors");
      return;
    }

    setChangingPassword(true);
    try {
      await api.put("/auth/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });

      toast.success("Password changed successfully!");
      
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordErrors({});
      setShowPasswordSection(false);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to change password";
      toast.error(errorMessage);
      
      if (error.response?.data?.errors) {
        setPasswordErrors(error.response.data.errors);
      }
    } finally {
      setChangingPassword(false);
    }
  };

  // Save profile
  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors before saving");
      return;
    }

    setSaving(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("username", formData.username.trim());
      formDataToSend.append("email", formData.email.trim());
      formDataToSend.append("number", formData.number?.trim() || "");

      if (formData.profileImage) {
        formDataToSend.append("profileImage", formData.profileImage);
      }

      const res = await api.put("/auth/profile", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedProfile = res.data.data || res.data;
      setProfile(updatedProfile);
      
      const currentUserData = JSON.parse(localStorage.getItem("user") || "{}");
      const userDataWithRole = {
        ...updatedProfile,
        role: updatedProfile.role || currentUserData.role || "user"
      };
      localStorage.setItem("user", JSON.stringify(userDataWithRole));
      window.dispatchEvent(new Event('storage'));
      
      setFormData({
        username: updatedProfile.username || "",
        email: updatedProfile.email || "",
        number: updatedProfile.number || "",
        profileImage: null,
      });

      if (updatedProfile.profileImage) {
        setImagePreview(`http://localhost:3000/${updatedProfile.profileImage}`);
      }
      
      setIsEditing(false);
      setErrors({});
      
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      const token = localStorage.getItem("token");
      if (token && login) {
        login(token, userDataWithRole);
      }

      toast.success("Profile updated successfully!");
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to update profile";
      toast.error(errorMessage);

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setSaving(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData({
      username: profile?.username || "",
      email: profile?.email || "",
      number: profile?.number || "",
      profileImage: null,
    });
    setErrors({});
    setIsEditing(false);
    
    if (profile?.profileImage) {
      setImagePreview(`http://localhost:3000/${profile.profileImage}`);
    } else {
      setImagePreview(null);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col items-center justify-center gap-6 p-4">
        <div className="relative">
          <div className="w-24 h-24 bg-[#4f46e5] rounded-full animate-pulse"></div>
          <ClipLoader size={60} color="#4f46e5" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-gray-700 text-xl font-semibold animate-pulse">Loading Your Profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto pt-20">
        {/* HEADER */}
        <div className="mb-10 text-center sm:text-left animate-fadeIn">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#1c398e] mb-3">
            My Profile
          </h1>
          <p className="text-gray-600 text-lg">Manage your personal information and preferences</p>
        </div>

        {/* MAIN PROFILE CARD */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8 animate-slideUp">
          {/* PROFILE CONTENT */}
          <div className="px-6 sm:px-10 pb-10 pt-10">
            <div className="flex flex-col items-center sm:flex-row sm:items-end gap-8 mb-10">
              {/* PROFILE IMAGE */}
              <div className="relative group flex-shrink-0">
                <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full ring-8 ring-white shadow-2xl overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <User className="w-20 h-20 sm:w-24 sm:h-24 text-white" />
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="absolute bottom-2 right-2 flex gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingImage}
                      className="w-11 h-11 bg-[#4f46e5] hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Upload photo"
                    >
                      {isUploadingImage ? (
                        <ClipLoader size={16} color="#ffffff" />
                      ) : (
                        <Camera className="w-5 h-5" />
                      )}
                    </button>
                    {imagePreview && (
                      <button
                        onClick={handleRemoveImage}
                        disabled={isUploadingImage}
                        className="w-11 h-11 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Remove photo"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {/* USER INFO */}
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  {profile?.username || "User"}
                </h2>
                <p className="text-gray-600 mb-4 flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="break-all">{profile?.email}</span>
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full text-sm font-semibold shadow-md">
                  <Shield className="w-4 h-4" />
                  <span className="capitalize">{profile?.role || "User"}</span>
                </div>
              </div>

              {/* EDIT BUTTON */}
              {!isEditing && (
                <div className="sm:ml-auto">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 bg-[#4f46e5] hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
                  >
                    <Edit2 className="w-5 h-5" />
                    Edit Profile
                  </button>
                </div>
              )}
            </div>

            {/* FORM SECTION */}
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></div>
                <h3 className="text-2xl font-bold text-gray-900">Account Information</h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* USERNAME */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-600" />
                    Username
                  </label>
                  {isEditing ? (
                    <div>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => handleInputChange("username", e.target.value)}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                          errors.username ? "border-red-500" : "border-gray-200 hover:border-indigo-300"
                        }`}
                        placeholder="Enter your username"
                      />
                      {errors.username && (
                        <p className="text-red-600 text-sm mt-2 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4" />
                          {errors.username}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-900 font-medium">
                      {profile?.username}
                    </div>
                  )}
                </div>

                {/* EMAIL */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-indigo-600" />
                    Email Address
                  </label>
                  {isEditing ? (
                    <div>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                          errors.email ? "border-red-500" : "border-gray-200 hover:border-indigo-300"
                        }`}
                        placeholder="Enter your email"
                      />
                      {errors.email && (
                        <p className="text-red-600 text-sm mt-2 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4" />
                          {errors.email}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-900 font-medium break-all">
                      {profile?.email}
                    </div>
                  )}
                </div>

                {/* PHONE NUMBER */}
                <div className="space-y-2 lg:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Contact className="w-4 h-4 text-indigo-600" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <div>
                      <input
                        type="text"
                        value={formData.number}
                        onChange={(e) => handleInputChange("number", e.target.value)}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                          errors.number ? "border-red-500" : "border-gray-200 hover:border-indigo-300"
                        }`}
                        placeholder="Enter 10-digit phone number"
                        maxLength={10}
                      />
                      {errors.number && (
                        <p className="text-red-600 text-sm mt-2 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4" />
                          {errors.number}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-900 font-medium">
                      {profile?.number || "Not set"}
                    </div>
                  )}
                </div>

                {/* GOOGLE ACCOUNT INFO */}
                {profile?.googleId && (
                  <div className="lg:col-span-2 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-indigo-900 mb-1">Google Account Connected</p>
                        <p className="text-sm text-indigo-700">
                          You're signed in with your Google account. Some settings may be managed by Google.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ACTION BUTTONS */}
              {isEditing && (
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t-2 border-gray-100">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 px-8 py-4 bg-[#4f46e5] hover:bg-indigo-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {saving ? (
                      <>
                        <ClipLoader size={20} color="#ffffff" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex-1 sm:flex-none px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-lg transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    <X className="w-5 h-5" />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* PASSWORD & SECURITY SECTION */}
        {profile && !profile.googleId && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden animate-slideUp">
            <div className="p-6 sm:p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-8 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Password & Security</h3>
                  <p className="text-sm text-gray-600 mt-1">Manage your password and security settings</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* INITIAL BUTTONS */}
                {!showPasswordSection && !showForgotPassword && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        setShowPasswordSection(true);
                        setShowForgotPassword(false);
                      }}
                      className="px-6 py-4 bg-[#4f46e5] hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                    >
                      <Lock className="w-5 h-5" />
                      <span>Change Password</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowForgotPassword(true);
                        setShowPasswordSection(false);
                        setResetEmail(profile?.email || "");
                      }}
                      className="px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-3"
                    >
                      <Send className="w-5 h-5" />
                      <span>Reset via Email</span>
                    </button>
                  </div>
                )}

                {/* FORGOT PASSWORD SECTION */}
                {showForgotPassword && (
                  <div className="space-y-6 pt-6 border-t-2 border-gray-100">
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-5">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Send className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-indigo-900 mb-1">Reset Password via Email</p>
                          <p className="text-sm text-indigo-700">
                            We'll send a password reset link to your email address.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-indigo-600" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 hover:border-indigo-300 focus:border-indigo-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleForgotPassword}
                        disabled={sendingResetEmail}
                        className="flex-1 px-6 py-4 bg-[#4f46e5] hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {sendingResetEmail ? (
                          <>
                            <ClipLoader size={18} color="#ffffff" />
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            <span>Send Reset Link</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setShowForgotPassword(false);
                          setResetEmail("");
                        }}
                        disabled={sendingResetEmail}
                        className="flex-1 sm:flex-none px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <X className="w-5 h-5" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* CHANGE PASSWORD SECTION */}
                {showPasswordSection && (
                  <div className="space-y-6 pt-6 border-t-2 border-gray-100">
                    {/* Current Password */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-indigo-600" />
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.current ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                          className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                            passwordErrors.currentPassword ? "border-red-500" : "border-gray-200 hover:border-indigo-300"
                          }`}
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600 transition-colors"
                        >
                          {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {passwordErrors.currentPassword && (
                        <p className="text-red-600 text-sm mt-2 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4" />
                          {passwordErrors.currentPassword}
                        </p>
                      )}
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-indigo-600" />
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                          className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                            passwordErrors.newPassword ? "border-red-500" : "border-gray-200 hover:border-indigo-300"
                          }`}
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600 transition-colors"
                        >
                          {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {passwordErrors.newPassword && (
                        <p className="text-red-600 text-sm mt-2 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4" />
                          {passwordErrors.newPassword}
                        </p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-indigo-600" />
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                          className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                            passwordErrors.confirmPassword ? "border-red-500" : "border-gray-200 hover:border-indigo-300"
                          }`}
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600 transition-colors"
                        >
                          {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {passwordErrors.confirmPassword && (
                        <p className="text-red-600 text-sm mt-2 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4" />
                          {passwordErrors.confirmPassword}
                        </p>
                      )}
                    </div>

                    {/* Password Requirements */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-5">
                      <p className="text-sm font-bold text-indigo-900 mb-3 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Password Requirements:
                      </p>
                      <ul className="text-sm text-indigo-800 space-y-2">
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                          <span>At least 6 characters long</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                          <span>Must contain at least one number</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                          <span>Must be different from current password</span>
                        </li>
                      </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <button
                        onClick={handleChangePassword}
                        disabled={changingPassword}
                        className="flex-1 px-6 py-4 bg-[#4f46e5] hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {changingPassword ? (
                          <>
                            <ClipLoader size={18} color="#ffffff" />
                            <span>Changing...</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-5 h-5" />
                            <span>Change Password</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setShowPasswordSection(false);
                          setPasswordData({
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: "",
                          });
                          setPasswordErrors({});
                        }}
                        disabled={changingPassword}
                        className="flex-1 sm:flex-none px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <X className="w-5 h-5" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

export default MyProfile;