package com.example.academia.view

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
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
import com.example.academia.repository.UserRepoImpl
import com.example.academia.ui.theme.AcademiaPrimary
import com.example.academia.ui.theme.Grey
import com.example.academia.viewmodel.UserViewModel


class LoginActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            Loginpage()
        }
    }
}
@Composable
fun Loginpage() {
    var userViewmodel = remember { UserViewModel(UserRepoImpl()) }


    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var visibility by remember { mutableStateOf(false) }
    val context = LocalContext.current
    val activity = context as Activity
//
//    val sharedPreferences = context.getSharedPreferences(
//        "User",
//        Context.MODE_PRIVATE
//    )

//    val localEmail: String? = sharedPreferences.getString("email", "")
//    val localPassword: String? = sharedPreferences.getString("password", "")

    Scaffold { padding ->
        Box(Modifier.fillMaxSize()) {
            Image(
                painter = painterResource(id= R.drawable.background),
                contentDescription = null,
                modifier = Modifier
                    .fillMaxSize()
                    .blur(10.dp),
                contentScale = ContentScale.Crop,
                alpha = 0.7f
            )

            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding)


            ) {
                Spacer(modifier = Modifier.height(40.dp))
                Column(
                    modifier=Modifier.fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally

                ) {
                    Image(
                        painter = painterResource(id = R.drawable.logo),
                        contentDescription = null,


                        )
                }
                Spacer(modifier = Modifier.height(40.dp))
                Column(


                    modifier=Modifier.fillMaxSize().align(Alignment.End)
//
//
                ) {

                    Spacer(modifier = Modifier.height(50.dp));
                    Text(
                        text = "Welcome Back",
                        style = TextStyle(
                            textAlign = TextAlign.Center,
                            fontSize = 40.sp,
                            color = AcademiaPrimary,
                            fontWeight = FontWeight.Bold,
                            fontFamily = FontFamily.SansSerif
                        ),
                        modifier = Modifier.fillMaxWidth()
                    )

                    Spacer(modifier = Modifier.height(20.dp));


                    OutlinedTextField(
                        value = email,
                        onValueChange = { data ->
                            email = data
                        },
                        label = { Text("Email") },
                        shape = RoundedCornerShape(15.dp),
                        placeholder = {
                            Text(
                                "abcd@gmail.com", style = TextStyle(
                                    color = Color.White
                                )
                            )
                        },
                        keyboardOptions = KeyboardOptions(
                            keyboardType = KeyboardType.Email
                        ),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(60.dp)
                            .padding(horizontal = 20.dp),
                            colors = TextFieldDefaults.colors(
                            focusedContainerColor = AcademiaPrimary.copy(alpha = 0.08f),
                            unfocusedContainerColor = Color.White,
                            focusedIndicatorColor = AcademiaPrimary,
                            unfocusedIndicatorColor = AcademiaPrimary.copy(alpha = 0.5f),
                            focusedLabelColor = AcademiaPrimary,
                            cursorColor = AcademiaPrimary
                        )
                        )


                    Spacer(modifier = Modifier.height(20.dp))

                    OutlinedTextField(
                        value = password,
                        onValueChange = { data ->
                            password = data
                        },
                        label = { Text("Password") },
                        trailingIcon = {
                            IconButton(onClick = {
                                visibility = !visibility
                            }) {
                                Icon(
                                    painter = if (visibility)
                                        painterResource(R.drawable.baseline_visibility_24)
                                    else
                                        painterResource(R.drawable.baseline_visibility_off_24),
                                    contentDescription = null
                                )
                            }

                        },
                        visualTransformation = if (visibility) VisualTransformation.None else PasswordVisualTransformation(),
                        shape = RoundedCornerShape(15.dp),
                        placeholder = {
                            Text(
                                "", style = TextStyle(
                                    color = Color.White
                                )
                            )
                        },
                        keyboardOptions = KeyboardOptions(
                            keyboardType = KeyboardType.Password
                        ),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(60.dp)
                            .padding(horizontal = 20
                                .dp),
                        colors = TextFieldDefaults.colors(
                            focusedContainerColor = AcademiaPrimary.copy(alpha = 0.08f),
                            unfocusedContainerColor = Color.White,
                            focusedIndicatorColor = AcademiaPrimary,
                            unfocusedIndicatorColor = AcademiaPrimary.copy(alpha = 0.5f),
                            focusedLabelColor = AcademiaPrimary,
                            cursorColor = AcademiaPrimary
                        )

                    )

                    Text(
                        "Forget password",
                        style = TextStyle(
                            textAlign = TextAlign.End
                        ),
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable {
                                val intent = Intent(
                                    context, ForgetpasswordActivity::class.java
                                )
                                context.startActivity(intent)
                                activity.finish()
                            }
                            .padding(vertical = 15.dp, horizontal = 20.dp)
                    )

                    Button(
                        onClick = {
                            if (email.isNullOrBlank() || password.isNullOrBlank()) {
                                Toast.makeText(
                                    context, "Fields cant be empty", Toast.LENGTH_SHORT
                                ).show()
                                return@Button
                            }
                            else {
                                userViewmodel.login(email, password) { success, msg ->
                                    if(success){
                                        Toast.makeText(
                                            context,msg,Toast.LENGTH_SHORT).show()
                                        val intent = Intent(
                                            context, DashboardActivity::class.java
                                        )
                                        context.startActivity(intent)
                                        activity.finish()

                                    }
                                    else(
                                            Toast.makeText(
                                                context,msg,Toast.LENGTH_SHORT).show()
                                            )


                                }
                            }

                        } ,

                        colors = ButtonDefaults.buttonColors(
                            containerColor = AcademiaPrimary,       // Background color
                            contentColor = Color.White         // Text & icon color
                        ),
                        elevation = ButtonDefaults.buttonElevation(
                            defaultElevation = 15.dp

                        ),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(60.dp)
                            .padding(horizontal = 20.dp),

                        shape = RoundedCornerShape(10.dp),

                        ) {
                        Text("Log In")
                    }
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        buildAnnotatedString {
                            withStyle(SpanStyle(color = Grey)) {
                                append("Don't have account?")
                            }

                            withStyle(SpanStyle(color = Grey)) {
                                append("   Sign  up")
                            }


                        },
                        modifier = Modifier
                            .clickable {
                                val intent = Intent(
                                    context, RegistrationActivity::class.java
                                )
                                context.startActivity(intent)
                                activity.finish()
                            }
                            .padding(20.dp),

                        style = TextStyle(
                            fontWeight = FontWeight.Bold
                        )

                    )

                }
            }
        }
    }
}

@Preview
@Composable
fun preview(){
    Loginpage()
}
