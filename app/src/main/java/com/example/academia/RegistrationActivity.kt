package com.example.academia

import android.app.Activity
import android.app.DatePickerDialog
import android.content.Context
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CheckboxDefaults
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
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.unit.toSize
import com.example.academia.ui.theme.Blue
import com.example.academia.ui.theme.DarkBlue
import com.example.academia.ui.theme.Grey
import com.example.academia.ui.theme.Purple80
import java.util.Calendar

class RegistrationActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            registration()
        }
    }
}

@Composable
fun registration(){
    var username by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var visibility by remember { mutableStateOf(false) }
    var terms by remember {mutableStateOf(false)}
    var selectedDate by remember {mutableStateOf("")}
    var context= LocalContext.current
    var calendar = Calendar.getInstance()
    var year= calendar.get(Calendar.YEAR)
    var month= calendar.get(Calendar.MONTH)
    var day=calendar.get(Calendar.DAY_OF_MONTH)
    var datepicker = DatePickerDialog(
        context,{
                _,y,m,d-> selectedDate = "$y/${m+1}/$d"

        },
        year,month,day
    )

    val sharedPreference = context.getSharedPreferences("User", Context.MODE_PRIVATE)
    val activity = context as Activity
    val editor=sharedPreference.edit()
    val Userexist = sharedPreference.getString("email","")
    var expanded by remember {mutableStateOf(false)}
    var selectedOptionText by remember { mutableStateOf("Select option") }
    var options = listOf("option 1","option 2","option 3")
    var textFieldsize by remember{mutableStateOf(Size.Zero)}


    Scaffold { padding ->
        Column(modifier= Modifier.fillMaxSize().padding(padding)
            .background(color= Color.White)) {
            Spacer(modifier = Modifier.height(60.dp))
            Text(
                text = "Registration",
                style = TextStyle(
                    textAlign = TextAlign.Center,
                    fontSize = 40.sp,
                    color = DarkBlue,
                    fontWeight = FontWeight.SemiBold,
                ),
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.width(25.dp));

            OutlinedTextField(
                value = username,
                onValueChange = { data ->
                    username = data
                },
                shape = RoundedCornerShape(20.dp),
                placeholder = {
                    Text("Username")
                },
                keyboardOptions = KeyboardOptions(
                    keyboardType = KeyboardType.Email
                ),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 15.dp),
                colors = TextFieldDefaults.colors(
                    focusedContainerColor = Purple80,
                    unfocusedContainerColor = Grey,
                    focusedIndicatorColor = Blue,
                    unfocusedIndicatorColor = Color.Transparent
                )

            )
            Spacer(modifier = Modifier.height(20.dp))

            OutlinedTextField(
                value = password,
                onValueChange = { data ->
                    password = data
                },
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
                    Text("********")
                },
                keyboardOptions = KeyboardOptions(
                    keyboardType = KeyboardType.Email
                ),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 15.dp),
                colors = TextFieldDefaults.colors(
                    focusedContainerColor = Purple80,
                    unfocusedContainerColor = Grey,
                    focusedIndicatorColor = Blue,
                    unfocusedIndicatorColor = Color.Transparent
                )

            )
            Spacer(modifier = Modifier.height(20.dp));
            OutlinedTextField(
                value=selectedDate,
                onValueChange = {data-> selectedDate=data},
                shape = RoundedCornerShape(10.dp),
                placeholder={
                    Text("mm/dd/yyyy")
                },
                enabled = false,
                modifier=Modifier.fillMaxWidth().padding(horizontal = 15.dp) .clickable {
                    datepicker.show()
                },colors= TextFieldDefaults.colors(
                    unfocusedContainerColor = Grey,
                    unfocusedIndicatorColor = Color.Transparent,


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

                    }
                    .padding(vertical = 15.dp, horizontal = 15.dp)
            )
            Row(
                modifier=Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Checkbox(
                    checked = terms,
                    onCheckedChange = {
                        terms=it
                    },
                    colors = CheckboxDefaults.colors(checkedColor = Grey, checkmarkColor = Color.White ),

                    )
                Text("i understand the terms and condition")
            }
            Button(
                onClick = {
                    if(!terms){
                        Toast.makeText(context,"please agree to terms and conditins",Toast.LENGTH_SHORT).show()
                        return@Button
                    }
                    if(Userexist!=null && Userexist==username){
                        Toast.makeText(context,"user already exists in the same username",Toast.LENGTH_SHORT).show()
                        return@Button
                    }
                    else{
                        editor.putString("username",username)
                        editor.putString("password",password)
                        editor.putString("date",selectedDate)
                        editor.apply()
                        Toast.makeText(context,
                            "Registration sucess",Toast.LENGTH_SHORT).show()
                        activity.finish()

                    }
                },
                colors = ButtonDefaults.buttonColors(
                    containerColor = DarkBlue,       // Background color
                    contentColor = Color.White         // Text & icon color
                ),
                elevation = ButtonDefaults.buttonElevation(
                    defaultElevation = 10.dp

                ),
                modifier = Modifier
                    .fillMaxWidth().height(60.dp)
                    .padding(horizontal = 15.dp),


                shape = RoundedCornerShape(10.dp),

                ) {
                Text("Log In")
            }
            Spacer(modifier=Modifier.height(10.dp))
            Text(buildAnnotatedString {
                append("Already have account?")

                withStyle(SpanStyle(color = Blue)) {
                    append("Sign  In")
                }


            },
                modifier = Modifier.padding(10.dp)

            )

            Box(
                modifier = Modifier.fillMaxWidth().padding(16.dp)

            ){
                OutlinedTextField(
                    value=selectedOptionText,
                    onValueChange = {},
                    modifier = Modifier.fillMaxWidth().onGloballyPositioned{coordinates -> textFieldsize=coordinates.size.toSize()}
                        .clickable{expanded=true},
                    placeholder = {Text("Select Option")},
                    enabled=false,
                    trailingIcon = {
                        Icon(
                            imageVector = Icons.Default.KeyboardArrowDown,
                            contentDescription = null
                        )
                    }

                )
//                DropdownMenu(
//                    expanded=expanded,
//                    onDismissRequest =
//                ) { }
            }
        }

    }
}

@Preview
@Composable
fun registrationPreview(){
    registration()
}