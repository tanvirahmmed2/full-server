require("dotenv").config()


const serverPort= process.env.PORT || 4000
const mongodbUrl= process.env.MONGODB_URL  || "mongodb+srv://tanvir004006:tanvir1234@new-db.kzqsq5p.mongodb.net/ecommerceDB"


module.exports= {
    serverPort,
    mongodbUrl,
    
}