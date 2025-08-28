const express= require('express')
const PORT= process.env.PORT || 5000
const app=express()





app.listen(PORT, (req,res)=>{
    console.log(`Server is running at https://localhost:${PORT}`)
})