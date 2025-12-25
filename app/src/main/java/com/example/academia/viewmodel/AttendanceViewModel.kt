package com.example.academia.viewmodel

import androidx.lifecycle.ViewModel
import com.example.academia.model.AttendanceModel
import com.example.academia.repository.AttendanceRepo
import com.example.academia.repository.AttendanceRepoImpl

class AttendanceViewModel(
    private val repo: AttendanceRepo = AttendanceRepoImpl()
) : ViewModel() {

    // Fetch all attendance records
    fun getAllAttendance(callback: (Boolean, String, List<AttendanceModel>?) -> Unit) {
        repo.getAllAttendance(callback)
    }

    // Update attendance (toggle Present/Absent)
    fun updateAttendance(
        attendanceId: String,
        updatedAttendance: AttendanceModel,
        callback: (Boolean, String) -> Unit
    ) {
        repo.updateAttendance(attendanceId, updatedAttendance, callback)
    }
}
