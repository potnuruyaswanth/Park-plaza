import app from './src/app.js';
import connectDB from './src/config/db.js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Ensure invoices directory exists
if (!fs.existsSync('invoices')) {
  fs.mkdirSync('invoices');
}
// Ensure receipts directory exists
if (!fs.existsSync('receipts')) {
  fs.mkdirSync('receipts');
}

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
