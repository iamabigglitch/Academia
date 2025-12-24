package com.example.academia.repository

import com.example.academia.model.CourseModel
import com.google.firebase.database.*

class CourseRepoImpl : CourseRepo {

    private val database: FirebaseDatabase = FirebaseDatabase.getInstance()
    private val ref: DatabaseReference = database.getReference("courses")

    override fun addCourse(
        course: CourseModel,
        callback: (Boolean, String) -> Unit
    ) {
        val courseId = ref.push().key.toString()
        course.courseId = courseId

        ref.child(courseId)
            .setValue(course.toMap())
            .addOnCompleteListener {
                if (it.isSuccessful) {
                    callback(true, "Course added successfully")
                } else {
                    callback(false, it.exception?.message ?: "Error")
                }
            }
    }

    override fun getAllCourses(
        callback: (Boolean, String, List<CourseModel>?) -> Unit
    ) {
        ref.addListenerForSingleValueEvent(object : ValueEventListener {

            override fun onDataChange(snapshot: DataSnapshot) {
                val list = mutableListOf<CourseModel>()

                for (child in snapshot.children) {
                    val model = child.getValue(CourseModel::class.java)
                    model?.let { list.add(it) }
                }

                callback(true, "Success", list)
            }

            override fun onCancelled(error: DatabaseError) {
                callback(false, error.message, null)
            }
        })
    }

    override fun deleteCourse(
        courseId: String,
        callback: (Boolean, String) -> Unit
    ) {
        ref.child(courseId)
            .removeValue()
            .addOnCompleteListener {
                if (it.isSuccessful) {
                    callback(true, "Course deleted")
                } else {
                    callback(false, it.exception?.message ?: "Error")
                }
            }
    }
}
