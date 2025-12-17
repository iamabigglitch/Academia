package com.example.academia.view

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.tooling.preview.Preview
import com.example.academia.R
import com.example.academia.ui.theme.AcademiaPrimary
import com.example.academia.ui.theme.Grey
import com.example.academia.viewmodel.DashboardViewModel
import androidx.compose.runtime.remember
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue

class DashboardActivity : ComponentActivity() {

    private val dashboardViewModel: DashboardViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            Dashboard(dashboardViewModel)
        }
    }
}

@Composable

fun Dashboard(viewModel: DashboardViewModel) {
    val selectedIndex by viewModel.selectedTabIndex

    data class NavItem(val label: String, val icon: Int)
    val navlist = listOf(

        NavItem("Home", R.drawable.baseline_home_24),
        NavItem("Feed", R.drawable.baseline_feed_24),
        NavItem("Attendance", R.drawable.baseline_groups_24),
        NavItem("My Account", R.drawable.baseline_account_circle_24)
    )

    Scaffold(
        bottomBar = {
            NavigationBar(containerColor = AcademiaPrimary) {
                navlist.forEachIndexed { index, item ->
                    NavigationBarItem(
                        icon = {
                            Icon(painterResource(item.icon),
                                contentDescription = item.label) },
                        label = { Text(item.label) },
                        selected = selectedIndex == index,
                        onClick = { viewModel.changeTab(index) },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = Color.White,
                            selectedTextColor = Color.White,
                            indicatorColor = Grey
                        )
                    )
                }
            }
        }
    ) { paddingValues ->
        Box(modifier = Modifier.padding(paddingValues)) {
            when (selectedIndex) {
                0 -> HomeTab(viewModel)
                1 -> FeedTab(viewModel)
                2 -> AttendanceTab(viewModel)
                3 -> MyAccountTab()
            }
        }
    }
}

@Composable
fun HomeTab(viewModel: DashboardViewModel) {
    val homeStats = viewModel.homeStats
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(20.dp)
    ) {
        Text(
            "Welcome Back!",
            fontSize = 32.sp,
            fontWeight = FontWeight.Bold,
            color = AcademiaPrimary)

        Spacer(
            modifier = Modifier.height(20.dp))

        Text(
            "Quick Actions",
            fontSize = 20.sp,
            fontWeight = FontWeight.Medium)

        Spacer(
            modifier = Modifier.height(10.dp))

        homeStats.forEach { stat ->
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 6.dp),
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = Grey.copy(alpha = 0.1f))
            ) {
                Text(
                    stat,
                    modifier = Modifier.padding(16.dp),
                    fontWeight = FontWeight.Medium)
            }
        }
    }
}

@Composable
fun FeedTab(viewModel: DashboardViewModel) {
    val feedPosts = viewModel.feedPosts

    Column(
        modifier = Modifier.fillMaxSize().padding(20.dp)) {

        Text(
            "Announcements & Feed",
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold)

        Spacer(
            modifier = Modifier.height(10.dp))

        LazyColumn {
            items(feedPosts) { post ->
                Card(
                    modifier = Modifier.fillMaxWidth().padding(vertical = 5.dp),
                    shape = RoundedCornerShape(10.dp),
                    colors = CardDefaults.cardColors(containerColor = Grey.copy(alpha = 0.1f))
                ) {
                    Text(post, modifier = Modifier.padding(15.dp))
                }
            }
        }
    }
}

@Composable

fun AttendanceTab(viewModel: DashboardViewModel) {
    val attendanceHistory = viewModel.attendanceHistory
    var todayStatus by remember { mutableStateOf(attendanceHistory.firstOrNull() ?: "Not Marked") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(20.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            "Attendance",
            fontSize = 28.sp,
            fontWeight = FontWeight.Bold,
            color = AcademiaPrimary)

        Spacer(modifier = Modifier.height(20.dp))

        // Card showing today's attendance and mark button
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(15.dp),
            colors = CardDefaults.cardColors(containerColor = Grey.copy(alpha = 0.1f))
        ) {
            Row(
                modifier = Modifier
                    .padding(20.dp)
                    .fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("Today: $todayStatus", fontSize = 18.sp)

                Button(onClick = {
                    viewModel.markTodayAttendance("Present")
                    todayStatus = "Present"
                }) { Text("Mark Present") }

            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        Text(
            "History",
            fontSize = 20.sp,
            fontWeight = FontWeight.Medium,
            modifier = Modifier.align(Alignment.Start))

        Spacer(modifier = Modifier.height(10.dp))

        LazyColumn {
            items(attendanceHistory) { day ->
                Card(
                    modifier = Modifier.fillMaxWidth().padding(vertical = 5.dp),
                    shape = RoundedCornerShape(10.dp),
                    colors = CardDefaults.cardColors(containerColor = Grey.copy(alpha = 0.05f))
                ) {
                    Text(day, modifier = Modifier.padding(15.dp))
                }
            }
        }
    }
}


@Composable
fun MyAccountTab() {
    Column(
        modifier = Modifier.fillMaxSize().padding(20.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {

        Text(
            "My Account",
            fontSize = 28.sp,
            fontWeight = FontWeight.Bold,
            color = AcademiaPrimary)

        Spacer(modifier = Modifier.height(20.dp))

        Text("Name: Zenisha Regmi")
        Text("Email: zenisha@yopmail.com")
        Spacer(modifier = Modifier.height(20.dp))
        Button(onClick = { /* logout logic */ }) {
            Text("Log Out")
        }
    }
}

@Preview(showBackground = true)
@Composable
fun DashboardPreview() {
    val previewViewModel = DashboardViewModel()
    Dashboard(previewViewModel)
}
