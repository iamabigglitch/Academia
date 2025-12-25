package com.example.academia.view

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.academia.model.RoutineModel
import com.example.academia.utils.SessionManager
import com.example.academia.utils.UserRole
import com.example.academia.viewmodel.RoutineViewModel

@Composable
@Preview

fun RoutineScreen() {
    Column(Modifier.fillMaxSize().padding(16.dp)) {
        Text("Class Routine", fontSize = 22.sp, fontWeight = FontWeight.Bold)
        Spacer(Modifier.height(12.dp))

        Text("Routine will be displayed here.", color = Color.Gray)
    }
}