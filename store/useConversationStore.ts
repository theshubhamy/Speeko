import { create } from 'zustand';
import { Message, Session, ScenarioType } from '@/types';

interface ConversationState {
  // Active session
  activeSession: Session | null;
  messages: Message[];
  isAiTyping: boolean;
  showFeedback: boolean;
  activeFeedbackMessageId: string | null;

  // History
  sessions: Session[];

  // Actions
  startSession: (scenarioType: ScenarioType, scenarioTitle: string, context?: Session['context']) => void;
  addUserMessage: (text: string) => void;
  addAiMessage: (message: Message) => void;
  setIsAiTyping: (typing: boolean) => void;
  setShowFeedback: (show: boolean, messageId?: string) => void;
  endSession: (score?: number) => void;
  clearActiveSession: () => void;
}

let messageCounter = 0;
const generateId = () => `msg_${Date.now()}_${++messageCounter}`;
const generateSessionId = () => `session_${Date.now()}`;

export const useConversationStore = create<ConversationState>((set, get) => ({
  activeSession: null,
  messages: [],
  isAiTyping: false,
  showFeedback: false,
  activeFeedbackMessageId: null,
  sessions: [],

  startSession: (scenarioType, scenarioTitle, context) => {
    const session: Session = {
      id: generateSessionId(),
      userId: 'user_1', // Replace with auth
      scenarioType,
      scenarioTitle,
      messages: [],
      context,
      createdAt: Date.now(),
      isActive: true,
    };
    set({ activeSession: session, messages: [], showFeedback: false, activeFeedbackMessageId: null });
  },

  addUserMessage: (text) => {
    const message: Message = {
      id: generateId(),
      role: 'user',
      text,
      timestamp: Date.now(),
    };
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  addAiMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message],
      isAiTyping: false,
    }));
  },

  setIsAiTyping: (typing) => set({ isAiTyping: typing }),

  setShowFeedback: (show, messageId) =>
    set({ showFeedback: show, activeFeedbackMessageId: messageId || null }),

  endSession: (score) => {
    const { activeSession, messages } = get();
    if (!activeSession) return;

    const completedSession: Session = {
      ...activeSession,
      messages,
      score,
      endedAt: Date.now(),
      isActive: false,
    };

    set((state) => ({
      sessions: [completedSession, ...state.sessions],
      activeSession: null,
      messages: [],
      showFeedback: false,
      activeFeedbackMessageId: null,
    }));
  },

  clearActiveSession: () =>
    set({ activeSession: null, messages: [], showFeedback: false, activeFeedbackMessageId: null }),
}));
