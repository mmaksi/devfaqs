import mongoose from 'mongoose';

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set('strictQuery', true);

  if (!process.env.MONGO_URI) {
    return console.info('Missing MONGODB_URI');
  }

  if (isConnected) {
    return console.info('MongoDB is already connected');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'TechFAQs',
    });
    isConnected = true;
    console.info('Connected to MongoDB...');
  } catch (error) {
    console.error('failed to connect to MongoDB', error);
  }
};
