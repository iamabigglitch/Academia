package com.example.academia.viewmodel

import androidx.lifecycle.ViewModel
import com.example.academia.model.CourseModel
import com.example.academia.repository.CourseRepo

class CourseViewModel(
    private val repo: CourseRepo
) : ViewModel() {

    fun addCourse(
        subjectName: String,
        callback: (Boolean, String) -> Unit
    ) {
        val course = CourseModel(subjectName = subjectName)
        repo.addCourse(course, callback)
    }

    fun getAllCourses(
        callback: (List<CourseModel>?) -> Unit
    ) {
        repo.getAllCourses { success, _, list ->
            if (success) callback(list) else callback(emptyList())
        }
    }

    fun deleteCourse(
        courseId: String,
        callback: (Boolean, String) -> Unit
    ) {
        repo.deleteCourse(courseId, callback)
    }
}
