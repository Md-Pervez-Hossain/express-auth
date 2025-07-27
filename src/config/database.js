

const mongoose=require("mongoose")

const connectDB=async()=>{
    await mongoose.connect("mongodb+srv://Nodejs:6ztHNQ52vHApzlAX@cluster0.msg0e18.mongodb.net/todo")
}

module.exports=connectDB