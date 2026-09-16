const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.warn("MONGO_URI is not set. Server started without database connection.");
    return false;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB Atlas connected");
    return true;
  } catch (error) {
    console.error("DB connection failed:", error.message);
    console.warn("Server started without database connection. Configure MONGO_URI and retry.");
    return false;
  }
};

module.exports = connectDB;
