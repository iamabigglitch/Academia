package com.example.academia.repository

import com.example.academia.model.RoutineModel
import com.google.firebase.database.*

class RoutineRepoImpl : RoutineRepo {

    private val database: FirebaseDatabase = FirebaseDatabase.getInstance()
    private val ref: DatabaseReference = database.getReference("routine")

    override fun addRoutine(
        routine: RoutineModel,
        callback: (Boolean, String) -> Unit
    ) {
        val routineId = ref.push().key ?: return
        routine.routineId = routineId

        ref.child(routineId).setValue(routine)
            .addOnCompleteListener {
                if (it.isSuccessful) {
                    callback(true, "Routine added")
                } else {
                    callback(false, it.exception?.message ?: "Error")
                }
            }
    }

    override fun getAllRoutine(
        callback: (Boolean, String, List<RoutineModel>?) -> Unit
    ) {
        ref.addListenerForSingleValueEvent(object : ValueEventListener {
            override fun onDataChange(snapshot: DataSnapshot) {
                val list = mutableListOf<RoutineModel>()
                for (child in snapshot.children) {
                    val routine = child.getValue(RoutineModel::class.java)
                    routine?.let { list.add(it) }
                }
                callback(true, "Success", list)
            }

            override fun onCancelled(error: DatabaseError) {
                callback(false, error.message, null)
            }
        })
    }

    override fun updateRoutine(
        routineId: String,
        routine: RoutineModel,
        callback: (Boolean, String) -> Unit
    ) {
        ref.child(routineId)
            .updateChildren(routine.toMap())
            .addOnCompleteListener {
                if (it.isSuccessful) {
                    callback(true, "Routine updated")
                } else {
                    callback(false, it.exception?.message ?: "Error")
                }
            }
    }

    override fun deleteRoutine(
        routineId: String,
        callback: (Boolean, String) -> Unit
    ) {
        ref.child(routineId).removeValue()
            .addOnCompleteListener {
                if (it.isSuccessful) {
                    callback(true, "Routine deleted")
                } else {
                    callback(false, it.exception?.message ?: "Error")
                }
            }
    }
}
