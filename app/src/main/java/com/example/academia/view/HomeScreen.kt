package com.example.academia.view

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.academia.model.CourseModel
import com.example.academia.model.TaskModel
import com.example.academia.repository.CourseRepoImpl
import com.example.academia.repository.TaskRepoImpl
import com.example.academia.viewmodel.CourseViewModel
import com.example.academia.viewmodel.TaskViewModel
import com.example.academia.utils.SessionManager
import com.example.academia.utils.UserRole
import java.text.SimpleDateFormat
import java.util.*

@Composable
@Preview
fun HomeScreen(
    onAttendanceClick: () -> Unit = {},
    onRoutineClick: () -> Unit = {}
) {
    val role = SessionManager.userRole

    // Greeting + Date
    val calendar = Calendar.getInstance()
    val hour = calendar.get(Calendar.HOUR_OF_DAY)
    val greeting = when {
        hour < 12 -> "Good Morning"
        hour < 17 -> "Good Afternoon"
        else -> "Good Evening"
    }
    val currentDateTime = SimpleDateFormat("dd MMM yyyy • hh:mm a", Locale.getDefault())
        .format(calendar.time)

    val courseViewModel = remember { CourseViewModel(CourseRepoImpl()) }
    val taskViewModel = remember { TaskViewModel(TaskRepoImpl()) }

    var courseList by remember { mutableStateOf<List<CourseModel>>(emptyList()) }
    var taskList by remember { mutableStateOf<List<TaskModel>>(emptyList()) }

    LaunchedEffect(Unit) {
        courseViewModel.getAllCourses { success, _, list -> courseList = list ?: emptyList() }
        taskViewModel.getAllTasks { success, _, list -> taskList = list ?: emptyList() }
    }

    Column(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // White box: Greeting + Today’s Class + Tasks
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .shadow(8.dp, RoundedCornerShape(20.dp))
                .background(Color.White, RoundedCornerShape(20.dp))
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Text(greeting, fontSize = 22.sp, fontWeight = FontWeight.Bold)
            Text(currentDateTime, fontSize = 14.sp, color = Color.Gray)

            // Today’s Class
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color(0xFFD6ECFF), RoundedCornerShape(16.dp))
                    .padding(12.dp)
            ) {
                Text("Today's Class", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                if (courseList.isEmpty()) Text("No classes today", fontSize = 14.sp, color = Color.Gray)
                else courseList.forEach { Text("• ${it.subjectName}", fontSize = 14.sp, color = Color.DarkGray) }
            }

            // Today’s Tasks
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color(0xFFFFE0E6), RoundedCornerShape(16.dp))
                    .padding(12.dp)
            ) {
                Text("Today's Tasks", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                if (taskList.isEmpty()) Text("No tasks assigned", color = Color.Gray, fontSize = 14.sp)
                else taskList.forEach { Text("• ${it.title}", fontSize = 14.sp, color = Color.DarkGray) }
            }
        }

        // Attendance button
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFFD6ECFF), RoundedCornerShape(16.dp))
                .clickable { onAttendanceClick() }
                .padding(16.dp)
        ) { Text("Attendance", fontWeight = FontWeight.Bold, fontSize = 18.sp) }

        // Routine button
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFFFFF3E0), RoundedCornerShape(16.dp))
                .clickable { onRoutineClick() }
                .padding(16.dp)
        ) { Text("Routine", fontWeight = FontWeight.Bold, fontSize = 18.sp) }
    }
}
