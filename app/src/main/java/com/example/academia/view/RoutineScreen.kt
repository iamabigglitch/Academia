package com.example.academia.view

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.example.academia.model.RoutineModel
import com.example.academia.viewmodel.RoutineViewModel

@Composable
@Preview

fun RoutineScreen() {
    val viewModel = RoutineViewModel()
    var routineList by remember { mutableStateOf(listOf<RoutineModel>()) }

    // Load routine data
    LaunchedEffect(Unit) {
        viewModel.getRoutine { list ->
            routineList = list ?: listOf()
        }
    }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("Routine")

        Spacer(modifier = Modifier.height(16.dp))

        if (routineList.isEmpty()) {
            Text("No routine available", color = Color.Gray)
        } else {
            LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                items(routineList) { routine ->
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(Color(0xFFFFF3E0), RoundedCornerShape(12.dp))
                            .padding(16.dp)
                    ) {
                        Text("${routine.subject} • ${routine.time}")
                    }
                }
            }
        }
    }
}
