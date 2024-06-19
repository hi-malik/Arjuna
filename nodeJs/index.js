import express from "express"
import path from "path"

const app = express()

const user = []

//middleware
app.set("view engine", "ejs")
app.use(express.static(path.join(path.resolve(), "public")))
app.use(express.urlencoded({extended : true}))

// API
app.get("/", (req, res) => {
    // res.render("index.ejs")
    res.render("index", {name : "Sita", shame : "Har"})
})

app.post("/contact", (req, res) => {
    // console.log(req.body.name)
    user.push({name : req.body.name, email : req.body.email})
    res.redirect("success")
})

app.get("/success", (req, res) => {
    res.render("success")
})

app.get("/userData", (req, res) => {
    res.json({
        user,
    })
})

app.listen(4000, () => {
    console.log("Server is Running")
})