require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

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

// Test route for single file upload
app.post("/upload", upload.single("product"), (req, res) => {
  res.status(200).send({
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

// Add product with image
app.post("/addproduct", upload.single("image"), async (req, res) => {
  try {
    let products= await Product.find({})
    let id
    if(products.length>0){
      let last_product_array=products.slice(-1)
      let last_product= last_product_array[0]
      id = last_product.id + 1
    }else{
      id=1
    }
    const product = new Product({
      id: id,
      name: req.body.name,
      image: req.file
        ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
        : "",
      category: req.body.category,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
    });

    await product.save();

    res.status(200).send({
      message: "Product added successfully ✅",
      payload: product,
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});


//delete product
app.post('/removeproduct', async(req,res)=>{
  try {
    await Product.findOneAndDelete({id:req.body.id})
    


    res.status(200).send({
      message: `Product removed`,
      id: req.body.id
    })

  } catch (err) {
    res.status(500).send({ error: err.message });
  }
})





// Get all products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).send(products);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});












// Start server
app.listen(PORT, (error) => {
  if (!error) {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
  } else {
    console.log("Error: " + error);
  }
});
