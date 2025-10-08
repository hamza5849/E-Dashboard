const express = require("express");
const cors = require("cors");
const Users = require("./db/Users");
const Product = require("./db/product");
require("./db/config");

const app = express();
app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Root route
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Server is running successfully!" });
});

// REGISTER 
app.post("/register", async (req, res) => {
  try {
    const user = new Users(req.body);
    await user.save();
    res.json({ status: "ok", user });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

// LOGIN 
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      let user = await Users.findOne({ Email: email, Password: password }).select("-Password");
      if (user) {
        res.json({ status: "ok", user });
      } else {
        res.json({ status: "error", error: "User not found" });
      }
    } else {
      res.json({ status: "error", error: "Missing email or password" });
    }
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

// ADD PRODUCT 
app.post("/add-product", async (req, res) => {
  try {
    let product = new Product(req.body);
    let result = await product.save();
    res.json({ status: "ok", result });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

// GET ALL PRODUCTS 
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

// GET SINGLE PRODUCT
app.get("/product/:id", async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE PRODUCT
app.put("/product/:id", async (req, res) => {
  try {
    let result = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE PRODUCT 
app.delete("/product/:id", async (req, res) => {
  try {
    const result = await Product.deleteOne({ _id: req.params.id });
    if (result.deletedCount > 0) {
      res.json({ status: "ok", message: "Product deleted successfully" });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SEARCH PRODUCT (by any field)
// SEARCH PRODUCTS
app.get("/search/:key", async (req, res) => {
  try {
    const result = await Product.find({
      "$or": [
        { name: { $regex: req.params.key, $options: "i" } }, // search by product name
        { company: { $regex: req.params.key, $options: "i" } }, // or by company
        { category: { $regex: req.params.key, $options: "i" } } // or by category
      ]
    });
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: "Search failed", details: err });
  }
});


app.listen(5000, () => console.log("Server running on http://localhost:5000"));
