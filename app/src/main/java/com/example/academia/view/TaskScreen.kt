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

// Sample Task data class for UI
data class TaskSample(val title: String, val description: String)

@Composable
@Preview

fun TaskScreen() {
    val tasks = listOf(
        TaskSample("Complete Assignment", "Math assignment"),
        TaskSample("Revise Notes", "Science notes"),
        TaskSample("Prepare Project", "History project")
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text("Tasks", fontSize = 22.sp, fontWeight = FontWeight.Bold)

        LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            items(tasks) { task ->
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color(0xFFFFE0E6), RoundedCornerShape(16.dp))
                        .clickable { /* Placeholder: click task */ }
                        .padding(16.dp)
                ) {
                    Column {
                        Text(task.title, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                        Text(task.description, fontSize = 14.sp, color = Color.DarkGray)
                    }
                }
            }
        }
    }
}
