export interface DetectedObject {
  id: number;
  type: string;
  confidence: number;
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface CountResult {
  id: string;
  objects: DetectedObject[];
  timestamp: number;
  imageUri: string;
  settings: CountSettings;
  notes?: string;
}

export interface CountSettings {
  minConfidence: number;
  categories: string[];
  selectedCategory?: string;
  countMode: 'single' | 'multiple';
  showBoundingBoxes: boolean;
  showConfidence: boolean;
  autoSave: boolean;
}

export interface CountHistory {
  results: CountResult[];
  lastUpdated: number;
}

export interface CountStore {
  history: CountResult[];
  settings: CountSettings;
  addResult: (result: CountResult) => void;
  removeResult: (id: string) => void;
  updateSettings: (settings: Partial<CountSettings>) => void;
  clearHistory: () => void;
}