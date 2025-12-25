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
import com.example.academia.model.CourseModel
import com.example.academia.repository.CourseRepoImpl
import com.example.academia.utils.SessionManager
import com.example.academia.utils.UserRole
import com.example.academia.viewmodel.CourseViewModel

@Composable
@Preview

fun CourseScreen() {
    val context = LocalContext.current
    val role = SessionManager.userRole

    val viewModel = remember { CourseViewModel(CourseRepoImpl()) }
    var courses by remember { mutableStateOf<List<CourseModel>>(emptyList()) }

    LaunchedEffect(Unit) {
        viewModel.getAllCourses { _, _, list ->
            courses = list ?: emptyList()
        }
    }

    Column(Modifier.fillMaxSize().padding(16.dp)) {
        Text("Courses", fontSize = 22.sp, fontWeight = FontWeight.Bold)
        Spacer(Modifier.height(12.dp))

        if (courses.isEmpty()) {
            Text("No courses available", color = Color.Gray)
        } else {
            LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                items(courses) { course ->
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(Color(0xFFD6ECFF), RoundedCornerShape(16.dp))
                            .clickable(enabled = role == UserRole.TEACHER) {
                                Toast.makeText(
                                    context,
                                    "Edit course: ${course.subjectName}",
                                    Toast.LENGTH_SHORT
                                ).show()
                            }
                            .padding(16.dp)
                    ) {
                        Text(course.subjectName, fontSize = 16.sp)
                    }
                }
            }
        }
    }
}
