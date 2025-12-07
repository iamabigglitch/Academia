package com.example.academia

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Color.Companion.White
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.academia.ui.theme.DarkBlue
import com.example.academia.ui.theme.Grey
import com.example.academia.ui.theme.Blue
import com.example.academia.ui.theme.lightteal


class LoginActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            LoginBody()
        }
    }
}


@Composable
fun LoginBody(){
    var username by remember{ mutableStateOf("") }
    var password by remember {mutableStateOf("") }
    var visibility by remember { mutableStateOf(false) }

    val context = LocalContext.current
    val activity = context as Activity

    val sharedPreferences = context.getSharedPreferences("User", Context.MODE_PRIVATE)
    val localUsername : String? = sharedPreferences.getString("email","")
    val localPassword : String? = sharedPreferences.getString("password","")


    Scaffold { padding ->
        Column (
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .background(White)
        ){
            Spacer(modifier = Modifier.height(40.dp))
            Text(
                "Sign in",
                modifier = Modifier.fillMaxWidth(),
                style = TextStyle(
                    textAlign = TextAlign.Center,
                    fontSize = 25.sp,
                    color = DarkBlue,
                    fontWeight = FontWeight.Bold
                )

            )

            Image(
                painter= painterResource(R.drawable.logo),
                contentDescription = null,
                modifier = Modifier.
                size(40.dp,40.dp),
            )

            Text(
                "Academia",
                style = TextStyle(
                    textAlign = TextAlign.Center,
                    color = DarkBlue
                ),
                modifier = Modifier.padding(vertical = 20.dp)
            )

            Row (
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 15.dp)
            ){

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 15.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                HorizontalDivider(modifier = Modifier.weight(1f))
                Text("OR", modifier = Modifier.padding(horizontal = 15.dp))
                HorizontalDivider(modifier = Modifier.weight(1f))
            }

            Spacer(modifier = Modifier.height(25.dp))

            // ---- USERNAME FIELD ----
            OutlinedTextField(
                value = username,
                onValueChange = { username = it },
                placeholder = { Text("abc@gmail.com") },
                leadingIcon = {
                    Icon(
                        painter=painterResource(R.drawable.baseline_account_circle_24),
                            contentDescription = null
                        )
                },

                colors = TextFieldDefaults.colors(
                    unfocusedContainerColor = lightteal,
                    focusedContainerColor = Grey,
                    focusedIndicatorColor = Blue,
                    unfocusedIndicatorColor = Color.Transparent
                ),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 15.dp)
            )

            Spacer(modifier = Modifier.height(20.dp))

            // ---- PASSWORD FIELD ----
            OutlinedTextField(
                value = password,
                onValueChange = { password = it },
                placeholder = { Text("*************") },
                leadingIcon = {
                    Icon(painterResource(R.drawable.baseline_lock_24),
                            contentDescription = null )
                },
                colors = TextFieldDefaults.colors(
                    unfocusedContainerColor = lightteal,
                    focusedContainerColor = Grey,
                    focusedIndicatorColor = Blue,
                    unfocusedIndicatorColor = Color.Transparent
                ),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 15.dp),
                visualTransformation = if (visibility) VisualTransformation.None else PasswordVisualTransformation(),
                trailingIcon = {
                    IconButton (onClick = { visibility = !visibility }) {
                        Icon(
                            painter = if (visibility)
                                painterResource(R.drawable.baseline_visibility_24)
                            else
                                painterResource(R.drawable.baseline_visibility_off_24),
                            contentDescription = null
                        )
                    }
                }
            )

            Button(onClick = {
                if(localUsername == username && localPassword == password){
                    val intent = Intent(
                        context,
                        DashboardActivity::class.java
                    )
                    context.startActivity(intent)
                    activity.finish()
                }else{
                    Toast.makeText(context,"Invalid login", Toast.LENGTH_LONG).show()
                }

            }) {
                Text("Login")
            }
            Text("Don't have an account, Signup", modifier = Modifier.clickable {
                val intent = Intent(
                    context,
                    RegistrationActivity::class.java
                )

                context.startActivity(intent)

            })


            Spacer(modifier = Modifier.height(10.dp))
            // ---- FORGET PASSWORD ----
            Text(
                "Forget Password?",
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 15.dp),
                textAlign = TextAlign.End,
                color = Color.Gray.copy(0.8f),
                fontSize = 14.sp
            )

            Spacer(modifier = Modifier.height(25.dp))

            // ---- LOGIN BUTTON ----
            Button(
                onClick = { },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(55.dp)
                    .padding(horizontal = 15.dp),
                colors = ButtonDefaults.buttonColors(containerColor = DarkBlue),
                shape = RoundedCornerShape(30.dp)
            ) {
                Text(
                    "Log In",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = White
                )
            }

            Spacer(modifier = Modifier.height(25.dp))
            // ---- SIGN UP ----
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.Center
            ) {
                Text("Don’t have account? ", color = Color.Gray.copy(0.7f))
                Text("Sign Up", color = DarkBlue, fontWeight = FontWeight.Bold)
            }

            Spacer(modifier = Modifier.height(40.dp))
        }
    }
}
    }

@Preview(showBackground = true)
@Composable
fun LoginPreview() {
    LoginBody()
}