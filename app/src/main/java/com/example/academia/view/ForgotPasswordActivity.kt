package com.example.academia.view

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
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
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.academia.repository.UserRepoImpl
import com.example.academia.ui.theme.AcademiaPrimary
import com.example.academia.viewmodel.UserViewModel


class ForgetpasswordActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            Forgetpassword()
        }
    }
}


@Composable

fun Forgetpassword(){
    val userViewModel = remember { UserViewModel(UserRepoImpl()) }
    var email by remember {mutableStateOf("")}
    var context = LocalContext.current

    val activity = context as Activity
    Scaffold { paddingValues ->
        Column(
            modifier=Modifier
                .padding(paddingValues)
                .background(color = AcademiaPrimary.copy(alpha = 0.05f))
                .fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center

        ) {
            Box(
                modifier= Modifier
                    .padding(10.dp)
                    .size(400.dp)
                    .background(Color.White, shape = RoundedCornerShape(15.dp)),

                ){

                Column(modifier=Modifier
                    .padding(10.dp)
                    .fillMaxSize()) {
                    Spacer(Modifier.height(20.dp))
                    Text(
                        text="Forget Password",

                        modifier=Modifier.fillMaxWidth(),
                        textAlign = TextAlign.Center,
                        fontWeight = FontWeight.Bold,
                        fontSize = 40.sp,
                        color= AcademiaPrimary

                    )

                    Spacer(Modifier.height(20.dp))
                    Text(
                        text="Enter your email to send a reset link",
                        modifier=Modifier.padding(horizontal = 15.dp),
                        color = Color.DarkGray,
                        textAlign = TextAlign.Center
                        )

                    Spacer(Modifier.height(10.dp))
                    OutlinedTextField(
                        value = email,
                        onValueChange = { data ->
                            email=data
                        },
                        label={Text("Email")},
                        shape=RoundedCornerShape(15.dp),
                        placeholder = {
                            Text(
                                "abcd@gmail.com", style = TextStyle(
                                    color = Color.LightGray
                                )
                            )
                        },
                        keyboardOptions = KeyboardOptions(
                            keyboardType = KeyboardType.Email
                        ),
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 15.dp),

                        colors = TextFieldDefaults.colors(
                            focusedContainerColor = AcademiaPrimary.copy(alpha = 0.08f),
                            unfocusedContainerColor = Color.White,
                            focusedIndicatorColor = AcademiaPrimary,
                            unfocusedIndicatorColor = AcademiaPrimary.copy(alpha = 0.5f),
                            cursorColor = AcademiaPrimary
                        )



                    )
                    Spacer(Modifier.height(40.dp))
                    Button(
                        onClick = {
                            if(email.isNullOrBlank()){
                                Toast.makeText(context,"Email cannot be empty", Toast.LENGTH_SHORT).show()
                            }
                            else{
                                userViewModel.Forgetpassword(email){
                                        success,msg->
                                    if(success){
                                        Toast.makeText(context, msg, Toast.LENGTH_SHORT).show()
                                    }
                                    else{
                                        Toast.makeText(context,msg,Toast.LENGTH_SHORT).show()
                                    }
                                }
                            }

                        },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = AcademiaPrimary,       // Background color
                            contentColor = Color.White              // Text & icon color
                        ),
                        elevation = ButtonDefaults.buttonElevation(
                            defaultElevation = 15.dp

                        ),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(60.dp)
                            .padding(horizontal = 15.dp),

                        shape = RoundedCornerShape(10.dp),

                        )
                    {
                        Text("Send Link", fontSize = 18.sp)
                    }
                    Spacer(Modifier.height(20.dp))
                    Text(
                        text="Go back to Login",

                        modifier=Modifier.fillMaxWidth().clickable {
                            val intent = Intent(
                                context, LoginActivity::class.java
                            )
                            context.startActivity(intent)
                        },
                        textAlign = TextAlign.Center,
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp,
                        color= AcademiaPrimary

                    )

                }
            }
        }
    }
}

@Preview
@Composable
fun ForgetPreview() {
    Forgetpassword()
}
