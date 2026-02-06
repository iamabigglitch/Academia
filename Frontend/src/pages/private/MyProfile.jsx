import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Edit2, Save, X, User, Mail, Shield, AlertCircle, Trash2, Lock, Eye, EyeOff, Send } from "lucide-react";
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

      setFormData((prev) => ({
        ...prev,
        profileImage: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
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
      
      // Reset password form
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
      
      // Preserve role when updating localStorage
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
        login(token);
      }

      toast.success("Profile updated successfully!");
      navigate("/courses");
      
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
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <ClipLoader size={50} color="#3b82f6" />
        <p className="text-gray-600 text-lg">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your personal information and account settings</p>
        </div>

        {/* MAIN CARD */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* PROFILE SECTION */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* PROFILE IMAGE */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-md">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <User className="w-16 h-16 text-white" />
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="absolute bottom-0 right-0 flex gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition"
                      title="Upload new photo"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                    {imagePreview && (
                      <button
                        onClick={handleRemoveImage}
                        className="w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg transition"
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
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {profile?.username || "User"}
                </h2>
                <p className="text-gray-600 mb-3">{profile?.email}</p>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                  <Shield className="w-4 h-4" />
                  <span className="capitalize">{profile?.role || "User"}</span>
                </div>
              </div>

              {/* EDIT BUTTON */}
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition flex items-center gap-2 shadow-sm"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* FORM SECTION */}
          <div className="p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Information</h3>

            <div className="space-y-6">
              {/* USERNAME */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      className={`w-full px-4 py-3 text-base border ${
                        errors.username ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                      } rounded-lg focus:outline-none focus:ring-2 transition`}
                      placeholder="Enter your username"
                    />
                    {errors.username && (
                      <p className="text-red-600 text-sm mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.username}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-base">
                    {profile?.username}
                  </div>
                )}
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`w-full px-4 py-3 text-base border ${
                        errors.email ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                      } rounded-lg focus:outline-none focus:ring-2 transition`}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="text-red-600 text-sm mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-base">
                    {profile?.email}
                  </div>
                )}
              </div>

              {/* PHONE NUMBER */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={formData.number}
                      onChange={(e) => handleInputChange("number", e.target.value)}
                      className={`w-full px-4 py-3 text-base border ${
                        errors.number ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                      } rounded-lg focus:outline-none focus:ring-2 transition`}
                      placeholder="Enter your phone number"
                      maxLength={10}
                    />
                    {errors.number && (
                      <p className="text-red-600 text-sm mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.number}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-base">
                    {profile?.number || "Not set"}
                  </div>
                )}
              </div>

              {/* GOOGLE ACCOUNT INFO */}
              {profile?.googleId && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-900">Google Account</p>
                      <p className="text-sm text-blue-700 mt-0.5">
                        You're signed in with your Google account
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ACTION BUTTONS (only in edit mode) */}
            {isEditing && (
              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <ClipLoader size={16} color="#ffffff" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition disabled:opacity-50 flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* PASSWORD & SECURITY SECTION */}
        {profile && !profile.googleId && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Password & Security</h3>
                  <p className="text-sm text-gray-600 mt-1">Manage your password settings</p>
                </div>
              </div>

              {/* PASSWORD OPTIONS */}
              <div className="space-y-4">
                {/* CHANGE PASSWORD BUTTON */}
                {!showPasswordSection && !showForgotPassword && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowPasswordSection(true);
                        setShowForgotPassword(false);
                      }}
                      className="flex-1 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium transition flex items-center justify-center gap-2 border border-blue-200"
                    >
                      <Lock className="w-4 h-4" />
                      Change Password
                    </button>
                    <button
                      onClick={() => {
                        setShowForgotPassword(true);
                        setShowPasswordSection(false);
                        setResetEmail(profile?.email || "");
                      }}
                      className="flex-1 px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg font-medium transition flex items-center justify-center gap-2 border border-gray-200"
                    >
                      <Send className="w-4 h-4" />
                      Reset via Email
                    </button>
                  </div>
                )}

                {/* FORGOT PASSWORD SECTION */}
                {showForgotPassword && (
                  <div className="space-y-4 pt-6 border-t border-gray-200">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-900 font-medium mb-1">Reset Password via Email</p>
                      <p className="text-sm text-blue-700">
                        We'll send a password reset link to your email address.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleForgotPassword}
                        disabled={sendingResetEmail}
                        className="flex-1 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {sendingResetEmail ? (
                          <>
                            <ClipLoader size={16} color="#ffffff" />
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
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
                        className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition disabled:opacity-50 flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* CHANGE PASSWORD SECTION */}
                {showPasswordSection && (
                  <div className="space-y-6 pt-6 border-t border-gray-200">
                    {/* Current Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.current ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                          className={`w-full px-4 py-3 pr-12 text-base border ${
                            passwordErrors.currentPassword ? "border-red-300" : "border-gray-300"
                          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {passwordErrors.currentPassword && (
                        <p className="text-red-600 text-sm mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {passwordErrors.currentPassword}
                        </p>
                      )}
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                          className={`w-full px-4 py-3 pr-12 text-base border ${
                            passwordErrors.newPassword ? "border-red-300" : "border-gray-300"
                          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {passwordErrors.newPassword && (
                        <p className="text-red-600 text-sm mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {passwordErrors.newPassword}
                        </p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                          className={`w-full px-4 py-3 pr-12 text-base border ${
                            passwordErrors.confirmPassword ? "border-red-300" : "border-gray-300"
                          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {passwordErrors.confirmPassword && (
                        <p className="text-red-600 text-sm mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {passwordErrors.confirmPassword}
                        </p>
                      )}
                    </div>

                    {/* Password Requirements */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-900 font-medium mb-2">
                        Password Requirements:
                      </p>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• At least 6 characters long</li>
                        <li>• Must contain at least one number</li>
                        <li>• Must be different from current password</li>
                      </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleChangePassword}
                        disabled={changingPassword}
                        className="flex-1 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {changingPassword ? (
                          <>
                            <ClipLoader size={16} color="#ffffff" />
                            <span>Changing...</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
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
                        className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition disabled:opacity-50 flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
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
    </div>
  );
}

export default MyProfile;