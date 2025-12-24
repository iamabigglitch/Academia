package com.example.academia.repository

import com.example.academia.model.CourseModel

interface CourseRepo {

    fun addCourse(
        course: CourseModel,
        callback: (Boolean, String) -> Unit
    )

    fun getAllCourses(
        callback: (Boolean, String, List<CourseModel>?) -> Unit
    )

    fun deleteCourse(
        courseId: String,
        callback: (Boolean, String) -> Unit
    )
}
