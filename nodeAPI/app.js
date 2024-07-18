import express from "express"
import mongoose from "mongoose"

const app = express()

// Using middlewares
app.use(express.json())

// Connecting to DB
mongoose.connect("mongodb://localhost:27017", {
    dbName : "backendAPI"
}).then(() => console.log("Database is connected")).catch((e) => console.log(e))

// Schema
const schema = new mongoose.Schema({
    name : String,
    email : String,
    password : String,
})

// model
const User = mongoose.model("User", schema)

app.get("/", (req, res) => {
    res.send("Site is working")
})

app.get("/users/all", async (req, res) => {
    console.log(req.query.student2)
    const users = await User.find({})
    res.json({
        success : true,
        users
    })
})

app.post("/users/new", async (req, res) => {
    const {name, email, password} = req.body
    await User.create({
        name,
        email,
        password,
    })
    res.status(201).cookie("token", "iamin", {httpOnly : true}).json({
        success : true,
        message : "Register Succesfully"
    })
})

// userid/harsh
// userid/sana


app.get("/userid/:id", async (req, res) => {
    const {id} = req.params
    const users = await User.findById(id)
    res.json({
        success : true,
        users
    })
})

app.get("/userid/special", (req, res) => {
    res.json({
        success : true,
        message : "Just I'm special"
    })
})


app.listen(4000, () => {
    console.log("Server is running")
})