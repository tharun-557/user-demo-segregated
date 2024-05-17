const express=require("express")
const app=express()
const jwt=require("jsonwebtoken")
require("dotenv").config()

app.use(express.json()) //middleware



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


//user schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  });
  
const User = mongoose.model('User', userSchema);
  
//API endpoints
app.get("/",(req,res)=>{
    res.send("welcome!!")
})


app.post("/register",async(req, res)=>{

    try{
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ error: "User already exists" });
        }
        const newUser=new User ({email,password});
        await newUser.save()
        return res.status(201).json({ message: "User registered successfully"});
    }
    catch(err){
        return res.status(500).json({ error: "Internal server error"});
    }
})



app.post("/login",async(req,res)=>{
    try{
        const { email, password } = req.body;
        const newUser = await User.findOne({ email });
        if (!newUser) {
            return res.status(401).json({ error: "User doesn't exist!!" });
        }
        else{
            if(newUser.password===password){
                const token = jwt.sign({ email,password }, process.env.secretKey, {expiresIn: "1h"});
                console.log(token)
                res.status(201).json({token})
            }
            else{
                res.status(301).json({message:"Wrong password!!"})
                return
            }
        }
    }
    catch(err){
        return res.status(500).json({ error: "Internal server error"});
    }
})


function verifyUser(req,res,next){
    req.token=req.headers.authorization.split(" ")[1];
    console.log(req.token)
    next()
}

app.get("/profile",verifyUser,(req,res)=>{
    jwt.verify(req.token,process.env.secretKey,(err,data)=>{
        if(err)
            res.status(400).json({message:"Token Mismatch"})
        else{
            res.status(200).json(data)
        }
    })
})
    


app.listen(process.env.PORT || 5000 ,()=>{
    console.log("app is listening!!")
})


