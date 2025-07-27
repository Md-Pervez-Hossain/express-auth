const mongoose=require("mongoose")

const todoSchema=new mongoose.Schema({

    title:{
        type:String,
        required:[true, "Title is Required"],
        trim:true,
    },
    description:{
        type:String,
        required:[true,"Description is Required"],
        trim:true,
    },
    status:{
        type:Boolean,
        default:false,
    },
    priority:{
        type:String,
        enum:{
            values:["low","medium","high"],
            message:"Priority must be either 'low', 'medium', or 'high'"
        },
        lowercase: true,
        default:"medium"
    }

},{timestamps:true})

module.exports=mongoose.model("Todo",todoSchema)