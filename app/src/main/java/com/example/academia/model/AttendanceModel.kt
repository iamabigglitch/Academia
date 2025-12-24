package com.example.academia.model

data class AttendanceModel(
        val attendanceId: String = "",
        val courseId: String = "",
        val studentId: String = "",
        val date: String = "",
        val isPresent: Boolean = false
    )
