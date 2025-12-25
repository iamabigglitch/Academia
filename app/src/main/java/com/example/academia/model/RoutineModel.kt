package com.example.academia.model

data class RoutineModel(
    var routineId: String = "",
    var subject: String = "",
    var time: String = ""
) {
    fun toMap(): Map<String, Any?> {
        return mapOf(
            "routineId" to routineId,
            "subject" to subject,
            "time" to time
        )
    }
}
