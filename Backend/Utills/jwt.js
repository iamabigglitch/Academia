import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET 

export const generateToken = (user)=>{
    return jwt.sign(
        {
            id:user.id,
            email:user.email,
            username:user.username,
            usertype:user.usertype
        },
        JWT_SECRET,
        {expiresIn:"7d"}
    );
}

export const VerifyToken = (token)=>{
    try{
return jwt.verify(token,JWT_SECRET)
    }
    catch(e){
return null
    }
}

export const generateResetToken = (email)=>{
    return jwt.sign({email},JWT_SECRET,{expiresIn:"1h"});
}