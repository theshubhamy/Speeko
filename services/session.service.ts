import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  updateDoc,
  arrayUnion
} from 'firebase/firestore';
import { db } from './firebase';
import { Session, Message } from '@/types';

const SESSIONS_COLLECTION = 'sessions';

export const SessionService = {
  /**
   * Create a new session in Firestore
   */
  async createSession(session: Session): Promise<void> {
    const sessionRef = doc(db, SESSIONS_COLLECTION, session.id);
    await setDoc(sessionRef, {
      ...session,
      createdAt: serverTimestamp(),
    });
  },

  /**
   * Add a message to an existing session
   */
  async addMessage(sessionId: string, message: Message): Promise<void> {
    const sessionRef = doc(db, SESSIONS_COLLECTION, sessionId);
    await updateDoc(sessionRef, {
      messages: arrayUnion(message),
    });
  },

  /**
   * End a session and save the final score, updating user stats
   */
  async endSession(sessionId: string, userId: string, score?: number): Promise<void> {
    const sessionRef = doc(db, SESSIONS_COLLECTION, sessionId);
    await updateDoc(sessionRef, {
      isActive: false,
      endedAt: Date.now(),
      score: score ?? null,
    });

    // Update user stats
    if (score !== undefined) {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const prevTotal = userData.totalSessions || 0;
        const prevAvg = userData.averageScore || 0;
        
        const newTotal = prevTotal + 1;
        const newAvg = (prevAvg * prevTotal + score) / newTotal;
        
        await updateDoc(userRef, {
          totalSessions: newTotal,
          averageScore: newAvg,
        });
      }
    }
  },

  /**
   * Get all sessions for a specific user
   */
  async getUserSessions(userId: string): Promise<Session[]> {
    const sessionsRef = collection(db, SESSIONS_COLLECTION);
    const q = query(
      sessionsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        // Convert Firestore timestamp back to number if needed, 
        // but here we keep our own createdAt field in the object if we want.
        // Actually, let's use the object's createdAt if available.
        createdAt: data.createdAt?.toMillis?.() || data.createdAt || Date.now(),
      } as Session;
    });
  },

  /**
   * Get a single session by ID
   */
  async getSession(sessionId: string): Promise<Session | null> {
    const sessionRef = doc(db, SESSIONS_COLLECTION, sessionId);
    const docSnap = await getDoc(sessionRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Session;
    }
    return null;
  }
};
