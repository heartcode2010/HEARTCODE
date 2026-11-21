const serverless = require('serverless-http');
import mongoose from 'mongoose';
import app from '../../src/app';

const proxy = serverless(app);
let connectionPromise: Promise<typeof mongoose> | null = null;

const ensureDatabase = async () => {
  if (mongoose.connection.readyState === 1) return;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI must be configured for the Netlify API function.');
  if (!connectionPromise || mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
    connectionPromise = mongoose.connect(uri).catch((error) => {
      connectionPromise = null;
      throw error;
    });
  }
  await connectionPromise;
};

export const handler = async (event: any, context: any) => {
  await ensureDatabase();
  const functionPrefix = '/.netlify/functions/api';
  if (typeof event.path === 'string' && event.path.startsWith(functionPrefix)) {
    const suffix = event.path.slice(functionPrefix.length);
    event.path = suffix.startsWith('/api/') ? suffix : '/api' + (suffix.startsWith('/') ? suffix : '/' + suffix);
  }
  return proxy(event, context);
};
