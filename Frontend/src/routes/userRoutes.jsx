import React from "react";
import { Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import MyCoursesPage from "../pages/private/MyCoursesPage";
import CourseDetailPage from "../pages/private/CourseDetailPage";
import MyProfile from '../pages/private/MyProfile';
import Paymentpage from '../pages/private/Paymentpage';

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

    <Route 
      path="/payment" 
      element={<ProtectedRoute><Paymentpage /></ProtectedRoute>} 
    />

  </>
);

export default UserRoutes;