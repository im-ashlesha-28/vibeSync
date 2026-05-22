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
const InviteSchema = new mongoose.Schema({
  personAName: String,
  mode: String, // 'friendship' or 'relationship'
  answers: Object,
  createdAt: { type: Date, default: Date.now }
});

const ResultSchema = new mongoose.Schema({
  personAName: String,
  personBName: String,
  mode: String,
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

let Invite;
let Result;
if (process.env.MONGODB_URI) {
  Invite = mongoose.model('Invite', InviteSchema);
  Result = mongoose.model('Result', ResultSchema);
}

// Fallback in-memory DB if MongoDB is not provided yet
const fallbackResultsDb = new Map();
const fallbackInvitesDb = new Map();
const generateId = () => Math.random().toString(36).substring(2, 9);

// API Route: Create Invite (Person A)
app.post('/api/invite', async (req, res) => {
  try {
    const { personAName, mode, answers } = req.body;
    
    const inviteData = { personAName, mode, answers };
    
    if (Invite) {
      const newInvite = new Invite(inviteData);
      await newInvite.save();
      return res.json({ success: true, inviteId: newInvite._id });
    } else {
      const mockId = generateId();
      fallbackInvitesDb.set(mockId, { ...inviteData, _id: mockId });
      return res.json({ success: true, inviteId: mockId });
    }
  } catch (error) {
    console.error("Error creating invite:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// API Route: Get Invite Info
app.get('/api/invite/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let data = null;
    
    if (Invite) {
      data = await Invite.findById(id);
    } else {
      data = fallbackInvitesDb.get(id);
    }
    
    if (data) {
      // Don't send back Person A's answers to prevent cheating!
      return res.json({ success: true, personAName: data.personAName, mode: data.mode });
    }
    return res.status(404).json({ success: false, message: "Invite not found" });
  } catch (error) {
    console.error("Error fetching invite:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// API Route: Submit Match (Person B)
app.post('/api/sync/match', async (req, res) => {
  try {
    const { inviteId, personBName, answers } = req.body;
    
    let inviteData = null;
    if (Invite) {
      inviteData = await Invite.findById(inviteId);
    } else {
      inviteData = fallbackInvitesDb.get(inviteId);
    }
    
    if (!inviteData) {
      return res.status(404).json({ success: false, message: "Invite not found" });
    }

    const personAAnswers = inviteData.answers;
    const personBAnswers = answers;
    
    // Calculate match percentage based on identical answers
    let matchCount = 0;
    const totalQuestions = Object.keys(personAAnswers).length || 10;
    
    for (const key in personAAnswers) {
      if (personAAnswers[key] === personBAnswers[key]) {
        matchCount++;
      }
    }
    
    const baseScore = Math.floor((matchCount / totalQuestions) * 100);
    // Add some random fuzziness so it's not strictly rigid
    const compatibilityScore = Math.min(100, Math.max(0, baseScore + Math.floor(Math.random() * 20 - 10)));
    
    const resultData = {
      personAName: inviteData.personAName,
      personBName: personBName,
      mode: inviteData.mode,
      scores: {
        chaos: Math.floor(Math.random() * 100),
        emotional: Math.min(100, baseScore + 15),
        memeLogic: Math.floor(Math.random() * 100),
        planning: Math.floor(Math.random() * 100),
        delusion: Math.floor(Math.random() * 100)
      },
      compatibilityScore: compatibilityScore,
      summary: compatibilityScore > 80 
        ? `Soulmates. ${inviteData.personAName} and ${personBName} are fundamentally synced on a spiritual level.` 
        : compatibilityScore > 50
        ? `A chaotic duo. ${inviteData.personAName} and ${personBName} don't always agree, but it works.`
        : `High risk. ${inviteData.personAName} and ${personBName} might need couples therapy soon.`
    };

    if (Result) {
      const newResult = new Result(resultData);
      await newResult.save();
      return res.json({ success: true, resultId: newResult._id });
    } else {
      const mockId = generateId();
      fallbackResultsDb.set(mockId, { ...resultData, _id: mockId });
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
      const data = fallbackResultsDb.get(id);
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
