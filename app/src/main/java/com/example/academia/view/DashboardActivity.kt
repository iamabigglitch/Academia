package com.example.academia.view

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.*
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

    val navItems = listOf(
        NavItem("Home", R.drawable.baseline_home_24),
        NavItem("Course", R.drawable.baseline_menu_book_24),
        NavItem("Task", R.drawable.baseline_add_task_24),
        NavItem("Profile", R.drawable.baseline_account_circle_24)
    )

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Academia") },
                navigationIcon = {
                    Icon(
                        painter = painterResource(R.drawable.baseline_dehaze_24),
                        contentDescription = "Menu",
                        tint = Color.White
                    )
                },
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
                        icon = {
                            Icon(
                                painter = painterResource(item.iconRes),
                                contentDescription = item.label,
                                tint = Color.White
                            )
                        },
                        label = { Text(item.label, color = Color.White) },
                        selected = selectedIndex == index,
                        onClick = { selectedIndex = index }
                    )
                }
            }
        }
    ) { padding ->
        Box(modifier = Modifier.padding(padding)) {
            when (selectedIndex) {
                0 -> HomeScreen()
                1 -> CourseScreen()
                2 -> TaskScreen()
//                3 -> MyAccountScreen()
            }
        }
    }
}

data class NavItem(val label: String, val iconRes: Int)
