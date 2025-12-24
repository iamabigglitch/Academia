package com.example.academia.model

data class RoutineModel(
    var routineId: String = "",
    var time: String = "",
    var subject: String = ""
) {
    fun toMap(): Map<String, Any?> {
        return mapOf(
            "routineId" to routineId,
            "time" to time,
            "subject" to subject
        )
    }
}
