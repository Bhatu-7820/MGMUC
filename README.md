# MGMU IICT College AI Information Chatbot

[![MGM University - IICT](https://img.shields.io/badge/MGMU-IICT_AI_Assistant-0a2540?style=for-the-badge&logo=academic&logoColor=gold)](https://mgmu.ac.in/iict)
[![Architecture](https://img.shields.io/badge/Architecture-3--Layer_MERN-0284c7?style=for-the-badge)](file://./README.md)
[![Anti--Hallucination](https://img.shields.io/badge/Anti--Hallucination-Strict_Grounding-emerald?style=for-the-badge)](file://./README.md)

A professional, production-ready **AI College Information Chatbot** built for **MGM University – Institute of Information and Communication Technology (IICT), Chhatrapati Sambhajinagar, Maharashtra**.

The application functions as an official college digital assistant, answering inquiries regarding admissions, degree programs, tuition fees, eligibility, faculty, scholarships, hostels, placements, examination schedules, campus facilities, and contact details.

---

## 🌟 Key Features

1. **Anti-Hallucination Source Grounding Engine**:
   - Responds **ONLY** from verified college data sources.
   - Never fabricates fees, dates, faculty names, designations, phone numbers, or admission rules.
   - Automatically issues safe "information unavailable" or off-topic redirection responses when verified facts are absent.

2. **3-Layer Architecture**:
   - **Layer 1: Presentation Layer** (React + Vite + Tailwind CSS + Lucide React icons + Framer Motion)
   - **Layer 2: Business / Service Layer** (Query Classifier, Retrieval Orchestrator, Response Validator, Search Engine, Rate Limiter)
   - **Layer 3: Data / Middleware Layer** (MongoDB / Mongoose + In-Memory Fallback Store + External API Adapters)

3. **Multi-Tier Source Hierarchy & API Fallback System**:
   - **Priority 1**: Official MGMU / IICT Primary External REST API (configurable via `.env`)
   - **Priority 2**: Official MGMU IICT Verified Database / Knowledge Engine
   - **Priority 3**: Secondary Developer Fallback REST API
   - **Priority 4**: Safe "Information Unavailable" response (No unverified guessing)

4. **Query Classification**:
   - Automatically categorizes incoming questions into: `ADMISSION`, `COURSES`, `FEES`, `FACULTY`, `DEPARTMENT`, `ACADEMICS`, `EXAM`, `PLACEMENT`, `SCHOLARSHIP`, `HOSTEL`, `FACILITIES`, `DOCUMENTS`, `CONTACT`, `OFF_TOPIC`, `AMBIGUOUS`.

5. **Verified Source Badges**:
   - Every factual response displays its verification badge (`✓ Verified Information`, source title, and last updated date).

6. **College Search System**:
   - Instant search across degree programs, faculty directory, departments, hostelling, and FAQs.

---

## 🏗️ Project Structure

```text
mgmu-iict-chatbot/
├── frontend/                    # React Frontend (Layer 1)
│   ├── src/
│   │   ├── components/
│   │   │   ├── chat/            # ChatWindow, ChatMessage, ChatInput, TypingIndicator, SuggestedQuestions
│   │   │   ├── common/          # Logo, SourceBadge, Loader
│   │   │   └── layout/          # Header, Sidebar, MobileDrawer, SearchModal, SettingsModal
│   │   ├── context/             # ChatContext state provider
│   │   ├── services/            # Axios API client wrapper
│   │   ├── index.css            # Tailwind CSS & custom design tokens
│   │   ├── App.jsx              # Workspace application container
│   │   └── main.jsx             # React entry point
│   ├── vite.config.js           # Vite server & API proxy config
│   └── package.json
│
├── backend/                     # Node.js + Express Backend (Layers 2 & 3)
│   ├── src/
│   │   ├── config/              # MongoDB connection & offline in-memory store
│   │   ├── controllers/         # Chat, Knowledge, and Conversation controllers
│   │   ├── middleware/          # Rate limiter, Input validator, Error handler
│   │   ├── models/              # Knowledge, Course, Faculty, Conversation schemas
│   │   ├── routes/              # Express API route endpoints (/api/chat, /api/knowledge, /api/conversations)
│   │   ├── services/
│   │   │   ├── ai/              # Provider abstraction, Primary AI, Fallback AI, Response Validator
│   │   │   ├── classifier.service.js    # Query classification engine
│   │   │   ├── fallbackApi.adapter.js  # Primary & Secondary external API adapters
│   │   │   ├── retrieval.service.js   # Multi-tier source retriever
│   │   │   └── search.service.js      # College search engine
│   │   ├── utils/               # Winston logger & MGMU IICT seed dataset
│   │   └── app.js               # Express application entry
│   └── package.json
│
├── .env.example
├── README.md
└── package.json                 # Root script runner (concurrently)
```

---

## ⚡ Quick Start & Installation

### 1. Clone & Install Dependencies
Run from the project root:
```bash
npm run install:all
```
This installs dependencies for root, `client/`, and `server/`.

### 2. Environment Variables
Create `.env` inside `server/` (copy from `server/.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/mgmu_iict_chatbot
AI_PROVIDER=gemini
AI_API_KEY=your_gemini_api_key_optional
PRIMARY_API_URL=
FALLBACK_API_URL=
```

### 3. Run Development Application
Run both Frontend & Backend concurrently:
```bash
npm run dev
```
- **Frontend Chat UI**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

*(Note: If MongoDB is offline, the backend automatically operates seamlessly in Verified In-Memory Dataset mode without crashing).*

---

## 🔌 API Integration Guidelines

To connect production MGMU / IICT APIs later:
1. Update `PRIMARY_API_URL` or `FALLBACK_API_URL` in `server/.env`.
2. The system automatically routes queries through `server/src/services/fallbackApi.adapter.js`, normalizes external payloads into standard verified schema, and grounds responses without breaking existing React UI code.

---

## 🌐 Verified College Programs (MGMU IICT)

- **B.Tech Computer Science & Engineering (CSE)** — 4 Years (120 Intake)
- **B.Tech Information Technology (IT)** — 4 Years (60 Intake)
- **B.Tech Artificial Intelligence & Data Science (AI & DS)** — 4 Years (60 Intake)
- **Bachelor of Computer Applications (BCA)** — 3 Years (60 Intake)
- **Master of Computer Applications (MCA)** — 2 Years (60 Intake)
- **M.Tech Computer Science & Engineering** — 2 Years

---

## 🚀 Deployment on Render

This repository is pre-configured with fullstack production support and a `render.yaml` blueprint.

### Method 1: Blueprint Deployment (Recommended & Fastest)
1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** > **Blueprint**.
3. Connect your GitHub repository: `https://github.com/Bhatu-7820/MGMUC`.
4. Render will automatically detect `render.yaml`.
5. Enter your environment variables (e.g. `AI_API_KEY`, optional `MONGO_URI`).
6. Click **Apply**. Render will build and deploy the entire fullstack app!

### Method 2: Manual Web Service
1. In Render Dashboard, click **New +** > **Web Service**.
2. Connect `https://github.com/Bhatu-7820/MGMUC`.
3. Set the following configuration:
   - **Environment**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
4. In the **Environment Variables** section, add:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (or leave default, Render sets `PORT`)
   - `AI_API_KEY`: *(Your Google Gemini or AI API key)*
   - `MONGO_URI`: *(Optional: MongoDB Atlas connection string; if left blank, in-memory verified knowledge engine is used)*
5. Click **Create Web Service**. Your chatbot will be live at `https://your-service-name.onrender.com`!

---

© 2026 MGM University - Institute of Information and Communication Technology (IICT). All rights reserved.
