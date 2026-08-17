A full-stack hospital discovery and AI healthcare assistant application focused on hospitals in Tamil Nadu. The project combines a React/Vite frontend with an Express/TypeScript backend, Firebase Authentication, PostgreSQL/Drizzle for appointment data, Leaflet/React Leaflet for maps, and Google Gemini for AI-powered chat, symptom triage, and hospital recommendations.
Features
🏥 Browse and search hospitals in Tamil Nadu
🗺️ Map-based hospital discovery
🔎 Search/filter hospitals by location and specialty
📅 Authenticated appointment booking
👤 Firebase-based user authentication
📋 View and cancel user appointments
🤖 AI healthcare assistant powered by Google Gemini
🩺 AI symptom checker with step-by-step triage questions
✨ AI hospital recommendations using search-grounded Gemini responses
🎙️ Browser speech-to-text input
🔊 Optional AI voice responses using browser speech synthesis
🚨 Emergency guidance with India's 108 ambulance number
📱 Responsive React UI
Tech Stack
Frontend
React 19
TypeScript
Vite
Tailwind CSS
Lucide React
React Leaflet / Leaflet
Recharts
Motion
Backend
Node.js
Express
TypeScript
tsx for development
esbuild for production bundling
Data & Authentication
Firebase Authentication
Firebase Admin SDK
PostgreSQL
Drizzle ORM / Drizzle Kit
AI
Google Gemini via @google/genai
Gemini models used by the backend include:
gemini-2.5-flash
gemini-3.7-flash
Project Structure
Hospital-agent-main/
├── src/
│   ├── components/          # React UI components
│   ├── data/                # Tamil Nadu hospital data
│   ├── db/                  # Drizzle database access
│   ├── lib/                 # Firebase and utility functions
│   ├── middleware/          # Backend authentication middleware
│   ├── App.tsx              # Main application
│   ├── main.tsx             # React entry point
│   ├── index.css            # Global styles
│   └── types.ts             # Shared TypeScript types
├── drizzle/                 # Database migrations and metadata
├── server.ts                # Express API + Vite server
├── firebase-applet-config.json
├── firebase-blueprint.json
├── firestore.rules
├── package.json
├── vite.config.ts
├── tsconfig.json
└── .env.example
Prerequisites
Install the following before running the project:
Node.js 18+ (Node.js 20+ recommended)
npm
A Firebase project
A Google Gemini API key
PostgreSQL database if appointment persistence is required
Installation
Clone or extract the project and enter the project directory:
cd Hospital-agent-main
Install dependencies:
npm install
Environment Variables
Create a .env file based on .env.example.
GEMINI_API_KEY=your_gemini_api_key
APP_URL=http://localhost:3000
If the database configuration in the project requires a PostgreSQL connection string, also configure the database environment variable expected by the Drizzle/database files.
Never commit real API keys, Firebase private keys, database passwords, or other secrets to Git.
Firebase Setup
Create a Firebase project.
Enable the authentication providers required by the application.
Configure the Firebase web application credentials used by the frontend.
Configure Firebase Admin credentials for the server-side authentication middleware.
Review firestore.rules before deploying Firebase rules.
The frontend Firebase integration is located in:
src/lib/firebase.ts
Server-side Firebase Admin integration is located in:
src/lib/firebase-admin.ts
Database Setup
The project uses Drizzle ORM with PostgreSQL.
Generate migrations when the schema changes:
npm run db:generate
Apply migrations:
npm run db:migrate
Database-related files are located under:
src/db/
drizzle/
Run in Development
Start the application:
npm run dev
The Express server starts on:
http://localhost:3000
In development, Express also mounts the Vite middleware, so the frontend and API run through the same server.
Production Build
Create a production build:
npm run build
Start the production server:
npm start
Type Checking
Run TypeScript checking with:
npm run lint
API Endpoints
Authentication
POST /api/auth/sync
Synchronizes the authenticated Firebase user with the application database.
Appointments
POST /api/appointments
GET  /api/appointments
PUT  /api/appointments/:id/cancel
These endpoints require Firebase authentication.
AI Assistant
POST /api/chat
Request:
{
  "message": "What should I do for a mild fever?"
}
Symptom Checker
POST /api/symptom-checker
Uses the conversation history and latest user response to continue a basic AI triage conversation.
AI Hospital Recommendations
POST /api/ai-recommend
Accepts search information such as:
{
  "query": "heart treatment",
  "district": "Chennai",
  "specialty": "Cardiology"
}
The endpoint asks Gemini for hospital recommendations, triage guidance, emergency numbers, and location information.
AI Safety
The AI features are intended for general information and preliminary guidance only.
The application should clearly communicate that:
AI output is not a diagnosis.
Users should consult qualified healthcare professionals for medical decisions.
Emergency symptoms require immediate professional medical attention.
Hospital availability, contact information, ratings, bed capacity, and AI-generated recommendations should be independently verified before relying on them.
Browser Voice Features
The AI chatbot can use:
SpeechRecognition / webkitSpeechRecognition for microphone input
SpeechSynthesis for spoken AI responses
Browser support varies. Microphone permission must be granted for speech input.
Important Security Notes
Before deploying publicly:
Do not expose GEMINI_API_KEY in frontend code.
Keep Firebase Admin credentials server-side.
Validate and sanitize API request bodies.
Add rate limiting to AI endpoints.
Add authentication/authorization checks wherever sensitive user data is accessed.
Restrict CORS appropriately if the frontend and backend are deployed separately.
Review database permissions and Firestore rules.
Avoid treating AI-generated hospital information as authoritative without verification.
Add production logging and error monitoring without logging sensitive patient information.
Troubleshooting
GEMINI_API_KEY is not set
Make sure the .env file contains:
GEMINI_API_KEY=your_key
Then restart the development server.
Microphone does not work
Allow microphone access in the browser.
Use a browser that supports Web Speech APIs.
Try opening the application in a normal browser tab instead of a restricted preview/iframe.
Database errors
Check:
PostgreSQL is running.
Database credentials are correct.
Required environment variables are configured.
Drizzle migrations have been applied.
Disclaimer
This project is a software demonstration/healthcare platform prototype. It is not a replacement for professional medical diagnosis, treatment, or emergency services.
For emergencies in India, use the appropriate local emergency service, including ambulance service 108 where applicable.
License
No explicit license is included in the supplied project. Add a LICENSE file before distributing the project publicly if you intend to apply an open-source license.
Author / Project
Hospital AI Agent
Built as a healthcare discovery and AI-assistance platform for Tamil Nadu hospitals. """
out = Path("/mnt/data/README.md") out.write_text(readme, encoding="utf-8") print(f"Created: {out}")
