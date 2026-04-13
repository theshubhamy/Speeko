import { create } from 'zustand';
import { Scenario, ScenarioType } from '@/types';
import { ScenarioService } from '@/services/scenario.service';
import { SCENARIOS, SCENARIO_CATEGORIES } from '@/constants/scenarios';

interface ScenarioState {
  scenarios: Scenario[];
  categories: typeof SCENARIO_CATEGORIES;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchScenarios: (userId: string) => Promise<void>;
  createScenario: (userId: string, scenario: Omit<Scenario, 'id'>) => Promise<void>;
  getScenariosByType: (type: ScenarioType) => Scenario[];
}

export const useScenarioStore = create<ScenarioState>((set, get) => ({
  scenarios: SCENARIOS, // Initial fallback
  categories: SCENARIO_CATEGORIES,
  isLoading: false,
  error: null,

  fetchScenarios: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const scenarios = await ScenarioService.getScenarios(userId);
      set({ scenarios, isLoading: false });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },

  createScenario: async (userId, scenarioData) => {
    set({ isLoading: true, error: null });
    try {
      const newScenario = await ScenarioService.createScenario(userId, scenarioData);
      set((state) => ({
        scenarios: [...state.scenarios, newScenario],
        isLoading: false
      }));
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
      throw e;
    }
  },

  getScenariosByType: (type) => {
    return get().scenarios.filter((s) => s.type === type);
  },
}));
