const mongoose = require('mongoose');
const colors = require('colors');
const connectDB = async () => {
  try {
    const conn = await mongoose.connect((process.env.MONGO_URL), 
    { useNewUrlParser: true,
    useUnifiedTopology: true,// settings to make th connection more stable
    });
    console.log(`MongoDB connected successfully`.yellow.bold);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error}`);
    process.exit(1);
  }
};

module.exports = connectDB;
