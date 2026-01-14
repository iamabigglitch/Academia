import { User } from "../../models/userModel.js";
import { generateToken } from "../Utills/jwt.js";
import bcrypt from "bcryptjs";

(async () => {
  const passwordd = "newadmin";
  const hashedd = await bcrypt.hash(passwordd, 10);  // 10 is the salt rounds
  console.log(hashedd);
})();

const validatePassword = (password) => {
  const errors = [];
  if (password.length < 6)
    errors.push("Password must be at least 6 characters");
  if (!/[0-9]/.test(password)) errors.push("Must contain number");
  return errors;
};

const login = async(req,res)=>{
    try{
const body = req.body;
if(body.username===null){
return res.status(401).send({message:"cannot leave email field empty"})
}
if(body.password===null){
    return res.status(401).send({message:"cannot leave password field empty"})
}
const user = await User.findOne({
where:{username:body.username}
})

if(!user){
    return res.status(500).send({message:"Invalid credentials"})
}
if(user){
    const isMatch = await bcrypt.compare(body.password,user.password)
        if(!isMatch){
  return res.status(500).send({message:"Invalid credentials"})
        }
    res.status(200).send({token:generateToken(user),data:user,message:"logged in sucessfully"})
}
}
catch(e){
    res.status(500).send({message:e.message})
}
}

const signUp = async(req,res)=>{
try{
    console.log("asign in api hit");
    const body = req.body;
    console.log(body)
    if(!body.email||!body.password||!body.username||!body.number){
       return res.status(401).send({message:"Cannot leave fields empty"})
    }
    const userExists = await User.findOne({where:{email:body.email}})
    if(userExists){
        return res.status(401).send({message:'user already exists in email'})
    }
    const usernameExists = await User.findOne({where:{username:body.username}})
    if(usernameExists){
        return res.status(401).send({message:"Username already in-use"})
    }
    const passwordErrors = validatePassword(body.password);
    if(passwordErrors.length>0){
        return res.status(401).send({message:"password requirements not met"})
    }
    const hashedPassword = await bcrypt.hash(body.password, 10);
    console.log(hashedPassword)
    const createUser = await User.create({
        username:body.username,
        email:body.email,
        password:hashedPassword,
        number:body.number
    })
    res.status(200).send({token:generateToken(createUser),data:createUser,message:"Logged in sucessfully"})
}
catch(e){
    console.log(e)
    res.status(500).send({message:e.message})
}
    
}
// export const googleCallback = (req, res) => {
//  try {
//     if (!req.user) {
//       return res.status(400).json({ message: "No user information found from Google" });
//     }
//     const token = generateToken(req.user);

//     res.redirect(`http://localhost:5173/auth/google/callback/google-success?token=${token}`);
//   } catch (error) {
//     console.error("Error in Google callback:", error);

//     res.redirect("http://localhost:5173/google-error");
//   }
// };

export{login,signUp}