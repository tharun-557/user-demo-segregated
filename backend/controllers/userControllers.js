const User=require("../model/users.model.js")

const jwt=require("jsonwebtoken")

async function registerUser(req, res){
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
}


async function generateToken(req,res){
    try{
        const { email, password } = req.body;
        const newUser = await User.findOne({ email });
        if (!newUser) {
            return res.status(401).json({ error: "User doesn't exist!!" });
        }
        else{
            if(newUser.password===password){
                const token = jwt.sign({ email,password }, process.env.secretKey, {expiresIn: "10s"});
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
}

function verifyUser(req,res,next){
    req.token=req.headers.authorization.split(" ")[1];
    console.log(req.token)
    next()
}

function verify(req,res){
    jwt.verify(req.token,process.env.secretKey,(err,data)=>{
        if(err)
            res.status(400).json({message:"Token Mismatch"})
        else{
            res.status(200).json(data)
        }
    })
}
module.exports={
    registerUser,generateToken,verifyUser,verify}