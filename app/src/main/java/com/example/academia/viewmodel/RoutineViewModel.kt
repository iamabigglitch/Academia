package com.example.academia.viewmodel

import androidx.lifecycle.ViewModel
import com.example.academia.model.RoutineModel
import com.example.academia.repository.RoutineRepoImpl

class RoutineViewModel(val repo: RoutineRepoImpl = RoutineRepoImpl()) : ViewModel() {

    // Fetch routine list
    fun getRoutine(callback: (List<RoutineModel>?) -> Unit) {
        repo.getAllRoutine { success, _, list ->
            if (success) callback(list)
            else callback(emptyList())
        }
    }

    // Add or update routine
    fun addRoutine(routine: RoutineModel, callback: ((Boolean, String) -> Unit)? = null) {
        repo.addRoutine(routine) { success, message ->
            callback?.invoke(success, message)
        }
    }
}
