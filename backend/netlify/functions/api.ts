const serverless = require('serverless-http');
import app from '../../src/app';
import { connectDB } from '../../src/config/db';

const proxy = serverless(app);

export const handler = async (event: any, context: any) => {
  await connectDB();
  const functionPrefix = '/.netlify/functions/api';
  if (typeof event.path === 'string' && event.path.startsWith(functionPrefix)) {
    const suffix = event.path.slice(functionPrefix.length);
    event.path = suffix.startsWith('/api/') ? suffix : '/api' + (suffix.startsWith('/') ? suffix : '/' + suffix);
  }
  return proxy(event, context);
};
