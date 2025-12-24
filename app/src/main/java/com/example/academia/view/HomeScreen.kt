package com.example.academia.view

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
@Preview

fun HomeScreen(
    onAttendanceClick: () -> Unit = {},
    onRoutineClick: () -> Unit = {}
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // White Box
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color.White, RoundedCornerShape(20.dp))
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Text("Good Morning, Jay Jay", fontSize = 22.sp, fontWeight = FontWeight.Bold)
            Text("Today • 24 Dec 2025 • 10:00 AM", fontSize = 14.sp, color = Color.Gray)

            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color(0xFFD6ECFF), RoundedCornerShape(16.dp))
                    .padding(12.dp)
            ) {
                Text("Today's Class", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                Text("Math - Mr. Sharma • 10:00 AM", fontSize = 14.sp, color = Color.DarkGray)
            }

            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color(0xFFFFE0E6), RoundedCornerShape(16.dp))
                    .padding(12.dp)
            ) {
                Text("Today's Tasks", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                Text("• Complete Assignment\n• Revise Notes", fontSize = 14.sp, color = Color.DarkGray)
            }
        }

        // Attendance Box
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFF8BC78E), RoundedCornerShape(16.dp))
                .clickable { onAttendanceClick() }
                .padding(16.dp)
        ) {
            Text("Attendance", fontWeight = FontWeight.Bold, fontSize = 18.sp)
        }

        // Routine Box
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFFD0C683), RoundedCornerShape(16.dp))
                .clickable { onRoutineClick() }
                .padding(16.dp)
        ) {
            Text("Routine", fontWeight = FontWeight.Bold, fontSize = 18.sp)
        }
    }
}
