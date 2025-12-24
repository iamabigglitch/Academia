package com.example.academia.viewmodel

import androidx.lifecycle.ViewModel
import com.example.academia.model.AttendanceModel
import com.example.academia.repository.AttendanceRepo

class AttendanceViewModel(
    private val repo: AttendanceRepo
) : ViewModel() {

    fun getAttendance(
        callback: (List<AttendanceModel>?) -> Unit
    ) {
        repo.getAttendance { success, _, list ->
            if (success) callback(list) else callback(emptyList())
        }
    }

    fun markAttendance(
        studentId: String,
        callback: (Boolean, String) -> Unit
    ) {
        repo.markAttendance(studentId, callback)
    }
}
