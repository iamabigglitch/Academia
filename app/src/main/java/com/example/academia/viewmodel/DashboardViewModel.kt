package com.example.academia.viewmodel

import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.ViewModel
import androidx.compose.runtime.State

class DashboardViewModel : ViewModel() {

    // Selected bottom navigation index
    private val _selectedTabIndex = mutableStateOf(0)
    val selectedTabIndex: State<Int> = _selectedTabIndex

    fun changeTab(index: Int) {
        _selectedTabIndex.value = index
    }

    // Feed posts
    val feedPosts = mutableStateListOf<String>()

    // Attendance history
    val attendanceHistory = mutableStateListOf<String>()

    // Home quick stats
    val homeStats = mutableStateListOf<String>()

    init {
        loadFeed()
        loadAttendance()
        loadHomeStats()
    }

    private fun loadFeed() {
        feedPosts.clear()
        feedPosts.addAll(
            listOf(
                "New course on Kotlin is available!",
                "Don't forget to submit your assignment by Friday",
                "Campus event: Science Fair tomorrow!"
            )
        )
    }

    private fun loadAttendance() {
        attendanceHistory.clear()
        attendanceHistory.addAll(
            listOf(
                "12-Dec: Present",
                "13-Dec: Absent",
                "14-Dec: Present",
                "15-Dec: Present"
            )
        )
    }

    private fun loadHomeStats() {
        homeStats.clear()
        homeStats.addAll(
            listOf(
                "Today's Classes: 3",
                "Pending Assignments: 2",
                "Upcoming Event: Science Fair"
            )
        )
    }

    fun markTodayAttendance(status: String) {
        val today = "16-Dec: $status"
        attendanceHistory.add(0, today)
    }
}
