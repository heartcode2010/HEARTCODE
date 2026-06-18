import app from './app';
import { connectDB } from './config/db';

const PORT = process.env.PORT || 5000;

// Start Server Boot
const startServer = async () => {
  // Connect to Database
  await connectDB();

  app.listen(PORT, () => {
    console.log(`[Server] Heartcode backend running on: http://localhost:${PORT}`);
  });
};

startServer();
