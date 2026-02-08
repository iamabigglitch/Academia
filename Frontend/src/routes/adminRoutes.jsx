import React from "react";
import { Route } from "react-router-dom";
import { AdminProtectedRoute } from "./ProtectedRoute";
import Add from "../pages/Admin/private/AdminAdd";
import List from "../pages/Admin/private/AdminList";
import Booking from "../pages/Admin/private/AdminBooking";
import AdminHome from "../pages/Admin/private/AdminHome";
import MyProfile from "../pages/private/MyProfile";


const AdminRoutes = () => (
  <>
  
    <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminHome /></AdminProtectedRoute>}  />
    <Route path="/admin/addcourse" element={<AdminProtectedRoute><Add /></AdminProtectedRoute>} />
    <Route path="/admin/listcourse" element={<AdminProtectedRoute><List /></AdminProtectedRoute>} />
    <Route path="/admin/booking" element={<AdminProtectedRoute><Booking /></AdminProtectedRoute>} />
    <Route path="/admin/profile" element={<AdminProtectedRoute><MyProfile /></AdminProtectedRoute>} />
  </>
);

export default AdminRoutes;