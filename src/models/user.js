const mongoose=require("mongoose");
const validator=require("validator")

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:[true,"First Name is Required"],
        trim:true,
        // validate:{
        //     validator:function(value){
        //         return typeof value ==="string"
        //     },
        //     message:"First name is not String"
        // }
        
    },
    lastName:{
        type:String,
        trim:String,
        required:[true,"Last Name is Required"],
        // validate:{
        //     validator:function(value){
        //         return value =="string"
        //     },
        //     message:"Last Name is not String"
        // }
    },
    email:{
        type:String,
        trim:true,
        unique:true,
        required:[true,"Email is Required"],
    //     validate: {
    //     validator: function (value) {
    //         return validator.isEmail(value); 
    //     },
    //     message: "Email is invalid", 
    // },
    },
    password:{
        type:String,
        trim:true,
        required:[true,"Password is Required"]
    },
    description:{
        type:String,
        trim:true,
        default:"This is My Defaulr Bio"
    }
},{
    timestamps:true
})

module.exports= mongoose.model("User",userSchema)