import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CountStore, CountSettings } from '@/types/counting';

const DEFAULT_SETTINGS: CountSettings = {
  minConfidence: 0.7,
  categories: [],
  countMode: 'single',
  showBoundingBoxes: true,
  showConfidence: true,
  autoSave: true,
};

export const useCountStore = create<CountStore>()(
  persist(
    (set) => ({
      history: [],
      settings: DEFAULT_SETTINGS,
      addResult: (result) =>
        set((state) => ({
          history: [result, ...state.history].slice(0, 100), // Keep last 100 results
        })),
      removeResult: (id) =>
        set((state) => ({
          history: state.history.filter((result) => result.id !== id),
        })),
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'count-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);