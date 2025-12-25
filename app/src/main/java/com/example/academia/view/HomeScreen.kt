package com.example.academia.view

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.academia.model.CourseModel
import com.example.academia.model.TaskModel
import com.example.academia.viewmodel.CourseViewModel
import com.example.academia.viewmodel.TaskViewModel
import java.text.SimpleDateFormat
import java.util.*

@Composable
@Preview

fun HomeScreen() {
    val context = LocalContext.current
    val courseViewModel = CourseViewModel()
    val taskViewModel = TaskViewModel()

    var courses by remember { mutableStateOf(listOf<CourseModel>()) }
    var tasks by remember { mutableStateOf(listOf<TaskModel>()) }

    // Load today's courses & tasks
    LaunchedEffect(Unit) {
        courseViewModel.getAllCourses { success, _, list ->
            courses = if (success && list != null) list else emptyList()
        }
        taskViewModel.getAllTasks { success, _, list ->
            tasks = if (success && list != null) list else emptyList()
        }
    }

    // Today's date
    val dateFormat = SimpleDateFormat("EEE, MMM d, yyyy", Locale.getDefault())
    val todayDate = dateFormat.format(Date())

    Column(modifier = Modifier
        .fillMaxSize()
        .padding(16.dp)) {

        // Big white box
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color.White, RoundedCornerShape(16.dp))
                .padding(16.dp)
        ) {
            Column {
                Text("Hello!", fontSize = 22.sp, color = Color.Black)
                Text("Today: $todayDate", fontSize = 16.sp, color = Color.Gray)

                Spacer(modifier = Modifier.height(16.dp))

                // Two boxes: Today's Classes and Today's Tasks
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {

                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .background(Color(0xFFD6ECFF), RoundedCornerShape(12.dp))
                            .padding(16.dp)
                    ) {
                        Text("Today's Classes: ${courses.size}")
                    }

                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .background(Color(0xFFFFE0E6), RoundedCornerShape(12.dp))
                            .padding(16.dp)
                    ) {
                        Text("Today's Tasks: ${tasks.size}")
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Two boxes: Attendance and Routine
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {

            Box(
                modifier = Modifier
                    .weight(1f)
                    .background(Color(0xFFD6FFEC), RoundedCornerShape(12.dp))
                    .clickable {
                        Toast.makeText(context, "Opening Attendance Screen", Toast.LENGTH_SHORT).show()
                        // Navigate to AttendanceScreen
                    }
                    .padding(16.dp),
                contentAlignment = Alignment.Center
            ) {
                Text("Attendance")
            }

            Box(
                modifier = Modifier
                    .weight(1f)
                    .background(Color(0xFFFFF3D6), RoundedCornerShape(12.dp))
                    .clickable {
                        Toast.makeText(context, "Opening Routine Screen", Toast.LENGTH_SHORT).show()
                        // Navigate to RoutineScreen
                    }
                    .padding(16.dp),
                contentAlignment = Alignment.Center
            ) {
                Text("Routine")
            }
        }
    }
}
