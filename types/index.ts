// ─── Scenario Types ──────────────────────────────────────────────────────────

export type ScenarioType = 'interview' | 'sales' | 'client' | 'workplace' | 'personal';

export interface Scenario {
  id: string;
  type: ScenarioType;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  createdBy?: string; // UID of user or null for system
  isPublic?: boolean;
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
  nextQuestion?: string;
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
  nextQuestion?: string;
}
