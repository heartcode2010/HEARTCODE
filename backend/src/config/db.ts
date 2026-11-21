import mongoose from 'mongoose';

let connectionPromise: Promise<void> | null = null;

export const connectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState === 1) return;
  const connStr = process.env.MONGODB_URI;
  if (!connStr) throw new Error('MONGODB_URI must be configured before connecting to the database.');
  if (!connectionPromise || mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
    connectionPromise = mongoose.connect(connStr)
      .then(() => {
        console.log('[Database] MongoDB connection ready: ' + mongoose.connection.name);
      })
      .then(() => undefined)
      .catch((error) => {
        connectionPromise = null;
        console.error('[Database] MongoDB connection failed: ' + (error as Error).message);
        throw error;
      });
  }
  await connectionPromise;
};
