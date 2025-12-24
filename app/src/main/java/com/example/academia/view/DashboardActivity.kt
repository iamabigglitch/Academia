package com.example.academia.view

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.example.academia.R
import com.example.academia.ui.theme.AcademiaPrimary

class DashboardActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            Dashboard()
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
@Preview
fun Dashboard() {
    var selectedIndex by remember { mutableStateOf(0) }
    var currentSubScreen by remember { mutableStateOf<String?>(null) }

    val navItems = listOf(
        NavItem("Home", R.drawable.baseline_home_24),
        NavItem("Course", R.drawable.baseline_menu_book_24),
        NavItem("Task", R.drawable.baseline_add_task_24),
        NavItem("Account", R.drawable.baseline_account_circle_24)
    )

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Academia") },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = AcademiaPrimary,
                    titleContentColor = Color.White
                )
            )
        },
        bottomBar = {
            NavigationBar(containerColor = AcademiaPrimary) {
                navItems.forEachIndexed { index, item ->
                    NavigationBarItem(
                        icon = { Icon(painterResource(item.icon), contentDescription = item.label, tint = Color.White) },
                        label = { Text(item.label, color = Color.White) },
                        selected = selectedIndex == index,
                        onClick = {
                            selectedIndex = index
                            currentSubScreen = null
                        }
                    )
                }
            }
        }
    ) { padding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            when (selectedIndex) {
                0 -> HomeScreen(
                    onAttendanceClick = { currentSubScreen = "Attendance" },
                    onRoutineClick = { currentSubScreen = "Routine" }
                )
                1 -> CourseScreen()
                2 -> TaskScreen()
//                3 -> AccountScreen()
            }

            // Placeholder UI for sub-screens
            when (currentSubScreen) {
                "Attendance" -> Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Color(0xFF8BC78E))
                ) {
                    Text("Attendance Screen UI", modifier = Modifier.padding(16.dp))
                }
                "Routine" -> Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Color(0xFFD0C683))
                ) {
                    Text("Routine Screen UI", modifier = Modifier.padding(16.dp))
                }
            }
        }
    }
}

data class NavItem(val label: String, val icon: Int)
