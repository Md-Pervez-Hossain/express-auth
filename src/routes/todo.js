const express=require("express")
const todoRouter=express.Router()
const {todoApiLevelValidation,todoUpdateValidation}=require("../utilis/validation")
const Todo=require("../models/todo")
const { default: mongoose } = require("mongoose")
const userAuth=require("../middlewares/userAuth")
// add todo lis api
todoRouter.post("/todo",userAuth,todoApiLevelValidation,async(req,res)=>{
   try {
    const {title,description,status,priority}=req.body
    const todoInstance=new Todo({title,description,status,priority})

    await todoInstance.save()
    res.status(201).send("Todo created");

   } catch (error) {
    console.error("Add Todo Error:", error); 
    // Mongoose validation error
    if (error.name === "ValidationError") {
      const errors = {};
      for (const field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ errors });
    }
    // for others error
    res.status(500).send("Something went wrong");
   }
})

// get all todo and filter by : status and priority
todoRouter.get("/todo",async(req,res)=>{
   try {

    const allowedQueryfields=["status","priority","limit","page"]

    const validQuery=Object.keys(req.query).every((key)=>allowedQueryfields.includes(key))
    console.log(validQuery)

    if(!validQuery){
       return res.status(400).send("Invalid Query  : Must Be status or priority")
    }

    const {status,priority}=req.query;

    let filter={}

    if(status !==undefined){

           if(status==="true"){
            filter.status=true
           } else if(status==="false"){
            filter.status=false
           } else{
            return res.status(400).send("Invalid Status Value : Must Be true or false")
           }
    }
    if(priority !==undefined){

      const allowedPriority=['low','medium','high'];
      const value=priority.toLocaleLowerCase()

      if(allowedPriority.includes(value)){
             filter.priority=value
      } else{
         return res.status(400).send("Invalid Priority Value : Must Be true or false")
      }

    }

    // pagination

    const page=parseInt(req.query.page)||1;
    const limit=parseInt(req.query.limit)||10;
    const skip=(page-1)*limit;

    const totalTodos=await Todo.countDocuments(filter);
    const totalPage=Math.ceil(totalTodos/limit)

    const todos=await Todo.find(filter).skip(skip).limit(limit)

    res.status(201).json({
      message:"Fetched Todo List SuccessFully",
      data:todos,
      meta:{
        page,
        limit,
       totalTodos,
       totalPage
      }
      
    })

   } catch (error) {
    res.status(400).send("Something Went Wrong")
   }
})

// get Single Todo Details
todoRouter.get("/todo/:id",async(req,res)=>{
  try {

  const {id}=req.params;
  //check valid id
  if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(400).send("Id is Not Valid")
  }
  //find todo by id
  const todo=await Todo.findById(id)

  if(!todo){
    return res.status(400).send("No Todo Found")
  }
  res.status(201).json({
    message:"Single Todo Get",
    data:todo
  })
    
  } catch (error) {
    res.status(400).send("Something Went Wrong")
  }
})

// Delete Todo
todoRouter.delete("/todo/:id",async(req,res)=>{
  try {
  const {id}=req.params;
  // check valid id
  if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(400).send("Id is not Valid")
  }
  // found id in Db
  const isIdFound=await Todo.findById(id);
  if(!isIdFound){
    return res.status(400).send("id is not found")
  }
  //find todo in db
  await Todo.findByIdAndDelete(id)

  res.status(201).send("Deleted Successfully")
    
  } catch (error) {
    res.send(400).send("Something Went Wrong")
  }
})

// update todo
todoRouter.patch("/todo/:id", todoUpdateValidation, async (req, res) => {
  try {
    const { id } = req.params; 
    const { title, description, status, priority } = req.body;

    const data = { title, description, status, priority };

    const result = await Todo.findByIdAndUpdate(id, data, { new: true });

    if (!result) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json({
      message: "Todo Updated Successfully",
      data: result,
    });
  } catch (error) {
    console.error(error); // ✅ Log error for debugging
    res.status(500).send("Something went wrong");
  }
});









module.exports=todoRouter