package com.example.academia.view

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.example.academia.model.TaskModel
import com.example.academia.viewmodel.TaskViewModel

@Composable
@Preview

fun TaskScreen() {
    val viewModel = TaskViewModel()
    var taskList by remember { mutableStateOf(listOf<TaskModel>()) }

    // Load tasks
    LaunchedEffect(Unit) {
        viewModel.getAllTasks { success, _, list ->
            if (success && list != null) {
                taskList = list
            } else {
                taskList = listOf()
            }
        }
    }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("Tasks")

        Spacer(modifier = Modifier.height(16.dp))

        if (taskList.isEmpty()) {
            Text("No tasks available", color = Color.Gray)
        } else {
            LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                items(taskList) { task ->
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(Color(0xFFFFE0E6), RoundedCornerShape(12.dp))
                            .padding(16.dp)
                    ) {
                        Text("${task.title} • Due: ${task.dueDate}")
                    }
                }
            }
        }
    }
}
