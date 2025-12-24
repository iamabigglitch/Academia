package com.example.academia.view

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.academia.model.TaskModel
import com.example.academia.repository.TaskRepoImpl
import com.example.academia.viewmodel.TaskViewModel

@Composable
fun TaskScreen() {

    val taskViewModel = remember { TaskViewModel(TaskRepoImpl()) }
    var tasks by remember { mutableStateOf<List<TaskModel>>(emptyList()) }

    LaunchedEffect(Unit) {
        taskViewModel.getAllTasks { list ->
            tasks = list ?: emptyList()
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = "Tasks",
            fontSize = 22.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 12.dp)
        )

        if (tasks.isEmpty()) {
            Text(text = "No tasks assigned", color = Color.Gray)
        } else {
            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(tasks) { task ->
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(color = Color(0xFFFFE0E6), shape = RoundedCornerShape(16.dp))
                            .padding(16.dp)
                    ) {
                        Column {
                            Text(text = task.title, fontWeight = FontWeight.Bold, fontSize = 18.sp)
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(text = task.description, fontSize = 14.sp, color = Color.DarkGray)
                            Text(text = "Due: ${task.dueDate}", fontSize = 12.sp, color = Color.Gray)
                        }
                    }
                }
            }
        }
    }
}
