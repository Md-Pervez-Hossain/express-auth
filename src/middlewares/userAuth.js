const User = require("../models/user");
const jwt=require("jsonwebtoken")
const userAuth=async (req,res,next)=>{
  
try {
     const token=req.cookies?.token;
     console.log("token",token)
     if(!token){
     return res.status(400).send('Unauthorised')
     }
// verify a token symmetric
const isValidToken = await jwt.verify(token, 'TODO@123');
console.log(isValidToken)
const {email,id}=isValidToken;

const userInfo= await User.findOne({email})
console.log(userInfo)

req.user=userInfo
  
next()
} catch (error) {
    console.error(error)
    res.send(error.message)
}

}

module.exports=userAuth