package com.example.academia.repository

import com.example.academia.model.TaskModel
import com.google.firebase.database.FirebaseDatabase

class TaskRepoImpl : TaskRepo {

    private val db = FirebaseDatabase.getInstance().getReference("tasks")

    override fun addTask(
        task: TaskModel,
        callback: (Boolean, String) -> Unit
    ) {
        val taskId = db.push().key ?: return
        val newTask = task.copy(taskId = taskId)

        db.child(taskId)
            .setValue(newTask.toMap())
            .addOnSuccessListener {
                callback(true, "Task added successfully")
            }
            .addOnFailureListener {
                callback(false, it.message ?: "Failed to add task")
            }
    }

    override fun getAllTasks(
        callback: (Boolean, String, List<TaskModel>?) -> Unit
    ) {
        db.get()
            .addOnSuccessListener { snapshot ->
                val tasks = snapshot.children.mapNotNull {
                    it.getValue(TaskModel::class.java)
                }
                callback(true, "Success", tasks)
            }
            .addOnFailureListener {
                callback(false, it.message ?: "Error", null)
            }
    }

    override fun getTasksByCourse(
        courseId: String,
        callback: (Boolean, String, List<TaskModel>?) -> Unit
    ) {
        db.orderByChild("courseId")
            .equalTo(courseId)
            .get()
            .addOnSuccessListener { snapshot ->
                val tasks = snapshot.children.mapNotNull {
                    it.getValue(TaskModel::class.java)
                }
                callback(true, "Success", tasks)
            }
            .addOnFailureListener {
                callback(false, it.message ?: "Error", null)
            }
    }

    override fun deleteTask(
        taskId: String,
        callback: (Boolean, String) -> Unit
    ) {
        db.child(taskId)
            .removeValue()
            .addOnSuccessListener {
                callback(true, "Task deleted")
            }
            .addOnFailureListener {
                callback(false, it.message ?: "Delete failed")
            }
    }
}