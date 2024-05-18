const express=require("express")
const routes=express.Router()

const User=require("../model/users.model.js")

const jwt=require("jsonwebtoken")

const controllers=require("../controllers/userControllers.js")

routes.post("/register",controllers.registerUser)

routes.post("/login",controllers.generateToken)



routes.get("/profile",controllers.verifyUser,controllers.verify)


module.exports=routes


