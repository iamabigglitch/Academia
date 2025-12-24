package com.example.academia.repository

import com.example.academia.model.AttendanceModel

interface AttendanceRepo {

    fun getAttendance(
        callback: (Boolean, String, List<AttendanceModel>?) -> Unit
    )

    fun markAttendance(
        studentId: String,
        callback: (Boolean, String) -> Unit
    )
}

