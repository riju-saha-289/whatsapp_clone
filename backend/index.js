import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import chatListRoutes from './routes/chatListRoute.js';
import connectDB from './config/db.js';
import messageRoutes from './routes/messageRoutes.js';

const app = express();

// ✅ Allow only your frontend
app.use(cors({
  origin: 'https://frontend-pcfv.onrender.com', // Your deployed frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('WhatsApp Backend is running 🚀');
});

app.use('/api', chatListRoutes);
app.use('/api/messages', messageRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
  }
};

startServer();
