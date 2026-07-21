import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';
import { seedDatabase } from './utils/seed.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    // 1. Connect database
    await connectDB();

    // 2. Seed initial admin configurations & demo data
    await seedDatabase();

    // 3. Listen to network port
    app.listen(PORT, () => {
      console.log(`===================================================`);
      console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`API URL: http://localhost:${PORT}`);
      console.log(`===================================================`);
    });
  } catch (error) {
    console.error(`Failed to launch Express server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
