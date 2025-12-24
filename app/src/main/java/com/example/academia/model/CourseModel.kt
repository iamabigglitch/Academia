package com.example.academia.model

data class CourseModel(
    var courseId: String = "",
    var courseName: String = "",
    var teacherName: String = "",
    var classTime: String = ""
    ) {

    // Converts object to Map (useful for Firebase update)
    fun toMap(): Map<String, Any?> {
        return mapOf(
            "courseId" to courseId,
            "courseName" to courseName,
            "teacherName" to teacherName,
            "classTime" to classTime
        )
    }
}
