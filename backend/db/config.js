const mongoose = require("mongoose");

const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI)
  .then(() => console.log(" Connected to MongoDB Atlas"))
  .catch(err => console.log(" MongoDB Atlas connection error:", err));
