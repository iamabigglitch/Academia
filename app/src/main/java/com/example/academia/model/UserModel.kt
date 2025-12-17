package com.example.academia.model

data class UserModel(
    val userId:String="",
    val username:String="",
    val email:String="",
    val password:String="",
    val dob:String=""
) {
    fun toMap(): Map<String, Any?> {
        return mapOf(
            "userId" to userId,
            "username" to username,
            "email" to email,
            "password" to password,
            "dob" to dob,

            )
    }
}