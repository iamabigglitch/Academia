package com.example.academia.model

data class AttendanceModel(
    var attendanceId: String = "",
    var studentId: String = "",
    var studentName: String = "",
    var status: String = "Absent",   // Present / Absent
    var date: String = ""
) {
    fun toMap(): Map<String, Any?> {
        return mapOf(
            "attendanceId" to attendanceId,
            "studentId" to studentId,
            "studentName" to studentName,
            "status" to status,
            "date" to date
        )
    }
}
