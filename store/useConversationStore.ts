import { create } from 'zustand';
import { Message, Session, ScenarioType } from '@/types';
import { SessionService } from '@/services/session.service';
import { useAuthStore } from './useAuthStore';

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
  fetchSessions: (userId: string) => Promise<void>;
  isFetchingSessions: boolean;
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
  isFetchingSessions: false,

  startSession: async (scenarioType, scenarioTitle, context) => {
    const user = useAuthStore.getState().user;
    const userId = user?.id || 'anonymous';
    
    const session: Session = {
      id: generateSessionId(),
      userId,
      scenarioType,
      scenarioTitle,
      messages: [],
      context,
      createdAt: Date.now(),
      isActive: true,
    };

    set({ activeSession: session, messages: [], showFeedback: false, activeFeedbackMessageId: null });
    
    // Sync to Firestore
    try {
      await SessionService.createSession(session);
    } catch (error) {
      console.error('Failed to sync session start to Firestore:', error);
    }
  },

  addUserMessage: async (text) => {
    const { activeSession } = get();
    const message: Message = {
      id: generateId(),
      role: 'user',
      text,
      timestamp: Date.now(),
    };
    
    set((state) => ({
      messages: [...state.messages, message],
    }));

    // Sync to Firestore
    if (activeSession) {
      try {
        await SessionService.addMessage(activeSession.id, message);
      } catch (error) {
        console.error('Failed to sync user message to Firestore:', error);
      }
    }
  },

  addAiMessage: async (message) => {
    const { activeSession } = get();
    
    set((state) => ({
      messages: [...state.messages, message],
      isAiTyping: false,
    }));

    // Sync to Firestore
    if (activeSession) {
      try {
        await SessionService.addMessage(activeSession.id, message);
      } catch (error) {
        console.error('Failed to sync AI message to Firestore:', error);
      }
    }
  },

  setIsAiTyping: (typing) => set({ isAiTyping: typing }),

  setShowFeedback: (show, messageId) =>
    set({ showFeedback: show, activeFeedbackMessageId: messageId || null }),

  endSession: async (score) => {
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

    // Sync to Firestore
    try {
      await SessionService.endSession(activeSession.id, activeSession.userId, score);
      
      // Update local profile stats
      if (score !== undefined) {
        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
          const prevTotal = currentUser.totalSessions || 0;
          const prevAvg = currentUser.averageScore || 0;
          const newTotal = prevTotal + 1;
          const newAvg = (prevAvg * prevTotal + score) / newTotal;
          
          useAuthStore.getState().updateProfile({
            totalSessions: newTotal,
            averageScore: newAvg,
          });
        }
      }
    } catch (error) {
      console.error('Failed to sync session end to Firestore:', error);
    }
  },

  clearActiveSession: () =>
    set({ activeSession: null, messages: [], showFeedback: false, activeFeedbackMessageId: null }),

  fetchSessions: async (userId) => {
    set({ isFetchingSessions: true });
    try {
      const sessions = await SessionService.getUserSessions(userId);
      set({ sessions, isFetchingSessions: false });
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
      set({ isFetchingSessions: false });
    }
  },
}));
