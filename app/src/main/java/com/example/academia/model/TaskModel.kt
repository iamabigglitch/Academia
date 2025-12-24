package com.example.academia.model

data class TaskModel (
    val taskId: String = "",
    val title: String = "",
    val description: String = "",
    val courseId: String = "",
    val teacherId: String = "",
    val dueDate: String = "",
    val createdAt: Long = System.currentTimeMillis()
    ) {
        fun toMap(): Map<String, Any?> {
            return mapOf(
                "taskId" to taskId,
                "title" to title,
                "description" to description,
                "courseId" to courseId,
                "teacherId" to teacherId,
                "dueDate" to dueDate,
                "createdAt" to createdAt
            )
        }
    }

