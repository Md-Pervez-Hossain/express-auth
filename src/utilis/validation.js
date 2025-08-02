const { default: mongoose } = require("mongoose")
const validator=require("validator")
const User = require("../models/user")
const bcrypt=require("bcrypt")
const jwt = require('jsonwebtoken');


const todoApiLevelValidation=(req,res,next)=>{

    const {title,description,status,priority}=req.body
   
    if(!title || validator.isEmpty(title.trim())){
        return res.status(400).send("Title is Required")
    } 
    if(!description || validator.isEmpty(description.trim())){
       return res.status(400).send("description is Required")
    }
    if(!validator.isAlpha(title.replace(/\s/g,''))){
        return res.status(400).send("Tile contains only Letters")
    } 
    if(!validator.isLength(title,{min:3,max:50})){
       return res.status(400).send("Title must be between 3 and 50 characters")
    }if(!validator.isLength(description,{min:20,max:250})){
       return res.status(400).send("Description must be between 20 and 150 characters")
    }

    if(typeof status !=="boolean"){
     return res.status(400).send("Invalid Status : Must Be True or False")
    }
    
    // allowed Fields For Priority Fields
   const validPriorities=["low","high","medium"]
   const valid=priority.toLowerCase()
    if(!validPriorities.includes(valid)){
      return res.status(400).send("Invalid Priority : Must Be 'Low' , 'medium' or 'high'")
    }

    // allowed fields
    const allowedFields=["title","description","status","priority"]
    const result=Object.keys(req.body).every((key)=>allowedFields.includes(key))
    if(!result){
     return res.status(400).send("Invalid Data Send")
    }

    // sanitize input fields
    req.body.title=validator.escape(title.trim())
    req.body.description=validator.escape(description.trim())

    next()
}

const todoUpdateValidation = (req, res, next) => {
  const { title, description, status, priority } = req.body;
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("id is not valid");
  }

  const allowedFields = ["title", "description", "status", "priority"];
  const isValid = Object.keys(req.body).every((key) =>
    allowedFields.includes(key)
  );

  if (!isValid) {
    return res.status(400).send("Invalid Property");
  }

  // sanitize input fields (only if they exist)
  if (title) req.body.title = validator.escape(title.trim());
  if (description) req.body.description = validator.escape(description.trim());

  next();
};

// user validation

const userRegistrationValidation=async(req,res,next)=>{

    const {firstName,lastName,password,email}=req.body;

    const allowedField=["firstName","lastName","password","email"]

    const isValid=Object.keys(req.body).every(key=>allowedField.includes(key))
    if(!isValid){
        return res.status(400).send("Invalid Data")
    }

    if(!firstName || validator.isEmpty(firstName.trim())){
       return res.status(400).send("First Name is required")
    } 
    if(!lastName || validator.isEmpty(lastName.trim())){
       return res.status(400).send("last name is Required")
    } 
    if(!password || validator.isEmpty(password.trim())){
         return res.status(400).send("Password is Required")
    } 
     if(!email || validator.isEmpty(password.trim())){
        return res.status(400).isEmpty("Email is Required")
     }
     if(!validator.isEmail(email)){
      return res.status(400).send("Email is Invalid")
     }
     if(!validator.isStrongPassword(password)){
       return res.status(400).send("Password Must Be Strong")
     }

     const existingUser=await User.findOne({email})
     console.log(existingUser)

     if(existingUser){
        return res.status(400).send("Already Use this Email ! try with Another Email")
     }

     req.body.firstName=validator.escape(firstName.trim());
     req.body.lastName=validator.escape(lastName.trim());
     req.body.email=validator.escape(email.trim())
     req.body.password=validator.escape(password.trim())

     next()

}

const loginValidation= async (req,res,next)=>{
    const {password,email}=req.body;
    if(!password || validator.isEmpty(password.trim())){
         return res.status(400).send("Password is Required")
    }
    if(!email || validator.isEmpty(email.trim())){
        return res.status(400).send("Email is Required")
    }
    if(!validator.isEmail(email)){
    return res.status(400).send("Invalid Email")
    }

    const user=await User.findOne({email})
    if(!user){
        return res.status(400).send("Invalid Creadential")
    }
    const hassedPassword=user.password
   // Load hash from your password DB.
   const matchPassword= await bcrypt.compare(password, hassedPassword);
   if(!matchPassword){
      return res.status(400).send("Invalid Creadential")
   }
   // jwt token 
   const token= await jwt.sign({ email:user?.email,id:user?._id }, "TODO@123",{ expiresIn: "1h" });
   if(!token){
     return res.status(400).send("Token is Not create")
   }
   res.cookie("token",token)
   next()

}

module.exports={todoApiLevelValidation,todoUpdateValidation,userRegistrationValidation,loginValidation}