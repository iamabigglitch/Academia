package com.example.academia.view

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.academia.utils.SessionManager
import com.example.academia.utils.UserRole

@Composable
@Preview

fun AccountScreen() {
    val role = SessionManager.userRole

    Column(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text("Account", fontSize = 22.sp, fontWeight = FontWeight.Bold)
        Text("Role: $role")

        Button(onClick = {
            SessionManager.userRole =
                if (role == UserRole.STUDENT) UserRole.TEACHER else UserRole.STUDENT
        }) {
            Text("Switch Role (Test)")
        }
    }
}
