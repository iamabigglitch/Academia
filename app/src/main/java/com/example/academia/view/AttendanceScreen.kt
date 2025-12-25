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
import com.example.academia.model.AttendanceModel
import com.example.academia.utils.SessionManager
import com.example.academia.utils.UserRole
import com.example.academia.viewmodel.AttendanceViewModel

@Composable
@Preview

fun AttendanceScreen() {
    val role = SessionManager.userRole

    Column(Modifier.fillMaxSize().padding(16.dp)) {
        Text("Attendance", fontSize = 22.sp, fontWeight = FontWeight.Bold)
        Spacer(Modifier.height(12.dp))

        if (role == UserRole.STUDENT) {
            Text("You can view your attendance only.", color = Color.Gray)
        } else {
            Button(onClick = {
                // future mark attendance logic
            }) {
                Text("Mark Attendance")
            }
        }
    }
}
