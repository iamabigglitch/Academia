import React from "react";
import { Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import MyCoursesPage from "../pages/private/MyCoursesPage";
import CourseDetailPage from "../pages/private/CourseDetailPage";
import MyProfile from '../pages/private/MyProfile';

const UserRoutes = () => (
  <>
  
    <Route 
      path="/mycourses" 
      element={<ProtectedRoute><MyCoursesPage /></ProtectedRoute>} 
    />

    <Route 
      path="/course/:id" 
      element={<ProtectedRoute><CourseDetailPage /></ProtectedRoute>} 
    />

    <Route 
      path="/profile" 
      element={<ProtectedRoute><MyProfile /></ProtectedRoute>} 
    />

  </>
);

export default UserRoutes;