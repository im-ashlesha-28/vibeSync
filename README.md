# 🦋 VibeSync

**"How compatible are your vibes?"**

VibeSync is a modern, aesthetic social compatibility platform designed with heavy Gen Z energy. It analyzes human vibes across friendships, relationships, and friend groups to determine if you are emotionally synced or just sharing one braincell. 

The application mixes the aesthetic of Spotify Wrapped, Pinterest, and TikTok personality quizzes into a highly interactive, shareable web app.

## ✨ Features

- **The Sync Quiz**: An interactive, smooth, multi-step quiz with chaotic, personality-revealing questions.
- **Aesthetic Dashboard**: Visualizes your compatibility using beautiful Radar and Pie charts.
- **Group Dynamics Map**: An ecosystem map assigning your friends roles like "Therapist Friend" or "Chaotic One".
- **Glassmorphism UI**: Beautiful frosted glass cards, soft gradients, and floating particles.
- **Modern Animations**: Powered by Framer Motion for smooth transitions, reveals, and hover effects.
- **AI-Style Summaries**: Generates highly accurate (and mildly roasting) relationship summaries.

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS v3 (Custom color palettes and glassmorphism)
- Framer Motion (Animations)
- Recharts (Data visualization)
- React Router (Client-side routing)

**Backend:**
- Node.js & Express
- MongoDB & Mongoose (Data persistence)
- CORS & dotenv

## 🎨 Color Palette

The platform uses a carefully curated aesthetic palette:
- **Lavender:** `#C8B6FF`
- **Soft Pink:** `#FFCAD4`
- **Sky Blue:** `#BDE0FE`
- **Cream:** `#FFF8F0`
- **Deep Indigo:** `#5A4FCF`

## 🚀 Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/vibesync.git
   cd vibesync
   ```

2. **Start the Backend:**
   ```bash
   cd backend
   npm install
   
   # Optional: Add a .env file with MONGODB_URI to test database connections
   # MONGODB_URI=mongodb+srv://...
   
   npm start
   ```
   *Note: If no MongoDB URI is provided, the backend will safely fallback to an in-memory database for local testing.*

3. **Start the Frontend:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

## 🌍 Deployment
This project is fully configured for deployment:
- **Backend:** Configured for [Render](https://render.com/) via `render.yaml`.
- **Frontend:** Configured for [Vercel](https://vercel.com/) via `vercel.json` (requires setting the `VITE_API_URL` environment variable).
- **Database:** Fully compatible with MongoDB Atlas.
