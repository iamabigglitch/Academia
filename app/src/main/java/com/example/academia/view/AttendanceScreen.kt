package com.example.academia.view

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import com.example.academia.utils.SessionManager
import com.example.academia.utils.UserRole

// Sample Student attendance data class
data class StudentAttendance(val studentName: String, val status: String)

@Composable
@Preview

fun AttendanceScreen(
    attendanceList: List<StudentAttendance> = listOf(
        StudentAttendance("Smarika Sitaula", "Present"),
        StudentAttendance("Shasank Karki", "Absent"),
        StudentAttendance("Nikita Kc", "Present"),
        StudentAttendance("Pravisht Ghimire", "Present")
    ),
    onMarkAttendance: (String) -> Unit = {}
) {
    val role = SessionManager.userRole

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {

        // Header Row
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFF1F2B44))
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text("Name", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.White)
            Text("Status", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.White)
        }

        // Attendance List
        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(attendanceList) { att ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color(0xFFF5F1F1), RoundedCornerShape(20.dp))
                        .clickable(enabled = role == UserRole.TEACHER) {
                            if (role == UserRole.TEACHER) {
                                onMarkAttendance(att.studentName)
                            }
                        }
                        .padding(vertical = 20.dp, horizontal = 16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(att.studentName, fontSize = 16.sp)
                    Text(
                        att.status,
                        fontSize = 16.sp,
                        color = if (att.status == "Present") Color.Green else Color.Red,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
    }
}
