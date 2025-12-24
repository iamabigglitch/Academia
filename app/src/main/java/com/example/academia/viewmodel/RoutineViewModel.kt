package com.example.academia.viewmodel

import androidx.lifecycle.ViewModel
import com.example.academia.model.RoutineModel
import com.example.academia.repository.RoutineRepo

class RoutineViewModel(
    private val repo: RoutineRepo
) : ViewModel() {

    fun addRoutine(
        time: String,
        subject: String,
        callback: (Boolean, String) -> Unit
    ) {
        val routine = RoutineModel(
            time = time,
            subject = subject
        )
        repo.addRoutine(routine, callback)
    }

    fun getRoutine(
        callback: (List<RoutineModel>?) -> Unit
    ) {
        repo.getRoutine { success, _, list ->
            if (success) callback(list) else callback(emptyList())
        }
    }

    fun deleteRoutine(
        routineId: String,
        callback: (Boolean, String) -> Unit
    ) {
        repo.deleteRoutine(routineId, callback)
    }
}
