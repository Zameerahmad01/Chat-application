import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectInstance = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `mongodb connected successfully ${connectInstance.connection.host}`
    );
  } catch (error) {
    console.log(`mongodb connection failed ${error}`);
    process.exit(1);
  }
};

export default connectDB;
