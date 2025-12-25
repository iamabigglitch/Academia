package com.example.academia.repository

import com.example.academia.model.RoutineModel

interface RoutineRepo {

    fun addRoutine(
        routine: RoutineModel,
        callback: (Boolean, String) -> Unit
    )

    fun getAllRoutine(
        callback: (Boolean, String, List<RoutineModel>?) -> Unit
    )

    fun updateRoutine(
        routineId: String,
        routine: RoutineModel,
        callback: (Boolean, String) -> Unit
    )

    fun deleteRoutine(
        routineId: String,
        callback: (Boolean, String) -> Unit
    )
}
