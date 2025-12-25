package com.example.academia.model

data class CourseModel(
    var courseId: String = "",
    var subjectName: String = "",
    var date: String = ""
) {
    fun toMap(): Map<String, Any?> {
        return mapOf(
            "courseId" to courseId,
            "subjectName" to subjectName,
            "date" to date
        )
    }
}
