import { AIResponse, Message, ScenarioType, Session } from '@/types';
import * as FileSystem from 'expo-file-system';

// ─── Gemini Configuration ───────────────────────────────────────────────────

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const MODEL_ID = 'gemini-3.1-flash-lite-preview';

// ─── Mock AI Responses (Opening fallback) ───────────────────────────────────

const MOCK_OPENING_MESSAGES: Record<ScenarioType, string[]> = {
  interview: [
    "Welcome! I'll be your interviewer today. Let's start with a classic — can you tell me about yourself and your experience as a developer?",
    "Hi there! I'm excited to interview you today. Let's begin — what motivated you to pursue a career in software development?",
    "Good morning! Thanks for joining. Let's kick things off — walk me through a challenging project you've worked on recently.",
  ],
  sales: [
    "Hello, I'm the head of procurement. I've got 10 minutes — tell me why I should consider your product.",
    "Hi, I received your email about your solution. I'm curious but skeptical. What problem exactly does it solve for us?",
    "Good afternoon! I'm looking for a new vendor. Pitch me your best offering.",
  ],
  client: [
    "Hi! I wanted to catch up on the project status. We're approaching the deadline — can you give me an update?",
    "Hello! I've been reviewing the deliverables and I have some concerns. Can we discuss?",
    "Good morning! Before our quarterly review, I'd like to understand where things stand.",
  ],
  workplace: [
    "Alright team, let's go around for standup. What did you work on yesterday, what's the plan for today, and any blockers?",
    "Hey! The manager asked us to prepare a brief update for the all-hands meeting. Can you summarize your team's progress?",
    "Good morning! We need to discuss the sprint retrospective. What went well and what could we improve?",
  ],
};

// ─── AI Service ──────────────────────────────────────────────────────────────

export const AIService = {
  /**
   * Get the opening message for a scenario
   */
  getOpeningMessage(scenarioType: ScenarioType): string {
    const messages = MOCK_OPENING_MESSAGES[scenarioType];
    return messages[Math.floor(Math.random() * messages.length)];
  },

  /**
   * 🎙️ Transcribe Audio using Gemini REST API (Fetch)
   */
  async transcribeAudio(uri: string): Promise<string> {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const response = await fetch(
        `${BASE_URL}/${MODEL_ID}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                {
                  inlineData: {
                    mimeType: 'audio/m4a',
                    data: base64,
                  },
                },
                { text: "Transcribe the audio accurately. Keep any filler words like 'uh' or 'um'. Return ONLY the transcribed text, nothing else." },
              ],
            }],
          }),
        }
      );

      const result = await response.json();

      if (result.error) {
        console.error('Gemini Transcription API Error:', result.error);
        throw new Error(`API Error: ${result.error.message}`);
      }

      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        console.warn('Gemini empty transcription result:', JSON.stringify(result, null, 2));
        throw new Error('Gemini returned empty transcription');
      }

      // Clean markdown if Gemini wraps it
      return text.replace(/```text|```/g, '').trim();
    } catch (error: any) {
      console.error('Transcription Flow Error:', error.message);
      throw new Error('Failed to transcribe audio');
    }
  },

  /**
   * Process user message and generate AI response via REST API (Fetch)
   */
  async processMessage(
    userText: string,
    scenarioType: ScenarioType,
    history: Message[],
    context?: Session['context']
  ): Promise<AIResponse> {
    if (!GEMINI_API_KEY) {
      console.warn('Gemini API Key missing. Ensure EXPO_PUBLIC_GEMINI_API_KEY is in .env');
      throw new Error('AI Service not configured');
    }

    // 1. Build System Instruction: HIGHLY DIRECTIVE 4-STEP DRILL
    const systemInstruction = `You are the Speeko Drill Master. You must follow a strict 4-step practice loop. DO NOT DEVIATE.

### THE 4-STEP LOOP
1. **AI ASKS**: Start with a single, realistic question for the scenario: ${scenarioType}.
2. **USER ANSWERS**: User provides an audio-transcribed response.
3. **AI EVALUATES & DRILLS**: 
   - You MUST calculate a score (1-10) based on grammar, vocabulary, and professional tone.
   - If Score is **LESS THAN 8**:
     - You MUST provide the "improvedAnswer".
     - You MUST explicitly say: "That needs work. Here is how to say it better. Please try answering the **SAME question** again using my suggestion."
     - **FORBIDDEN**: You are NOT allowed to ask a new question.
   - If Score is **8 or HIGHER**:
     - You MUST congratulate them.
     - You MUST then ask a **NEW question** for the next part of the ${scenarioType} scenario.

### GUIDELINES
- Be strict but encouraging.
- Focus on Resume/JD relevance if provided.
- Ensure "aiResponse" contains ONLY the feedback and the instruction for the next step.
- The "improvedAnswer" should be natural, professional, and slightly challenging.

CONTEXT:
${context?.resume ? `- USER RESUME: ${context.resume}` : ''}
${context?.jobDescription ? `- TARGET JOB DESCRIPTION: ${context.jobDescription}` : ''}

### RESPONSE FORMAT (Strict JSON)
{
  "aiResponse": "Brief feedback + The Instruction (e.g. 'Retry the same question' OR 'Excellent! Next question: [New Question]')",
  "feedback": {
    "grammar": "Direct list of mistakes or 'Perfect'",
    "clarity": "How to sound more native/professional",
    "suggestion": "Specific tip for improvement"
  },
  "improvedAnswer": "The perfect version of the user's last answer",
  "score": 1-10
}`;

    try {
      // 2. Format history for Gemini
      let chatHistory = history.map((msg) => ({
        role: msg.role === 'ai' ? 'model' : 'user',
        parts: [{ text: msg.text }],
      }));

      // Gemini requires the history to start with a 'user' message.
      if (chatHistory.length > 0 && chatHistory[0].role === 'model') {
        chatHistory.shift();
      }

      // Add the latest user message
      chatHistory.push({
        role: 'user',
        parts: [{ text: userText }]
      });

      // 3. Make REST Request using Fetch
      const response = await fetch(
        `${BASE_URL}/${MODEL_ID}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: chatHistory,
            systemInstruction: {
              // Note: role is usually omitted for systemInstruction in REST
              parts: [{ text: systemInstruction }],
            },
            generationConfig: {
              responseMimeType: 'application/json',
            },
          }),
        }
      );

      const result = await response.json();

      if (result.error) {
        console.error('Gemini Chat API Error:', result.error);
        throw new Error(`API Error: ${result.error.message}`);
      }

      const responseText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!responseText) {
        console.warn('Gemini empty response result:', JSON.stringify(result, null, 2));
        throw new Error('Gemini returned empty response');
      }

      // 4. Sanitize and Parse JSON
      const cleanJson = responseText.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (error: any) {
      console.error('Gemini REST Error:', error.message);
      throw error;
    }
  },

  /**
   * Generate session summary
   */
  generateSessionSummary(messages: Message[]): {
    averageScore: number;
    totalMessages: number;
    strengths: string[];
    improvements: string[];
  } {
    const aiMessages = messages.filter((m) => m.role === 'ai' && m.score);
    const avgScore =
      aiMessages.length > 0
        ? aiMessages.reduce((acc, m) => acc + (m.score || 0), 0) / aiMessages.length
        : 0;

    return {
      averageScore: Math.round(avgScore * 10) / 10,
      totalMessages: messages.filter((m) => m.role === 'user').length,
      strengths: ['Consistent communication', 'Adaptive context usage'],
      improvements: ['Expound more on technical points', 'Reduce hesitation'],
    };
  },
};
