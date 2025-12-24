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

// Sample Course data class (only subject)
data class CourseSample(val subjectName: String)

@Composable
@Preview

fun CourseScreen() {
    val courses = listOf(
        CourseSample("Math"),
        CourseSample("Science"),
        CourseSample("English"),
        CourseSample("History")
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text("Courses", fontSize = 22.sp, fontWeight = FontWeight.Bold)

        LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            items(courses) { course ->
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color(0xFFD6ECFF), RoundedCornerShape(16.dp))
                        .clickable { /* Placeholder */ }
                        .padding(16.dp)
                ) {
                    Text(course.subjectName, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}
