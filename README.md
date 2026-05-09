# Speeko 🎙️

### Elevate Your Communication with AI-Powered Practice

[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)](https://firebase.google.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)

**Speeko** is a premium, AI-driven English practice application designed to help professionals and students master real-world communication. Whether you're preparing for a high-stakes SDE interview, a critical sales pitch, or a daily workplace meeting, Speeko provides a safe, contextual environment to sharpen your skills with real-time feedback.

---

## ✨ Key Features

-   **🎙️ Voice-First Interaction**: Engage in realistic, flowing conversations using state-of-the-art Speech-to-Text (Whisper) and natural AI Text-to-Speech.
-   **🎯 Context-Aware Scenarios**: Practice specific scenarios like Software Engineering interviews, Client Meetings, and Behavioral rounds.
-   **🧠 Intelligent AI Feedback**: Receive instant, granular feedback on grammar, clarity, and tone, along with a performance score and "better way to say it" suggestions.
-   **💎 Premium Design System**: A stunning, dark-mode first interface built with fluid animations and a high-end aesthetic.
-   **📊 Progress Tracking**: Keep a history of your practice sessions and watch your communication scores improve over time.

---

## 🛠️ Tech Stack

### Frontend (Mobile)
-   **Framework**: [Expo](https://expo.dev/) (React Native)
-   **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
-   **State Management**: [Zustand](https://github.com/pmndrs/zustand)
-   **Animations**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
-   **Styling**: Premium Custom Design System

### Backend & AI Layer
-   **Platform**: [Firebase](https://firebase.google.com/) (Auth, Firestore, Storage, Cloud Functions)
-   **LLM**: OpenAI GPT-4o / Gemini 1.5 Pro
-   **Speech-to-Text**: OpenAI Whisper
-   **Text-to-Speech**: OpenAI TTS / ElevenLabs

---

## 🚀 Getting Started

### Prerequisites
-   [Node.js](https://nodejs.org/) (v18 or later)
-   [Expo Go](https://expo.dev/go) on your mobile device or an Emulator
-   Firebase Account & API Keys

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/theshubhamy/Speeko.git
    cd Speeko
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**:
    Create a `.env` file in the root and add your configuration:
    ```env
    EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    # ... other config
    ```

4.  **Start the development server**:
    ```bash
    npx expo start
    ```

---

## 🗺️ Roadmap

-   [ ] **AI Interviewer Personalities**: Choose from "Strict Manager" to "Friendly Recruiter."
-   [ ] **Resume Analysis**: Upload your resume to get personalized interview questions.
-   [ ] **Real-time Voice (WebRTC)**: Ultra-low latency voice interaction.
-   [ ] **Detailed Analytics Dashboard**: Visualize your progress across different communication categories.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ for better communication.
</p>
