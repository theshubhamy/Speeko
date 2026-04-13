# 📘 Project Documentation

## AI English Practice App (Context-Based)

---

# 1. 📌 Overview

**Product Name (working):** SpeakPrep AI

**Objective:**
Enable users to practice real-world English conversations (interviews, sales pitches, meetings) using AI, with **voice interaction, contextual feedback, and performance scoring**.

---

# 2. 🎯 Core Use Cases

### Primary scenarios:

* Interview practice (SDE, HR, behavioral)
* Sales pitch simulation
* Client communication
* Daily workplace English

---

# 3. 🧱 Tech Stack

## Frontend (Mobile)

* Expo
* React Native
* Zustand / Redux (state management)
* React Query (server state)

---

## Backend (BaaS)

* Firebase

  * Authentication
  * Firestore
  * Cloud Functions
  * Storage
  * Firebase Hosting (optional web)

---

## AI Layer

* OpenAI

  * GPT → conversation + feedback
  * Whisper → speech-to-text

---

## Voice Layer

* Expo AV (recording)
* TTS:

  * OpenAI TTS / ElevenLabs

---

# 4. 🏗️ High-Level Architecture

```
[ Expo Mobile App ]
        |
        | (HTTPS / WebSocket)
        ↓
[ Firebase Services ]
   ├── Auth
   ├── Firestore
   ├── Storage
   └── Cloud Functions (AI Orchestration)
                |
                ↓
           [ OpenAI APIs ]
```

---

# 5. 🔄 Data Flow (End-to-End)

### 🎙️ Conversation Flow

1. User selects scenario
2. User speaks → audio recorded (Expo AV)
3. Upload audio → Firebase Storage
4. Cloud Function:

   * Fetch audio
   * Convert → text (Whisper)
   * Send to GPT with context
5. GPT returns:

   * AI response
   * Feedback
   * Improved answer
6. Save session → Firestore
7. Return response → App
8. Optional → convert to speech (TTS)

---

# 6. 📱 Mobile App Architecture (Expo)

## Folder Structure

```
src/
 ├── app/ (Expo Router)
 ├── components/
 ├── features/
 │    ├── auth/
 │    ├── practice/
 │    ├── feedback/
 ├── services/
 │    ├── firebase.ts
 │    ├── ai.service.ts
 │    ├── audio.service.ts
 ├── store/
 ├── hooks/
 ├── utils/
 └── types/
```

---

## Key Modules

### 1. Auth Module

* Firebase Email/Google login
* User profile

---

### 2. Practice Module

* Scenario selection
* Chat UI (like ChatGPT)
* Voice input

---

### 3. Feedback Module

* Grammar corrections
* Suggested improvements
* Scores

---

### 4. Session History

* Previous conversations
* Replay answers

---

# 7. 🔥 Firebase Architecture

## 7.1 Authentication

* Email/password
* Google login

---

## 7.2 Firestore Schema

### Users Collection

```
users/
  {userId}
    name
    email
    createdAt
    plan (free/premium)
```

---

### Sessions Collection

```
sessions/
  {sessionId}
    userId
    scenarioType (interview/sales)
    createdAt
    score
```

---

### Messages Collection

```
sessions/{sessionId}/messages/
  {messageId}
    role (user/ai)
    text
    audioUrl
    feedback
    createdAt
```

---

## 7.3 Storage

```
/audio/
   /{userId}/{sessionId}/{messageId}.mp3
```

---

## 7.4 Cloud Functions (Core Logic)

### Functions

#### 1. processUserAudio

* Trigger: HTTP
* Steps:

  * Download audio
  * Convert → text (Whisper)
  * Call GPT
  * Generate feedback
  * Save to Firestore

---

#### 2. generateSessionSummary

* Trigger: End session
* Returns:

  * Score
  * Weak areas
  * Suggestions

---

#### 3. subscriptionHandler

* Handle payments (Razorpay/Stripe)

---

# 8. 🧠 AI Prompt Design (Critical)

### System Prompt Example

```
You are an expert English coach and interviewer.

Context:
- Scenario: SDE Interview
- User level: Intermediate

Tasks:
1. Respond like a real interviewer
2. After user answer:
   - Provide feedback (grammar, clarity)
   - Suggest improved answer
   - Give score (1–10)
```

---

### Input Example

```
User: "I have worked on React Native app and improve performance"
```

---

### Output Structure (JSON)

```
{
  "aiResponse": "Can you explain how you improved performance?",
  "feedback": {
    "grammar": "...",
    "clarity": "...",
    "suggestion": "..."
  },
  "improvedAnswer": "...",
  "score": 7
}
```

---

# 9. 🔐 Security Rules (Firestore)

Basic rules:

```js
match /sessions/{sessionId} {
  allow read, write: if request.auth.uid == resource.data.userId;
}
```

---

# 10. 📡 API Design (Cloud Functions)

## Endpoint: `/process-audio`

### Request:

```
{
  userId,
  sessionId,
  audioUrl,
  scenarioType
}
```

### Response:

```
{
  aiResponse,
  feedback,
  improvedAnswer,
  score
}
```

---

# 11. ⚡ Performance Considerations

* Use streaming responses (future)
* Cache frequent prompts
* Compress audio before upload
* Use background uploads

---

# 12. 💰 Monetization

### Free:

* Limited sessions/day
* Text-only

### Premium:

* Voice conversations
* Resume-based questions
* Advanced analytics

---

# 13. 🚀 Deployment

## Mobile

* Expo EAS build
* Play Store

---

## Backend

* Firebase deploy:

```
firebase deploy
```

---

# 14. 📊 Future Enhancements

* Resume upload → AI questions
* Real-time voice (WebRTC)
* AI interviewer personality modes
* Leaderboard / gamification

---

# 15. 🗺️ MVP Roadmap

### Week 1

* Auth + basic chat
* GPT integration

### Week 2

* Voice input/output
* Firestore integration

### Week 3

* Feedback system
* Deploy MVP

---

# 16. ⚠️ Risks & Mitigation

| Risk         | Solution                  |
| ------------ | ------------------------- |
| High AI cost | Limit tokens + caching    |
| Latency      | Async processing          |
| Poor UX      | Keep responses fast (<3s) |

---

# 17. ✅ Summary

You are building:

> A **real-time AI-powered conversation simulator**
> focused on **practical English + career outcomes**

---

## Next Step (Recommended)

If you want to go deeper, I can:

* Design **exact Cloud Functions code (Node.js)**
* Give **ready-to-use Expo screens (UI + logic)**
* Provide **production prompt templates (very important)**

Just tell me 👍
