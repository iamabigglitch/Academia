package com.example.academia.model

data class TaskModel(
    var taskId: String = "",
    var title: String = "",
    var description: String = "",
    var dueDate: String = ""
) {
    fun toMap(): Map<String, Any?> {
        return mapOf(
            "taskId" to taskId,
            "title" to title,
            "description" to description,
            "dueDate" to dueDate
        )
    }
}
