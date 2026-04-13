import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  doc, 
  getDoc, 
  or,
  setDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { Scenario } from '@/types';
import { SCENARIOS } from '@/constants/scenarios';

const scenariosRef = collection(db, 'scenarios');

export const ScenarioService = {
  /**
   * Fetches all available scenarios for a user.
   * Includes system scenarios (createdBy == null) and user's own scenarios.
   */
  async getScenarios(userId: string): Promise<Scenario[]> {
    try {
      const q = query(
        scenariosRef,
        or(
          where('isPublic', '==', true),
          where('createdBy', '==', userId)
        )
      );

      const snap = await getDocs(q);
      const scenarios = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Scenario));

      // If no scenarios in DB, seed with defaults (one-time or fallback)
      if (scenarios.length === 0) {
        return SCENARIOS;
      }

      return scenarios;
    } catch (error) {
      console.error('Error fetching scenarios:', error);
      return SCENARIOS; // Fallback to local
    }
  },

  /**
   * Creates a new custom scenario
   */
  async createScenario(userId: string, scenario: Omit<Scenario, 'id'>): Promise<Scenario> {
    const docRef = await addDoc(scenariosRef, {
      ...scenario,
      createdBy: userId,
      isPublic: false,
      createdAt: serverTimestamp(),
    });

    return {
      id: docRef.id,
      ...scenario,
      createdBy: userId,
    };
  },

  /**
   * Seeds default scenarios if they don't exist
   */
  async seedScenarios(): Promise<void> {
    for (const scenario of SCENARIOS) {
      const ref = doc(db, 'scenarios', scenario.id);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, {
          ...scenario,
          isPublic: true,
          createdBy: 'system',
          createdAt: serverTimestamp(),
        });
      }
    }
  }
};
