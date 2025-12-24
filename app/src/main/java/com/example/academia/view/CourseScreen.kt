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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.academia.model.CourseModel
import com.example.academia.repository.CourseRepoImpl
import com.example.academia.viewmodel.CourseViewModel

@Composable
@Preview

fun CourseScreen() {

    val courseViewModel = remember { CourseViewModel(CourseRepoImpl()) }
    var courses by remember { mutableStateOf<List<CourseModel>>(emptyList()) }

    LaunchedEffect(Unit) {
        courseViewModel.getAllCourses { list ->
            courses = list ?: emptyList()
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = "Courses",
            fontSize = 22.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 12.dp)
        )

        if (courses.isEmpty()) {
            Text(text = "No courses available", color = Color.Gray)
        } else {
            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(courses) { course ->
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(color = Color(0xFFD6ECFF), shape = RoundedCornerShape(16.dp))
                            .clickable { /* Open course details */ }
                            .padding(16.dp)
                    ) {
                        Column {
                            Text(text = course.courseName, fontWeight = FontWeight.Bold, fontSize = 18.sp)
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(text = "Teacher: ${course.teacherName}", fontSize = 14.sp, color = Color.DarkGray)
                            Text(text = "Time: ${course.classTime}", fontSize = 14.sp, color = Color.DarkGray)
                        }
                    }
                }
            }
        }
    }
}
