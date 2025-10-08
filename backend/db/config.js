const mongoose = require("mongoose");

const mongoURL = "mongodb://localhost:27017/e-comm";

mongoose.connect(mongoURL)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.error("MongoDB connection error:", err));
