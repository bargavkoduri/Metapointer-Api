const mongoose = require("mongoose");
const { MONGO_URI } = require("../constants");

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    mongoose
      .connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

module.exports = { connectDB, mongoose };