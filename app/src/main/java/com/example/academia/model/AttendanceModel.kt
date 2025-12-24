package com.example.academia.model

data class AttendanceModel(
    var studentId: String = "",
    var studentName: String = "",
    var status: String = "Absent"
) {
    fun toMap(): Map<String, Any?> {
        return mapOf(
            "studentId" to studentId,
            "studentName" to studentName,
            "status" to status
        )
    }
}
