// lib/mongodb.js
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI in .env.local');
}

let isConnected = false;

export const connectToDB = async () => {
  if (isConnected) {
    console.log('[✅] Using existing DB connection');
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: 'mini-proj',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log('[✅] MongoDB connected');
  } catch (error) {
    console.error('[❌] MongoDB connection error:', error);
    throw error;
  }
};
