import mongoose from 'mongoose';

export const connectDB = async () => {
  const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/heartcode';
  try {
    const conn = await mongoose.connect(connStr);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error]: ${(error as Error).message}`);
    process.exit(1);
  }
};
