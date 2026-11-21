import mongoose from 'mongoose';
import serverless from 'serverless-http';
import app from './app';

let connection: Promise<typeof mongoose> | undefined;

async function connectDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not configured');
  if (mongoose.connection.readyState === 1) return;
  if (!connection) {
    connection = mongoose.connect(uri).catch((error) => {
      connection = undefined;
      throw error;
    });
  }
  await connection;
}

const expressHandler = serverless(app);

export const handler = async (event: any, context: any) => {
  try {
    await connectDatabase();
    return await expressHandler(event, context);
  } catch (error) {
    console.error('[HEARTCODE Netlify API] Database startup error:', error);
    return {
      statusCode: 503,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        message: 'HEARTCODE API is temporarily unavailable. Check MongoDB configuration.'
      })
    };
  }
};
