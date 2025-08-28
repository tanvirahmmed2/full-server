require("dotenv").config()
const express= require('express')
const app=express()
const mongoose= require('mongoose')
const jwt= require('jsonwebtoken')
const multer= require('multer')
const path = require('path')
const cors= require('cors')
const { type } = require("os")

const PORT= process.env.PORT || 5000
const MONGO_URL= process.env.MONGO_URL




app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())



//mongo connect
mongoose.connect(MONGO_URL)
.then(()=>{
    console.log(`Mongoose connected successfully`)
})
.catch(()=>{
    console.log(`Couldn't connect to mongoose`)
})



//api listen




app.get('/', (req,res)=>{
    res.send('server running')
})


//iamge storage
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({ storage: storage })


//creaeting upload endpoint for uploading image
app.use('/images', express.static('upload/images'))

app.post('/upload', upload.single('product'), (req,res)=>{
    res.status(200).send({
        message: 'successfully uploaded',
        image_url: `http://localhost:${PORT}/images/${req.file.filename}`
    })
})

// schema fro creating product

const Product= mongoose.model("Product", {
    id:{
        type: Number,
        required: true,
         
    },
    name:{
        type: String,
        required: true,
    },
    
})





app.listen(PORT, (error)=>{
    if(!error){
        console.log(`Server is running at http://localhost:${PORT}`)
    }
    else{
        console.log("Error: " + error)
    }
})