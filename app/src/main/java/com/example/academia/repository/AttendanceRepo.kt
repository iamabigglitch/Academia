package com.example.academia.repository

import com.example.academia.model.AttendanceModel

interface AttendanceRepo {
    fun getAttendanceForStudent(studentId: String, callback: (List<AttendanceModel>?) -> Unit)
    fun getAttendanceForCourse(courseId: String, callback: (List<AttendanceModel>?) -> Unit)
    fun markAttendance(attendance: AttendanceModel, callback: (Boolean, String) -> Unit)
}

