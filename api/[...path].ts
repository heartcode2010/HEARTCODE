import { mongoose } from '../backend/src/config/db';
import app from '../backend/src/app';

let connection: Promise<typeof mongoose> | undefined;

async function ensureDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not configured for the Vercel API.');
  }

  if (mongoose.connection.readyState === 1) return;

  if (!connection) {
    connection = mongoose.connect(uri).catch((error) => {
      connection = undefined;
      throw error;
    });
  }

  await connection;
}

export default async function handler(req: any, res: any) {
  try {
    await ensureDatabase();
    return app(req, res);
  } catch (error) {
    console.error('[HEARTCODE API] Startup/database error:', error);
    return res.status(503).json({
      success: false,
      message: 'The HEARTCODE API is temporarily unavailable. Check the database configuration.',
    });
  }
}
