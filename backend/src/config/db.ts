import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/heartcode';
    await mongoose.connect(connStr);
    console.log(`[Database] MongoDB Connected to: ${mongoose.connection.name}`);
  } catch (error) {
    console.error(`[Database] Connection Error: ${(error as Error).message}`);
    process.exit(1);
  }
};
