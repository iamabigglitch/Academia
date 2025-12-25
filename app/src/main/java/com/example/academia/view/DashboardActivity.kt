package com.example.academia.view

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.sp
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
    data class NavItem(val label: String, val icon: Int)

    val navList = listOf(
        NavItem("Home", R.drawable.baseline_home_24),
        NavItem("Course", R.drawable.baseline_menu_book_24),
        NavItem("Task", R.drawable.baseline_add_task_24),
        NavItem("Account", R.drawable.baseline_account_circle_24)
    )

    var selectedIndex by remember { mutableStateOf(0) }
    val context = LocalContext.current

    Scaffold(
        floatingActionButton = {
            if (selectedIndex == 1 || selectedIndex == 2) {
                FloatingActionButton(
                    onClick = { /* Add Course/Task action */ },
                    containerColor = AcademiaPrimary
                ) {
                    Icon(Icons.Default.Add, contentDescription = null, tint = Color.White)
                }
            }
        },
        topBar = {
            CenterAlignedTopAppBar(
                title = { Text("Academia", color = AcademiaPrimary, style = TextStyle(fontWeight = FontWeight.Bold, fontSize = 25.sp)) },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(containerColor = Color.White),
                navigationIcon = {
                    IconButton(onClick = { /* menu click */ }) {
                        Icon(painter = painterResource(R.drawable.baseline_dehaze_24), contentDescription = "Menu")
                    }
                },
            )
        },
        bottomBar = {
            NavigationBar(containerColor = AcademiaPrimary) {
                navList.forEachIndexed { index, item ->
                    NavigationBarItem(
                        icon = { Icon(painter = painterResource(item.icon), contentDescription = null, tint = Color.White) },
                        label = { Text(item.label, color = Color.White) },
                        selected = selectedIndex == index,
                        onClick = { selectedIndex = index }
                    )
                }
            }
        }
    ) { padding ->
        Box(modifier = Modifier.fillMaxSize().padding(padding)) {
            when (selectedIndex) {
                0 -> HomeScreen(
                    onAttendanceClick = { /* navigate to AttendanceScreen */ },
                    onRoutineClick = { /* navigate to RoutineScreen */ }
                )
                1 -> CourseScreen()
                2 -> TaskScreen()
//                3 -> AccountScreen()
            }
        }
    }
}

@Preview
@Composable
fun DashboardPreview() {
    Dashboard()
}
