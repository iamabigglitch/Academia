package com.example.academia.view

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.example.academia.model.AttendanceModel
import com.example.academia.viewmodel.AttendanceViewModel

@Composable
@Preview

fun AttendanceScreen() {
    val viewModel = AttendanceViewModel()
    val context = LocalContext.current

    var attendanceList by remember { mutableStateOf(listOf<AttendanceModel>()) }

    // Load attendance data
    LaunchedEffect(Unit) {
        viewModel.getAllAttendance { success, _, list ->
            if (success) attendanceList = list ?: listOf()
        }
    }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("Attendance")

        Spacer(modifier = Modifier.height(16.dp))

        if (attendanceList.isEmpty()) {
            Text("No attendance records yet", color = Color.Gray)
        } else {
            LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                items(attendanceList) { att ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(
                                color = if (att.status == "Present") Color(0xFFD6ECFF)
                                else
                                    Color(0xFFFFE0E6),
                                shape = RoundedCornerShape(12.dp)
                            )
                            .padding(16.dp)
                            .clickable {
                                // Toggle Present/Absent
                                val updatedStatus = if (att.status == "Present") "Absent" else "Present"
                                val updatedAtt = att.copy(status = updatedStatus)

                                viewModel.updateAttendance(att.attendanceId, updatedAtt) { success, msg ->
                                    Toast.makeText(context, msg, Toast.LENGTH_SHORT).show()
                                    if (success) {
                                        attendanceList = attendanceList.map {
                                            if (it.attendanceId == att.attendanceId) updatedAtt else it
                                        }
                                    }
                                }
                            },
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(att.studentName)
                        Text(att.status)
                    }
                }
            }
        }
    }
}
