import React from "react";
import { Route } from "react-router-dom";
import { GuestOnlyRoute } from "./ProtectedRoute";
import Home from "../pages/private/Home";
import About from "../pages/private/About";
import Contact from "../pages/private/Contact";
import Faculty from "../pages/private/Faculty";
import Courses from "../pages/private/Courses";
import Login from "../pages/public/Login";
import Signup from "../pages/public/Signup";

const PublicRoutes = () => (
  <>
    <Route path="/" element={<Home />} />
    <Route path="/home" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/faculty" element={<Faculty />} />
    <Route path="/courses" element={<Courses />} />

    <Route path="/login" element={<GuestOnlyRoute><Login /></GuestOnlyRoute>} />
    <Route path="/register" element={<GuestOnlyRoute><Signup /></GuestOnlyRoute>} />
  </>
);

export default PublicRoutes;