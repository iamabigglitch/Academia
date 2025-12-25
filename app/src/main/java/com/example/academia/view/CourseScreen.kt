package com.example.academia.view

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import android.widget.Toast
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.tooling.preview.Preview
import com.example.academia.model.CourseModel
import com.example.academia.utils.SessionManager
import com.example.academia.utils.UserRole
import com.example.academia.viewmodel.CourseViewModel

@Composable
@Preview

fun CourseScreen() {
    val viewModel = CourseViewModel()
    val context = LocalContext.current
    val role = SessionManager.userRole
    var courseList by remember { mutableStateOf(listOf<CourseModel>()) }

    // Load courses
    LaunchedEffect(Unit) {
        viewModel.getAllCourses { success, _, list ->
            if (success && list != null) courseList = list
            else courseList = listOf()
        }
    }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("Courses")

        Spacer(modifier = Modifier.height(16.dp))

        if (courseList.isEmpty()) {
            Text("No courses available", color = Color.Gray)
        } else {
            LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                items(courseList) { course ->
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(Color(0xFFD6ECFF), RoundedCornerShape(12.dp))
                            .clickable(enabled = role == UserRole.TEACHER) {
                                // Teacher update example
                                Toast.makeText(
                                    context,
                                    "Clicked to update ${course.subjectName}",
                                    Toast.LENGTH_SHORT
                                ).show()
                            }
                            .padding(16.dp)
                    ) {
                        Text(course.subjectName)
                    }
                }
            }
        }
    }
}
