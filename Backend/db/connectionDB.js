import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // Just pass the MongoDB URL without additional options
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    process.exit(1);
  }
};
    