import { AIResponse, Message, ScenarioType } from '@/types';

// ─── System Prompts per Scenario ─────────────────────────────────────────────

const SYSTEM_PROMPTS: Record<ScenarioType, string> = {
  interview: `You are an expert English coach and technical interviewer at a top tech company.
Context: SDE/Software Developer Interview
Tasks:
1. Ask relevant interview questions one at a time
2. After each user answer, provide feedback on grammar, clarity, and confidence
3. Suggest an improved version of their answer
4. Give a score from 1-10
Keep responses concise and encouraging.`,

  sales: `You are an expert English coach and sales trainer.
Context: Sales pitch or cold call simulation
Tasks:
1. Play the role of a potential client or prospect
2. After each user response, provide feedback on persuasion, clarity, and grammar
3. Suggest improvements for better impact
4. Give a score from 1-10
Be realistic but supportive.`,

  client: `You are an expert English coach simulating a client interaction.
Context: Professional client communication
Tasks:
1. Act as a client in a business meeting or call
2. After each user response, provide feedback on professionalism, grammar, and clarity
3. Suggest improvements
4. Give a score from 1-10
Test their ability to handle client expectations.`,

  workplace: `You are an expert English coach for workplace communication.
Context: Daily workplace interactions (standups, meetings, emails)
Tasks:
1. Simulate workplace conversations
2. After each user response, provide feedback on conciseness, grammar, and appropriateness
3. Suggest improvements
4. Give a score from 1-10
Focus on natural, professional communication.`,
};

// ─── Mock AI Responses ───────────────────────────────────────────────────────

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

const MOCK_FOLLOW_UPS: Record<ScenarioType, string[]> = {
  interview: [
    "That's interesting! Can you elaborate on how you handled the technical challenges in that project?",
    "Good point. Now, tell me about a time you had a disagreement with a teammate. How did you resolve it?",
    "Tell me about your approach to debugging. Walk me through how you'd fix a production issue.",
    "How do you stay updated with new technologies? What's something new you've learned recently?",
    "Where do you see yourself in 3 years? What kind of impact do you want to make?",
  ],
  sales: [
    "Hmm, that sounds promising, but how does it compare to what we're currently using?",
    "What's the pricing model? And can you share any case studies from similar companies?",
    "I'm not convinced yet. Our current solution works fine. Why should we switch?",
    "What kind of support and onboarding do you provide?",
  ],
  client: [
    "I see. And what about the features we discussed last week? Are those on track?",
    "That's concerning. What's your plan to get back on schedule?",
    "Can you walk me through the next milestones and when we can expect delivery?",
    "I appreciate the transparency. What resources do you need from our end?",
  ],
  workplace: [
    "Thanks for the update! Any technical debt we should address this sprint?",
    "Good. How's the team morale? Anything we can do to improve the workflow?",
    "What's the biggest risk for this release in your opinion?",
    "Can you document that process and share it with the team?",
  ],
};

// ─── Mock Feedback Generator ─────────────────────────────────────────────────

function generateMockFeedback(userText: string): { feedback: AIResponse['feedback']; improvedAnswer: string; score: number } {
  const wordCount = userText.split(/\s+/).length;
  const hasGoodLength = wordCount > 15;
  const hasFillerWords = /\b(um|uh|like|basically|you know|actually)\b/i.test(userText);
  const hasGrammarIssues = /\b(i have|i am|we was|they is|me and)\b/i.test(userText);

  let score = 6;
  if (hasGoodLength) score += 1;
  if (!hasFillerWords) score += 1;
  if (!hasGrammarIssues) score += 1;
  score = Math.min(10, Math.max(4, score + Math.floor(Math.random() * 2)));

  const grammarNotes = hasGrammarIssues
    ? "Watch subject-verb agreement and pronoun usage. For example, use 'My colleague and I' instead of 'Me and my colleague'."
    : hasFillerWords
    ? "Try to minimize filler words like 'um', 'uh', 'like', and 'basically'. They can make you sound less confident."
    : "Good grammar overall! Your sentence structure is clear and professional.";

  const clarityNotes = hasGoodLength
    ? "Good detail level. Your response is well-structured and informative."
    : "Try to expand your answers with specific examples and details. The STAR method (Situation, Task, Action, Result) works great.";

  const suggestion =
    score >= 8
      ? "Excellent response! Consider adding a brief quantifiable result to make it even more impactful."
      : score >= 6
      ? "Good foundation. Add more specific examples and try to quantify your impact (e.g., 'improved performance by 40%')."
      : "Focus on being more specific. Instead of general statements, share concrete examples from your experience.";

  // Generate an improved version
  const improved = userText.length > 20
    ? `Here's a more polished version: "In my previous role, I took the initiative to ${userText.toLowerCase().includes('team') ? 'lead the team in' : 'spearhead'} this effort, which resulted in measurable improvements. I approached it systematically by first analyzing the problem, then implementing a solution, and finally validating the results with stakeholders."`
    : `Try something like: "That's a great question. In my experience, I've found that a structured approach works best. Let me give you a specific example..."`;

  return {
    feedback: {
      grammar: grammarNotes,
      clarity: clarityNotes,
      suggestion,
    },
    improvedAnswer: improved,
    score,
  };
}

// ─── AI Service ──────────────────────────────────────────────────────────────

let conversationIndex = 0;

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
   * In production, this calls OpenAI API via Cloud Function
   */
  async processMessage(
    userText: string,
    scenarioType: ScenarioType,
    _conversationHistory: Message[]
  ): Promise<AIResponse> {
    // Simulate API latency
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));

    const { feedback, improvedAnswer, score } = generateMockFeedback(userText);

    // Pick a follow-up question
    const followUps = MOCK_FOLLOW_UPS[scenarioType];
    const aiResponse = followUps[conversationIndex % followUps.length];
    conversationIndex++;

    return {
      aiResponse,
      feedback,
      improvedAnswer,
      score,
    };
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
      strengths: ['Clear communication', 'Good examples', 'Professional tone'],
      improvements: ['Add more specific details', 'Reduce filler words', 'Use STAR method'],
    };
  },
};
