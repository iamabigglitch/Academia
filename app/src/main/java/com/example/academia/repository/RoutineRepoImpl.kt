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
        val routineId = ref.push().key.toString()
        routine.routineId = routineId

        ref.child(routineId)
            .setValue(routine)
            .addOnCompleteListener {
                if (it.isSuccessful) {
                    callback(true, "Routine added successfully")
                } else {
                    callback(false, it.exception?.message ?: "Failed to add routine")
                }
            }
    }

    override fun getRoutine(
        callback: (Boolean, String, List<RoutineModel>?) -> Unit
    ) {
        ref.addListenerForSingleValueEvent(object : ValueEventListener {

            override fun onDataChange(snapshot: DataSnapshot) {
                val routineList = mutableListOf<RoutineModel>()

                for (child in snapshot.children) {
                    val routine = child.getValue(RoutineModel::class.java)
                    routine?.let { routineList.add(it) }
                }

                callback(true, "Routine fetched successfully", routineList)
            }

            override fun onCancelled(error: DatabaseError) {
                callback(false, error.message, null)
            }
        })
    }

    override fun deleteRoutine(
        routineId: String,
        callback: (Boolean, String) -> Unit
    ) {
        ref.child(routineId)
            .removeValue()
            .addOnCompleteListener {
                if (it.isSuccessful) {
                    callback(true, "Routine deleted successfully")
                } else {
                    callback(false, it.exception?.message ?: "Failed to delete routine")
                }
            }
    }
}
