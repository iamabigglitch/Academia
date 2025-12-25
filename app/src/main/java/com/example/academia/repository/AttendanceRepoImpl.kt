package com.example.academia.repository

import com.example.academia.model.AttendanceModel
import com.google.firebase.database.*

class AttendanceRepoImpl : AttendanceRepo {

    private val database: FirebaseDatabase = FirebaseDatabase.getInstance()
    private val ref: DatabaseReference = database.getReference("attendance")

    override fun addAttendance(
        attendance: AttendanceModel,
        callback: (Boolean, String) -> Unit
    ) {
        val attendanceId = ref.push().key
        if (attendanceId == null) {
            callback(false, "Failed to generate attendance ID")
            return
        }

        attendance.attendanceId = attendanceId

        ref.child(attendanceId).setValue(attendance)
            .addOnCompleteListener {
                if (it.isSuccessful) {
                    callback(true, "Attendance added")
                } else {
                    callback(false, it.exception?.message ?: "Error")
                }
            }
    }

    override fun getAllAttendance(
        callback: (Boolean, String, List<AttendanceModel>?) -> Unit
    ) {
        ref.addListenerForSingleValueEvent(object : ValueEventListener {
            override fun onDataChange(snapshot: DataSnapshot) {
                val list = mutableListOf<AttendanceModel>()
                for (child in snapshot.children) {
                    val attendance = child.getValue(AttendanceModel::class.java)
                    attendance?.let { list.add(it) }
                }
                callback(true, "Success", list)
            }

            override fun onCancelled(error: DatabaseError) {
                callback(false, error.message, null)
            }
        })
    }

    override fun updateAttendance(
        attendanceId: String,
        attendance: AttendanceModel,
        callback: (Boolean, String) -> Unit
    ) {
        ref.child(attendanceId)
            .updateChildren(attendance.toMap())
            .addOnCompleteListener {
                if (it.isSuccessful) {
                    callback(true, "Attendance updated")
                } else {
                    callback(false, it.exception?.message ?: "Error")
                }
            }
    }

    override fun deleteAttendance(
        attendanceId: String,
        callback: (Boolean, String) -> Unit
    ) {
        ref.child(attendanceId).removeValue()
            .addOnCompleteListener {
                if (it.isSuccessful) {
                    callback(true, "Attendance deleted")
                } else {
                    callback(false, it.exception?.message ?: "Error")
                }
            }
    }
}
