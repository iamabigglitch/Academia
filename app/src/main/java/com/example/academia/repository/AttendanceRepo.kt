package com.example.academia.repository

import com.example.academia.model.AttendanceModel

interface AttendanceRepo {

    fun addAttendance(
        attendance: AttendanceModel,
        callback: (Boolean, String) -> Unit
    )

    fun getAllAttendance(
        callback: (Boolean, String, List<AttendanceModel>?) -> Unit
    )

    fun updateAttendance(
        attendanceId: String,
        attendance: AttendanceModel,
        callback: (Boolean, String) -> Unit
    )

    fun deleteAttendance(
        attendanceId: String,
        callback: (Boolean, String) -> Unit
    )
}
