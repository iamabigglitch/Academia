package com.example.academia.repository

import com.example.academia.model.CourseModel
import com.google.firebase.database.DatabaseReference
import com.google.firebase.database.FirebaseDatabase

class CourseRepoImpl  : CourseRepo {

    private val database: FirebaseDatabase = FirebaseDatabase.getInstance()
    private val ref: DatabaseReference = database.getReference("courses")

    // ADD COURSE (Teacher)
    override fun addCourse(
        course: CourseModel,
        callback: (Boolean, String) -> Unit
    ) {
        val courseId = ref.push().key ?: ""
        course.courseId = courseId

        ref.child(courseId).setValue(course)
            .addOnSuccessListener {
                callback(true, "Course added successfully")
            }
            .addOnFailureListener {
                callback(false, it.message ?: "Error")
            }
    }

    // GET ALL COURSES (Student + Teacher)
    override fun getAllCourses(
        callback: (Boolean, String, List<CourseModel>?) -> Unit
    ) {
        ref.get()
            .addOnSuccessListener { snapshot ->
                val courseList = mutableListOf<CourseModel>()

                snapshot.children.forEach {
                    val course = it.getValue(CourseModel::class.java)
                    course?.let { courseList.add(it) }
                }

                callback(true, "Success", courseList)
            }
            .addOnFailureListener {
                callback(false, it.message ?: "Error", null)
            }
    }

    // GET COURSE BY ID
    override fun getCourseById(
        courseId: String,
        callback: (Boolean, String, CourseModel?) -> Unit
    ) {
        ref.child(courseId).get()
            .addOnSuccessListener {
                val course = it.getValue(CourseModel::class.java)
                callback(true, "Success", course)
            }
            .addOnFailureListener {
                callback(false, it.message ?: "Error", null)
            }
    }

    // UPDATE COURSE (Teacher)
    override fun updateCourse(
        courseId: String,
        course: CourseModel,
        callback: (Boolean, String) -> Unit
    ) {
        ref.child(courseId).updateChildren(course.toMap())
            .addOnSuccessListener {
                callback(true, "Course updated")
            }
            .addOnFailureListener {
                callback(false, it.message ?: "Error")
            }
    }

    // DELETE COURSE (Teacher)
    override fun deleteCourse(
        courseId: String,
        callback: (Boolean, String) -> Unit
    ) {
        ref.child(courseId).removeValue()
            .addOnSuccessListener {
                callback(true, "Course deleted")
            }
            .addOnFailureListener {
                callback(false, it.message ?: "Error")
            }
    }
}