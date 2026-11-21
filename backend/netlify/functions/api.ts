const serverless = require('serverless-http');
import app from '../../src/app';
import { connectDB } from '../../src/config/db';

const proxy = serverless(app);

export const handler = async (event: any, context: any) => {
  await connectDB();
  return proxy(event, context);
};
