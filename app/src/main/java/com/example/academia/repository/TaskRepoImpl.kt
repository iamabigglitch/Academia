package com.example.academia.repository

import com.example.academia.model.TaskModel
import com.google.firebase.database.*

class TaskRepoImpl : TaskRepo {

    private val database: FirebaseDatabase = FirebaseDatabase.getInstance()
    private val ref: DatabaseReference = database.getReference("tasks")

    override fun addTask(
        task: TaskModel,
        callback: (Boolean, String) -> Unit
    ) {
        val taskId = ref.push().key ?: return
        task.taskId = taskId

        ref.child(taskId).setValue(task)
            .addOnCompleteListener {
                if (it.isSuccessful) {
                    callback(true, "Task added successfully")
                } else {
                    callback(false, it.exception?.message ?: "Error")
                }
            }
    }

    override fun getAllTasks(
        callback: (Boolean, String, List<TaskModel>?) -> Unit
    ) {
        ref.addListenerForSingleValueEvent(object : ValueEventListener {
            override fun onDataChange(snapshot: DataSnapshot) {
                val taskList = mutableListOf<TaskModel>()
                for (child in snapshot.children) {
                    val task = child.getValue(TaskModel::class.java)
                    task?.let { taskList.add(it) }
                }
                callback(true, "Success", taskList)
            }

            override fun onCancelled(error: DatabaseError) {
                callback(false, error.message, null)
            }
        })
    }

    override fun updateTask(
        taskId: String,
        task: TaskModel,
        callback: (Boolean, String) -> Unit
    ) {
        ref.child(taskId).updateChildren(task.toMap())
            .addOnCompleteListener {
                if (it.isSuccessful) {
                    callback(true, "Task updated")
                } else {
                    callback(false, it.exception?.message ?: "Error")
                }
            }
    }

    override fun deleteTask(
        taskId: String,
        callback: (Boolean, String) -> Unit
    ) {
        ref.child(taskId).removeValue()
            .addOnCompleteListener {
                if (it.isSuccessful) {
                    callback(true, "Task deleted")
                } else {
                    callback(false, it.exception?.message ?: "Error")
                }
            }
    }
}
