package com.example.academia.viewmodel

import androidx.lifecycle.ViewModel
import com.example.academia.model.CourseModel
import com.example.academia.repository.CourseRepo

class CourseViewModel (val repo: CourseRepo): ViewModel() {

        fun addCourse(
            course: CourseModel,
            callback: (Boolean, String) -> Unit
        ) {
            repo.addCourse(course, callback)
        }

        fun getAllCourses(
            callback: (List<CourseModel>?) -> Unit
        ) {
            repo.getAllCourses { success, _, courses ->
                callback(if (success) courses else null)
            }
        }

        fun getCourseById(
            courseId: String,
            callback: (CourseModel?) -> Unit
        ) {
            repo.getCourseById(courseId) { success, _, course ->
                callback(if (success) course else null)
            }
        }

        fun updateCourse(
            courseId: String,
            course: CourseModel,
            callback: (Boolean, String) -> Unit
        ) {
            repo.updateCourse(courseId, course, callback)
        }

        fun deleteCourse(
            courseId: String,
            callback: (Boolean, String) -> Unit
        ) {
            repo.deleteCourse(courseId, callback)
        }
    }
