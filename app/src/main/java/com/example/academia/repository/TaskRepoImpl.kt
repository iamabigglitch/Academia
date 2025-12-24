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
        val taskId = ref.push().key.toString()
        task.taskId = taskId

        ref.child(taskId)
            .setValue(task.toMap())
            .addOnCompleteListener {
                if (it.isSuccessful) {
                    callback(true, "Task added")
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
                val list = mutableListOf<TaskModel>()

                for (child in snapshot.children) {
                    val model = child.getValue(TaskModel::class.java)
                    model?.let { list.add(it) }
                }

                callback(true, "Success", list)
            }

            override fun onCancelled(error: DatabaseError) {
                callback(false, error.message, null)
            }
        })
    }

    override fun deleteTask(
        taskId: String,
        callback: (Boolean, String) -> Unit
    ) {
        ref.child(taskId)
            .removeValue()
            .addOnCompleteListener {
                if (it.isSuccessful) {
                    callback(true, "Task deleted")
                } else {
                    callback(false, it.exception?.message ?: "Error")
                }
            }
    }
}
