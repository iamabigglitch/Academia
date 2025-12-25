package com.example.academia.viewmodel

import androidx.lifecycle.ViewModel
import com.example.academia.model.CourseModel
import com.example.academia.repository.CourseRepo
import com.example.academia.repository.CourseRepoImpl

class CourseViewModel(
    private val repo: CourseRepo = CourseRepoImpl()
) : ViewModel() {

    // Fetch all courses
    fun getAllCourses(callback: (Boolean, String, List<CourseModel>?) -> Unit) {
        repo.getAllCourses(callback)
    }

    // Update a course (optional, for teachers)
    fun updateCourse(
        courseId: String,
        updatedCourse: CourseModel,
        callback: (Boolean, String) -> Unit
    ) {
        repo.updateCourse(courseId, updatedCourse, callback)
    }
}
