import React from 'react';
import MyCourses from '../../components/MyCourses';
import Footer from '../../components/Footer';
import NavBar from '../../components/Navbar';

const MyCoursesPage = () => {
  return (
    <div>
        <NavBar/>
        <MyCourses />
        <Footer />
    </div>
  );
}

export default MyCoursesPage;