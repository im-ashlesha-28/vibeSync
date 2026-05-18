const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn("WARNING: MONGODB_URI is not defined. Using in-memory fallback for local development only.");
      return;
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
connectDB();

// Mongoose Schema & Model
const ResultSchema = new mongoose.Schema({
  scores: {
    chaos: Number,
    emotional: Number,
    memeLogic: Number,
    planning: Number,
    delusion: Number
  },
  compatibilityScore: Number,
  summary: String,
  createdAt: { type: Date, default: Date.now }
});

let Result;
if (process.env.MONGODB_URI) {
  Result = mongoose.model('Result', ResultSchema);
}

// Fallback in-memory DB if MongoDB is not provided yet
const fallbackDb = new Map();
const generateId = () => Math.random().toString(36).substring(2, 9);

// API Route: Submit Quiz
app.post('/api/sync', async (req, res) => {
  try {
    const { answers } = req.body;
    
    // Calculate mock scores based on some basic logic (or randomized for prototype)
    const chaosScore = Math.floor(Math.random() * 100);
    const emotionalScore = Math.floor(Math.random() * 100);
    
    const resultData = {
      scores: {
        chaos: chaosScore,
        emotional: emotionalScore,
        memeLogic: Math.floor(Math.random() * 100),
        planning: Math.floor(Math.random() * 100),
        delusion: Math.floor(Math.random() * 100)
      },
      compatibilityScore: Math.floor((chaosScore + emotionalScore) / 2),
      summary: "Emotionally chaotic but spiritually synced. This duo shares one braincell and uses it to make terrible decisions together."
    };

    if (Result) {
      // Save to MongoDB
      const newResult = new Result(resultData);
      await newResult.save();
      return res.json({ success: true, resultId: newResult._id });
    } else {
      // Save to fallback memory map
      const mockId = generateId();
      fallbackDb.set(mockId, { ...resultData, _id: mockId });
      return res.json({ success: true, resultId: mockId });
    }
  } catch (error) {
    console.error("Error creating result:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// API Route: Get Results
app.get('/api/sync/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (Result) {
      const data = await Result.findById(id);
      if (data) return res.json(data);
      return res.status(404).json({ success: false, message: "Not found" });
    } else {
      const data = fallbackDb.get(id);
      if (data) return res.json(data);
      // Mock data fallback for missing memory
      return res.json({
        _id: id,
        scores: { chaos: 80, emotional: 90, memeLogic: 65, planning: 30, delusion: 85 },
        compatibilityScore: 75,
        summary: "High risk friendship. You communicate entirely in memes and inside jokes."
      });
    }
  } catch (error) {
    console.error("Error fetching result:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Simple health check endpoint for Render
app.get('/', (req, res) => {
  res.json({ status: 'VibeSync API is running!' });
});

app.listen(PORT, () => {
  console.log(`VibeSync backend running on port ${PORT}`);
});
