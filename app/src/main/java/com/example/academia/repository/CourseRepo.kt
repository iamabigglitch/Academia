package com.example.academia.repository

import com.example.academia.model.CourseModel

interface CourseRepo {

    // Teacher
    fun addCourse(
        course: CourseModel,
        callback: (Boolean, String) -> Unit
    )

    // Student + Teacher
    fun getAllCourses(
        callback: (Boolean, String, List<CourseModel>?) -> Unit
    )

    // Optional (details screen)
    fun getCourseById(
        courseId: String,
        callback: (Boolean, String, CourseModel?) -> Unit
    )

    // Teacher
    fun updateCourse(
        courseId: String,
        course: CourseModel,
        callback: (Boolean, String) -> Unit
    )

    // Teacher
    fun deleteCourse(
        courseId: String,
        callback: (Boolean, String) -> Unit
    )
}
