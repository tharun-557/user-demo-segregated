const express=require("express")
const app=express()
const jwt=require("jsonwebtoken")
require("dotenv").config()

app.use(express.json()) //middleware

const usersroutes=require("./Routes/users.route.js")

app.use("/api/users",usersroutes)

//API endpoints
app.get("/",(req,res)=>{
    res.status(200).send("welcome!!")
})


//Database
const mongoose=require("mongoose");
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    console.log("connected to mongodb")
})
.catch((err)=>{
    console.log("Error connecting to mongodb:",err.message)
})
  
app.listen(process.env.PORT || 5000 ,()=>{
    console.log("app is listening!!")
})


