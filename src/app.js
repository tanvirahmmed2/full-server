const express= require("express")
const cors= require("cors")
const userRouter= require("../src/routes/user.router")

const app=express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use(cors())



app.use("/api/users", userRouter)



app.use((err,req,res,next)=>{
    console.log(err)
    next()
})

app.get("/", (req,res)=>{
    res.send("server running")
})

module.exports= app