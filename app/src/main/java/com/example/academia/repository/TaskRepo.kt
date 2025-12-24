package com.example.academia.repository

import com.example.academia.model.TaskModel

interface TaskRepo {

    fun addTask(
        task: TaskModel,
        callback: (Boolean, String) -> Unit
    )

    fun getAllTasks(
        callback: (Boolean, String, List<TaskModel>?) -> Unit
    )

    fun deleteTask(
        taskId: String,
        callback: (Boolean, String) -> Unit
    )
}
