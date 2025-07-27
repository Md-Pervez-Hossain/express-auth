const socket=require("socket.io")
const initializeSocket=(server)=>{
  let io=socket(server,{
    cors:{
        origin:"http://localhost:8000"
    }
  })

  io.on("connection",(socket)=>{
    //handles events here

   socket.on("joinChat",()=>{

   })
   
   socket.on("sendMessage",()=>{

   });

   socket.on("disconnect",()=>{
    
   })

  })

}

module.exports=initializeSocket