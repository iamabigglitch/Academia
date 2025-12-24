package com.example.academia.view

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
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
import java.text.SimpleDateFormat
import java.util.*

@Composable
@Preview

fun HomeScreen() {

    val calendar = Calendar.getInstance()
    val hour = calendar.get(Calendar.HOUR_OF_DAY)

    val greeting = when {
        hour < 12 -> "Good Morning"
        hour < 17 -> "Good Afternoon"
        else -> "Good Evening"
    }

    val currentDateTime = remember {
        SimpleDateFormat(
            "dd MMM yyyy • hh:mm a",
            Locale.getDefault()
        ).format(calendar.time)
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .shadow(12.dp, RoundedCornerShape(24.dp))
            .background(Color.White, RoundedCornerShape(24.dp))
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {

        Column {
            Text(greeting, fontSize = 22.sp, fontWeight = FontWeight.Bold)
            Text(currentDateTime, fontSize = 14.sp, color = Color.DarkGray)
        }

        InfoCard(
            title = "Today's Class",
            description = "No class scheduled",
            background = Color(0xFFD6ECFF)
        )

        InfoCard(
            title = "Today's Tasks",
            description = "No tasks due today",
            background = Color(0xFFFFE0E6)
        )
    }
}

@Composable
fun InfoCard(
    title: String,
    description: String,
    background: Color
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .background(background, RoundedCornerShape(16.dp))
            .padding(16.dp)
    ) {
        Column {
            Text(title, fontWeight = FontWeight.Bold)
            Text(description, color = Color.DarkGray)
        }
    }
}
