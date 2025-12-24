package com.example.academia.viewmodel

import androidx.lifecycle.ViewModel
import com.example.academia.model.TaskModel
import com.example.academia.repository.TaskRepo

class TaskViewModel(
    private val repo: TaskRepo
) : ViewModel() {

    fun addTask(
        title: String,
        description: String,
        dueDate: String,
        callback: (Boolean, String) -> Unit
    ) {
        val task = TaskModel(
            title = title,
            description = description,
            dueDate = dueDate
        )
        repo.addTask(task, callback)
    }

    fun getAllTasks(
        callback: (List<TaskModel>?) -> Unit
    ) {
        repo.getAllTasks { success, _, list ->
            if (success) callback(list) else callback(emptyList())
        }
    }

    fun deleteTask(
        taskId: String,
        callback: (Boolean, String) -> Unit
    ) {
        repo.deleteTask(taskId, callback)
    }
}
