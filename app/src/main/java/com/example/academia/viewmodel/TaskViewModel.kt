package com.example.academia.viewmodel

import androidx.lifecycle.ViewModel
import com.example.academia.model.TaskModel
import com.example.academia.repository.TaskRepo


class TaskViewModel (val repo: TaskRepo): ViewModel() {

    fun addTask(
        task: TaskModel,
        callback: (Boolean, String) -> Unit
    ) {
        repo.addTask(task, callback)
    }

    fun getAllTasks(
        callback: (List<TaskModel>?) -> Unit
    ) {
        repo.getAllTasks { success, _, tasks ->
            callback(if (success) tasks else null)
        }
    }

    fun getTasksByCourse(
        courseId: String,
        callback: (List<TaskModel>?) -> Unit
    ) {
        repo.getTasksByCourse(courseId) { success, _, tasks ->
            callback(if (success) tasks else null)
        }
    }

    fun deleteTask(
        taskId: String,
        callback: (Boolean, String) -> Unit
    ) {
        repo.deleteTask(taskId, callback)
    }
}