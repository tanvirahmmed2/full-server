require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { type } = require("os");
const { stringify } = require("querystring");
const jwt = require('jsonwebtoken')

const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// MongoDB connect
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log(`✅ Mongoose connected successfully`);
  })
  .catch((err) => {
    console.log(`❌ Couldn't connect to mongoose:`, err.message);
  });

// API check
app.get("/", (req, res) => {
  res.send("Server running ✅");
});

// Image storage config (multer)
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

// Static folder for images
app.use("/images", express.static("upload/images"));

// ===============================
// ROUTES
// ===============================

// Upload only (returns image url)
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .send({ success: false, message: "No file uploaded" });
  }
  res.status(200).send({
    success: true,
    message: "successfully uploaded",
    image_url: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
  });
});

// Product schema
const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

// Add product with image url
app.post("/addproduct", async (req, res) => {
  try {
    let products = await Product.find({});
    let id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

    const product = new Product({
      id: id,
      name: req.body.name,
      image: req.body.image,
      category: req.body.category,
      new_price: Number(req.body.new_price),
      old_price: Number(req.body.old_price),
    });

    await product.save();

    res.status(200).send({
      success: true,
      message: "Product added successfully ✅",
      payload: product,
    });
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
});

// Delete product
app.post("/removeproduct", async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({
      id: Number(req.body.id),
    });

    if (!deletedProduct) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
        id: req.body.id,
      });
    }
    res.status(200).send({
      success: true,
      message: `Product removed`,
      id: req.body.id,
    });
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
});

// Get all products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).send({ success: true, products });
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
});



// creating end poin for new collection


app.get('/newcollection', async (req,res)=>{
  let products= await Product.find({})
  let newcollection= products.slice(1).slice(-6)
  console.log('new collection fetched')
  res.send(newcollection)
})


//  creating endpoint for popular in women category


app.get('/popularinmen', async(req,res)=>{
  let products= await Product.find({category: "men"})
  let popular_in_men= products.slice(1,4)
  console.log(`popular in men fetched`)
  res.send(popular_in_men)
})




//creating middleware to fetch user
const fetchUser= async(req,res,next)=>{
  const token= req.header('auth-token')
  if(!token){
    res.status(401).send({
      errors: 'Please authenticate using valid user info'
    })
  }
  else{
    try {
      const data= jwt.verify(token, 'secret_ecom')
      req.user= data.user
      next()
    } catch (error) {
      res.status(401).send({errors: 'please authenticate using a valid token'})
    }
  }
}


//cart endpoint to cart data

app.post("/addtocart", fetchUser, async (req, res) => {
  console.log('Added', req.body.itemId)
  let userData = await Users.findOne({_id: req.user.id})
  userData.cartData[req.body.itemId] +=1
  await Users.findOneAndUpdate({_id: req.user.id}, {cartData: userData.cartData})
  res.send('added')
});


//creating end point for remove cart data

app.post('/removefromcart', fetchUser, async (req, res) => {
  const { itemId } = req.body;
  let userData = await Users.findOne({ _id: req.user.id });

  if (userData.cartData[itemId] > 0) {
    userData.cartData[itemId] -= 1;
  }

  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );

  res.send({ success: true, cartData: userData.cartData });
});












//schema creating for usermodel


const Users = mongoose.model('Users', {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String
  },
  cartData: {
    type: Object,
    default:{}
  },
  date: {
    type: Date,
    default: Date.now
  }
})


//creating user

app.post('/signup', async (req, res) => {
  let check = await Users.findOne({ email: req.body.email })
  if (check) {
    return res.status(200).json({
      success: false,
      errors: "user already exists with this mail"
    })
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0
  }
  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,

  })

  await user.save()


  const data = {
    user: {
      id: user.id
    }
  }
  const token = jwt.sign(data, 'sercret_ecom')
  res.json({
    success: true,
    token
  })
})





// userlogin endpoint

app.post('/signin', async (req, res) => {
  let user = await Users.findOne({ email: req.body.email })
  if (user) {
    const passCompare = req.body.password === user.password
    if (passCompare) {
      const data = {
        user: {
          id: user.id
        }
      }
      const token = jwt.sign(data, 'secret_ecom')
      res.json({
        success: true,
        token
      })

    }
    else {
      res.json({
        success: false,
        error: "wrong password"
      })
    }
  }
  else {
    res.json({
      success: false,
      error: "wrong email id"
    })
  }
})






//get cart data

app.post('/getcart', fetchUser, async (req,res)=>{
  console.log(`get cart`)
  let userData= await Users.findOne({_id: req.user.id})
  res.json(userData.cartData)
})





// Start server
app.listen(PORT, (error) => {
  if (!error) {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
  } else {
    console.log("Error: " + error);
  }
});
