const express= require('express')
const PORT= process.env.PORT || 5000
const app=express()
const mongoose= require('mongoose')
const jwt= require('jsonwebtoken')
const multer= require('multer')
const path = require('path')
const cors= require('cors')


app.get('/', (req,res)=>{
    res.send('server running')
})



app.listen(PORT, ()=>{
    console.log(`Server is running at https://localhost:${PORT}`)
})