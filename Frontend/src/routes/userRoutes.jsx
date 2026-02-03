import React from "react";
import { Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import MyCoursesPage from "../pages/private/MyCoursesPage";
import CourseDetailPageHome from "../pages/private/CourseDetailPageHome";
import CourseDetailPage from "../pages/private/CourseDetailPage";

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
  </>
);

export default UserRoutes;