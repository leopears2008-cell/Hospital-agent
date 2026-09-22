# 🏥 Hospital AI Agent

An AI-powered hospital management and appointment platform that combines **React, TypeScript, Node.js, Gemini AI, RAG (Retrieval-Augmented Generation), authentication, and database tools**.

The system provides separate experiences for patients, doctors, and administrators while using an AI agent to help users search hospitals/doctors and manage appointments.

---

## ✨ Features

### 🤖 AI Hospital Assistant
- Natural-language interaction with the hospital system
- Gemini-powered intent detection
- AI-assisted hospital and doctor search
- Appointment-related assistance
- Tool calling with structured actions
- Context-grounded responses using RAG

### 🔎 RAG & Semantic Search
- Gemini `text-embedding-004` embeddings
- In-memory cosine-similarity vector search
- Semantic document chunking
- Metadata-aware retrieval
- Keyword fallback when embedding APIs are unavailable

### 👨‍⚕️ Doctor Features
- Doctor dashboard
- Doctor directory
- Appointment management
- Patient information management

### 🧑‍🤝‍🧑 Patient Features
- Patient dashboard
- Hospital search
- Doctor search
- Appointment booking
- Appointment management
- AI assistant

### 🛠️ Admin Features
- Admin dashboard
- User management
- Doctor management
- Patient management
- Appointment management
- Audit logs
- System settings

### 🔐 Authentication & Security
- Role-based access control
- Clerk authentication
- Firebase integration
- Server-side API operations
- Gemini API keys kept on the backend
- Prompt-injection protection

### 🚨 Healthcare Safety
The AI system includes safety-oriented handling for emergency-related queries and is designed to avoid presenting the AI as a replacement for professional medical care.

---

## 🏗️ Technology Stack

### Frontend
- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Radix UI
- Lucide React
- React Leaflet

### Backend
- Node.js
- Express
- TypeScript
- `tsx`
- Esbuild

### AI
- Google Gemini
- Gemini 2.5 Flash
- Gemini text embeddings
- Retrieval-Augmented Generation (RAG)
- Structured tool calling

### Database
- Drizzle ORM
- SQLite / LibSQL
- PostgreSQL support
- Designed for future `pgvector` integration

### Authentication
- Clerk
- Firebase / Firebase Admin

---

## 📁 Project Structure

```text
Hospital-agent-main/
│
├── src/
│   ├── components/
│   │   ├── AIChatbot.tsx
│   │   ├── Dashboard.tsx
│   │   ├── DoctorDirectory.tsx
│   │   ├── AppointmentModal.tsx
│   │   └── ...
│   │
│   ├── AdminApp.tsx
│   ├── PatientApp.tsx
│   ├── App.tsx
│   └── main.tsx
│
├── server.ts
├── evaluate-rag.ts
├── drizzle/
├── public/
├
