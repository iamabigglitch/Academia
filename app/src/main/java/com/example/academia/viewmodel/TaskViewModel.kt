package com.example.academia.viewmodel

import androidx.lifecycle.ViewModel
import com.example.academia.model.TaskModel
import com.example.academia.repository.TaskRepo
import com.example.academia.repository.TaskRepoImpl

class TaskViewModel(
    private val repo: TaskRepo = TaskRepoImpl()
) : ViewModel() {

    // Fetch all tasks
    fun getAllTasks(callback: (Boolean, String, List<TaskModel>?) -> Unit) {
        repo.getAllTasks(callback)
    }

    // Update a task (optional, for teachers)
    fun updateTask(
        taskId: String,
        updatedTask: TaskModel,
        callback: (Boolean, String) -> Unit
    ) {
        repo.updateTask(taskId, updatedTask, callback)
    }
}
