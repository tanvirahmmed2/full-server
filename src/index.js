require("dotenv").config()
const express= require('express')
const app=express()
const mongoose= require('mongoose')
const jwt= require('jsonwebtoken')
const multer= require('multer')
const path = require('path')
const cors= require('cors')

const PORT= process.env.PORT || 5000
const MONGO_URL= process.env.MONGO_URL




app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))


//mongo connect
 mongoose.connect(MONGO_URL)


//api listen




app.get('/', (req,res)=>{
    res.send('server running')
})



app.listen(PORT, ()=>{
    console.log(`Server is running at https://localhost:${PORT}`)
})