package com.example.academia.view

import androidx.compose.foundation.background
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

// Sample Routine data class
data class RoutineItem(val time: String, val subject: String)

@Composable
@Preview

fun RoutineScreen(
    routineList: List<RoutineItem> = listOf(
        RoutineItem("10:00 AM", "Math"),
        RoutineItem("11:00 AM", "Science"),
        RoutineItem("12:00 PM", "English"),
        RoutineItem("01:00 PM", "History")
    )
) {
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
            Text("Time", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.White)
            Text("Subject", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.White)
        }

        // Routine List
        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(routineList) { item ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color(0xFFEFE9E9), RoundedCornerShape(20.dp))
                        .padding(vertical = 20.dp, horizontal = 16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(item.time, fontSize = 16.sp)
                    Text(item.subject, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}
