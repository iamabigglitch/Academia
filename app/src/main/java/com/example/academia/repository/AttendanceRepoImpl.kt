package com.example.academia.repository

import com.example.academia.model.AttendanceModel
import com.google.firebase.database.*

class AttendanceRepoImpl : AttendanceRepo {

    private val ref = FirebaseDatabase.getInstance().getReference("attendance")

    override fun getAttendance(
        callback: (Boolean, String, List<AttendanceModel>?) -> Unit
    ) {
        ref.addListenerForSingleValueEvent(object : ValueEventListener {

            override fun onDataChange(snapshot: DataSnapshot) {
                val list = mutableListOf<AttendanceModel>()

                for (child in snapshot.children) {
                    val model = child.getValue(AttendanceModel::class.java)
                    model?.let { list.add(it) }
                }

                callback(true, "Success", list)
            }

            override fun onCancelled(error: DatabaseError) {
                callback(false, error.message, null)
            }
        })
    }

    override fun markAttendance(
        studentId: String,
        callback: (Boolean, String) -> Unit
    ) {
        val studentRef = ref.child(studentId)

        studentRef.child("status")
            .setValue("Present")
            .addOnCompleteListener {
                if (it.isSuccessful) {
                    callback(true, "Attendance marked")
                } else {
                    callback(false, it.exception?.message ?: "Error")
                }
            }
    }
}
