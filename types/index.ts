// ─── Scenario Types ──────────────────────────────────────────────────────────

export type ScenarioType = 'interview' | 'sales' | 'client' | 'workplace';

export interface Scenario {
  id: string;
  type: ScenarioType;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
}

// ─── Message Types ───────────────────────────────────────────────────────────

export interface Feedback {
  grammar: string;
  clarity: string;
  suggestion: string;
}

export interface Message {
  id: string;
  role: 'user' | 'ai' | 'system';
  text: string;
  feedback?: Feedback;
  improvedAnswer?: string;
  score?: number;
  timestamp: number;
}

export interface SessionContext {
  resume?: string;
  jobDescription?: string;
}

// ─── Session Types ───────────────────────────────────────────────────────────

export interface Session {
  id: string;
  userId: string;
  scenarioType: ScenarioType;
  scenarioTitle: string;
  messages: Message[];
  context?: SessionContext;
  score?: number;
  createdAt: number;
  endedAt?: number;
  isActive: boolean;
}

// ─── User Types ──────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: 'free' | 'premium';
  createdAt: number;
  totalSessions: number;
  averageScore: number;
  streak: number;
}

// ─── AI Response ─────────────────────────────────────────────────────────────

export interface AIResponse {
  aiResponse: string;
  feedback: Feedback;
  improvedAnswer: string;
  score: number;
}
