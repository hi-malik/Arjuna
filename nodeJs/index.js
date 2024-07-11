import express from "express"
import path from "path"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const app = express()

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017", {
    dbName : "contactForm"
}).then(() => console.log("DataBase is Connected")).catch((e) => console.log(e))

// Schema
const userSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String,
})

// Collection
const User = mongoose.model("User", userSchema)

//middleware
app.set("view engine", "ejs")
app.use(express.static(path.join(path.resolve(), "public")))
app.use(express.urlencoded({extended : true}))
app.use(cookieParser())

const isAunthenticated = async (req, res, next) => {
    const token = req.cookies.token
    if(token){
        const decoded = jwt.verify(token, "asdfghjkjhgfdfgh")
        req.user = await User.findById(decoded._id)
        next()
    }
    else{
        res.redirect("/login")
    }
}

// API
app.get("/", isAunthenticated, (req, res) => {
    res.render("logout", {name : req.user.name})
})

app.get("/logout", (req, res) => {
    res.cookie("token", null, {
        httpOnly : true,
        expires : new Date(Date.now())
    });
    res.redirect("/")
})

app.get("/register", (req, res) => {
    res.render("register")
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/register", async (req, res) => {
    const {name, email, password} = req.body
    let user = await User.findOne({email})
    if(user){
        return res.redirect("/login")
    }
    const hashPassword = await bcrypt.hash(password, 10)
    user = await User.create({
        name,
        email,
        password : hashPassword
    })
    const token = jwt.sign({_id : user._id}, "asdfghjkjhgfdfgh")
    res.cookie("token", token, {
        httpOnly : true,
        expires : new Date(Date.now() + 60 * 1000)
    });
    res.redirect("/")
})

app.post("/login", async (req, res) => {
    const {email, password} = req.body
    
    const user = await User.findOne({email})
    if(!user) return res.redirect("/register");
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) return res.render("login", {message : "Incorrect Password"})
    const token = jwt.sign({_id : user._id}, "asdfghjkjhgfdfgh")
    res.cookie("token", token, {
        httpOnly : true,
        expires : new Date(Date.now() + 60 * 1000)
    });
    res.redirect("/")
})


// Server
app.listen(4000, () => {
    console.log("Server is Running")
})