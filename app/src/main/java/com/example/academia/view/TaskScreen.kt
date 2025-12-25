package com.example.academia.view

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.academia.model.TaskModel
import com.example.academia.repository.TaskRepoImpl
import com.example.academia.utils.SessionManager
import com.example.academia.utils.UserRole
import com.example.academia.viewmodel.TaskViewModel

@Composable
@Preview

fun TaskScreen() {
    val context = LocalContext.current
    val role = SessionManager.userRole

    val viewModel = remember { TaskViewModel(TaskRepoImpl()) }
    var tasks by remember { mutableStateOf<List<TaskModel>>(emptyList()) }

    LaunchedEffect(Unit) {
        viewModel.getAllTasks { _, _, list ->
            tasks = list ?: emptyList()
        }
    }

    Column(Modifier.fillMaxSize().padding(16.dp)) {
        Text("Tasks", fontSize = 22.sp, fontWeight = FontWeight.Bold)
        Spacer(Modifier.height(12.dp))

        if (tasks.isEmpty()) {
            Text("No tasks assigned", color = Color.Gray)
        } else {
            LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                items(tasks) { task ->
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(Color(0xFFFFE0E6), RoundedCornerShape(16.dp))
                            .clickable(enabled = role == UserRole.TEACHER) {
                                Toast.makeText(
                                    context,
                                    "Edit task: ${task.title}",
                                    Toast.LENGTH_SHORT
                                ).show()
                            }
                            .padding(16.dp)
                    ) {
                        Column {
                            Text(task.title, fontWeight = FontWeight.Medium)
                            Text(task.dueDate, fontSize = 12.sp, color = Color.Gray)
                        }
                    }
                }
            }
        }
    }
}
