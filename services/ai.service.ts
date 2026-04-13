import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIResponse, Message, ScenarioType, Session } from '@/types';

// ─── Gemini Initialization ───────────────────────────────────────────────────

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig: {
    responseMimeType: 'application/json',
  },
});

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
   * Process user message and generate AI response
   * Integrated with Gemini Pro (direct client-side)
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

    // 1. Build System Instruction
    const systemInstruction = `You are Speeko AI, an expert English coach and career mentor.
Scenario: ${scenarioType}

CONTEXT:
${context?.resume ? `- USER RESUME: ${context.resume}` : ''}
${context?.jobDescription ? `- TARGET JOB DESCRIPTION: ${context.jobDescription}` : ''}

INSTRUCTIONS:
1. Stay in character for the scenario.
2. If a Resume is provided, ask hyper-relevant questions about their specific experience.
3. If a JD is provided, evaluate their answers against the job's key requirements.
4. Provide constructive feedback on grammar and professional clarity.
5. Suggest a more polished version of the user's last answer.

RESPONSE FORMAT (Strict JSON):
{
  "aiResponse": "Your next reply or question",
  "feedback": {
    "grammar": "Correction of any mistakes",
    "clarity": "How to sound more professional",
    "suggestion": "Tip for improvement based on Resume/JD context"
  },
  "improvedAnswer": "A high-fidelity version of what the user just said",
  "score": 1-10
}`;

    try {
      // 2. Format history for Gemini
      const chatHistory = history.map((msg) => ({
        role: msg.role === 'ai' ? 'model' : 'user',
        parts: [{ text: msg.text }],
      }));

      // 3. Start Chat with Gemini
      const chat = model.startChat({
        history: chatHistory,
        systemInstruction: systemInstruction,
      });

      const result = await chat.sendMessage(userText);
      const responseText = result.response.text();

      // Parse JSON from Gemini
      return JSON.parse(responseText);
    } catch (error) {
      console.error('Gemini Service Error:', error);
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
