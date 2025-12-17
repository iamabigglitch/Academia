package com.example.academia.view

import android.app.Activity
import android.app.DatePickerDialog
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.blur
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.academia.R
import com.example.academia.model.UserModel
import com.example.academia.repository.UserRepoImpl
import com.example.academia.ui.theme.AcademiaPrimary
import com.example.academia.ui.theme.Grey
import com.example.academia.viewmodel.UserViewModel
import java.util.*

class RegistrationActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            RegistrationPage()
        }
    }
}

@Composable
fun RegistrationPage() {
    val userViewModel = remember { UserViewModel(UserRepoImpl()) }

    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var reEnter by remember { mutableStateOf("") }
    var dob by remember { mutableStateOf("") }
    var showPassword by remember { mutableStateOf(false) }
    var agreeTerms by remember { mutableStateOf(false) }

    val context = LocalContext.current
    val activity = context as Activity

    val calendar = Calendar.getInstance()
    val datePicker = DatePickerDialog(
        context,
        { _, year, month, dayOfMonth ->
            dob = "$year/${month + 1}/$dayOfMonth"
        },
        calendar.get(Calendar.YEAR),
        calendar.get(Calendar.MONTH),
        calendar.get(Calendar.DAY_OF_MONTH)
    )

    Scaffold { padding ->
        Box(Modifier.fillMaxSize()) {
            Image(
                painter = painterResource(R.drawable.background),
                contentDescription = null,
                modifier = Modifier.fillMaxSize().blur(5.dp),
                contentScale = ContentScale.Crop,
                alpha = 0.7f
            )

            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding)
                    .padding(horizontal = 20.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Spacer(modifier = Modifier.height(40.dp))

                Image(
                    painter = painterResource(R.drawable.logo),
                    contentDescription = null,
                    modifier = Modifier.size(150.dp)
                )

                Spacer(modifier = Modifier.height(30.dp))

                Text(
                    text = "Create Account",
                    style = TextStyle(
                        fontSize = 36.sp,
                        fontWeight = FontWeight.Bold,
                        color = AcademiaPrimary,
                        fontFamily = FontFamily.SansSerif,
                        textAlign = TextAlign.Center
                    ),
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(20.dp))

                // Email
                OutlinedTextField(
                    value = email,
                    onValueChange = { email = it },
                    label = { Text("Email") },
                    shape = RoundedCornerShape(15.dp),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(60.dp),
                    colors = TextFieldDefaults.colors(
                        focusedContainerColor = AcademiaPrimary.copy(alpha = 0.08f),
                        unfocusedContainerColor = Color.White,
                        focusedIndicatorColor = AcademiaPrimary,
                        unfocusedIndicatorColor = AcademiaPrimary.copy(alpha = 0.5f),
                        focusedLabelColor = AcademiaPrimary,
                        cursorColor = AcademiaPrimary
                    )
                )

                Spacer(modifier = Modifier.height(15.dp))

                // Password
                OutlinedTextField(
                    value = password,
                    onValueChange = { password = it },
                    label = { Text("Password") },
                    visualTransformation = if (showPassword) VisualTransformation.None else PasswordVisualTransformation(),
                    trailingIcon = {
                        IconButton(onClick = { showPassword = !showPassword }) {
                            Icon(
                                painter = painterResource(
                                    if (showPassword) R.drawable.baseline_visibility_24
                                    else R.drawable.baseline_visibility_off_24
                                ),
                                contentDescription = null
                            )
                        }
                    },
                    shape = RoundedCornerShape(15.dp),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(60.dp),
                    colors = TextFieldDefaults.colors(
                        focusedContainerColor = AcademiaPrimary.copy(alpha = 0.08f),
                        unfocusedContainerColor = Color.White,
                        focusedIndicatorColor = AcademiaPrimary,
                        unfocusedIndicatorColor = AcademiaPrimary.copy(alpha = 0.5f),
                        focusedLabelColor = AcademiaPrimary,
                        cursorColor = AcademiaPrimary
                    )
                )

                Spacer(modifier = Modifier.height(15.dp))

                // Re-enter Password
                OutlinedTextField(
                    value = reEnter,
                    onValueChange = { reEnter = it },
                    label = { Text("Re-enter Password") },
                    visualTransformation = if (showPassword) VisualTransformation.None else PasswordVisualTransformation(),
                    trailingIcon = {
                        IconButton(onClick = { showPassword = !showPassword }) {
                            Icon(
                                painter = painterResource(
                                    if (showPassword) R.drawable.baseline_visibility_24
                                    else R.drawable.baseline_visibility_off_24
                                ),
                                contentDescription = null
                            )
                        }
                    },
                    shape = RoundedCornerShape(15.dp),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(60.dp),
                    colors = TextFieldDefaults.colors(
                        focusedContainerColor = AcademiaPrimary.copy(alpha = 0.08f),
                        unfocusedContainerColor = Color.White,
                        focusedIndicatorColor = AcademiaPrimary,
                        unfocusedIndicatorColor = AcademiaPrimary.copy(alpha = 0.5f),
                        focusedLabelColor = AcademiaPrimary,
                        cursorColor = AcademiaPrimary
                    )
                )

                Spacer(modifier = Modifier.height(15.dp))

                // DOB
                OutlinedTextField(
                    value = dob,
                    onValueChange = {},
                    label = { Text("Date of Birth") },
                    enabled = false,
                    shape = RoundedCornerShape(15.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(60.dp)
                        .clickable { datePicker.show() },
                    trailingIcon = {
                        Icon(
                            painter = painterResource(R.drawable.baseline_calendar_today_24),
                            contentDescription = null
                        )
                    },
                    colors = TextFieldDefaults.colors(
                        disabledContainerColor = Color.White,
                        disabledIndicatorColor = Color.Transparent,
                        focusedContainerColor = AcademiaPrimary.copy(alpha = 0.08f),
                        unfocusedContainerColor = Color.White,
                        focusedIndicatorColor = AcademiaPrimary,
                        unfocusedIndicatorColor = AcademiaPrimary.copy(alpha = 0.5f)
                    )
                )

                Spacer(modifier = Modifier.height(15.dp))

                // Terms
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Checkbox(
                        checked = agreeTerms,
                        onCheckedChange = { agreeTerms = it },
                        colors = CheckboxDefaults.colors(
                            checkedColor = AcademiaPrimary,
                            checkmarkColor = Color.White
                        )
                    )
                    Text("I agree to terms & conditions")
                }

                Spacer(modifier = Modifier.height(20.dp))

                // Sign Up
                Button(
                    onClick = {
                        if(email.isBlank() || password.isBlank() || reEnter.isBlank() || dob.isBlank()) {
                            Toast.makeText(context,"Fields cannot be empty",Toast.LENGTH_SHORT).show()
                            return@Button
                        }
                        if(!agreeTerms){
                            Toast.makeText(context,"Please agree to terms & conditions",Toast.LENGTH_SHORT).show()
                            return@Button
                        }
                        if(password != reEnter){
                            Toast.makeText(context,"Passwords do not match",Toast.LENGTH_SHORT).show()
                            return@Button
                        }

                        userViewModel.register(email,password){ success,msg,userID->
                            if(success){
                                val model = UserModel(
                                    userId = userID,
                                    username = email, // using email as identifier
                                    email = email,
                                    password = password,
                                    dob = dob
                                )
                                userViewModel.addUserToDatabase(userID,model){ success2,msg2->
                                    Toast.makeText(context,msg2,Toast.LENGTH_SHORT).show()
                                    if(success2){
                                        val intent = Intent(context, LoginActivity::class.java)
                                        context.startActivity(intent)
                                        activity.finish()
                                    }
                                }
                            } else {
                                Toast.makeText(context,msg,Toast.LENGTH_SHORT).show()
                            }
                        }
                    },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = AcademiaPrimary,
                        contentColor = Color.White
                    ),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(60.dp),
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Text("Sign Up", fontSize = 18.sp)
                }

                Spacer(modifier = Modifier.height(20.dp))

                Text(
                    buildAnnotatedString {
                        append("Already have an account? ")
                        withStyle(SpanStyle(color = Grey)) { append("Log In") }
                    },
                    modifier = Modifier
                        .clickable {
                            val intent = Intent(context, LoginActivity::class.java)
                            context.startActivity(intent)
                            activity.finish()
                        }
                        .padding(10.dp),
                    style = TextStyle(fontWeight = FontWeight.Bold)
                )
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun PreviewRegistrationPage() {
    RegistrationPage()
}
