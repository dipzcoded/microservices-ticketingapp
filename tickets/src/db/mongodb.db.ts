import mongoose from "mongoose";

export default async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connection to database was successful!");
  } catch (error) {
    console.log(error);
  }
};
