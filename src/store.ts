import { create } from 'zustand';
import { BuildingData } from './types';
import { v4 as uuidv4 } from 'uuid';

interface AppState {
  buildings: BuildingData[];
  selectedId: string | null;
  environmentMode: 'abstract' | 'realistic';
  weathering: boolean;
  lightIntensity: number;
  addBuilding: (x: number, z: number, options?: Partial<BuildingData>) => void;
  updateBuilding: (id: string, data: Partial<BuildingData>) => void;
  deleteBuilding: (id: string) => void;
  selectBuilding: (id: string | null) => void;
  moveBuilding: (id: string, x: number, z: number) => void;
  toggleEnvironmentMode: () => void;
  toggleWeathering: () => void;
  generateCityBlock: () => void;
  setLightIntensity: (intensity: number) => void;
}

export const useStore = create<AppState>((set) => ({
  buildings: [
    {
      id: uuidv4(),
      x: 0,
      z: 0,
      seed: 1234,
      floors: 12,
      baseWidth: 6,
      baseDepth: 6,
      coreHeight: 2,
      style: 'stacked',
      rotationY: 0
    }
  ],
  selectedId: null,
  environmentMode: 'abstract',
  weathering: false,
  lightIntensity: 1.5,
  addBuilding: (x, z, options) => set((state) => ({
    buildings: [...state.buildings, {
      id: uuidv4(),
      x,
      z,
      seed: Math.floor(Math.random() * 10000),
      floors: 10 + Math.floor(Math.random() * 10),
      baseWidth: 4 + Math.random() * 4,
      baseDepth: 4 + Math.random() * 4,
      coreHeight: 1 + Math.random() * 3,
      style: ['monolith', 'stacked', 'tower', 'podium', 'cantilever', 'slab'][Math.floor(Math.random() * 6)] as any,
      rotationY: 0,
      ...options
    }]
  })),
  updateBuilding: (id, data) => set((state) => ({
    buildings: state.buildings.map(b => b.id === id ? { ...b, ...data } : b)
  })),
  deleteBuilding: (id) => set((state) => ({
    buildings: state.buildings.filter(b => b.id !== id),
    selectedId: state.selectedId === id ? null : state.selectedId
  })),
  selectBuilding: (id) => set({ selectedId: id }),
  moveBuilding: (id, x, z) => set((state) => ({
    buildings: state.buildings.map(b => b.id === id ? { ...b, x, z } : b)
  })),
  toggleEnvironmentMode: () => set((state) => ({
    environmentMode: state.environmentMode === 'abstract' ? 'realistic' : 'abstract'
  })),
  toggleWeathering: () => set((state) => ({
    weathering: !state.weathering
  })),
  generateCityBlock: () => set(() => {
    const newBuildings: BuildingData[] = [];
    const blockSize = 4;
    const spacing = 12;
    const startX = -((blockSize - 1) * spacing) / 2;
    const startZ = -((blockSize - 1) * spacing) / 2;

    for (let i = 0; i < blockSize; i++) {
      for (let j = 0; j < blockSize; j++) {
        // Skip some spots randomly to make it look organic
        if (Math.random() > 0.85) continue;
        
        newBuildings.push({
          id: uuidv4(),
          x: startX + i * spacing + (Math.random() * 2 - 1),
          z: startZ + j * spacing + (Math.random() * 2 - 1),
          seed: Math.floor(Math.random() * 10000),
          floors: 5 + Math.floor(Math.random() * 25),
          baseWidth: 4 + Math.random() * 5,
          baseDepth: 4 + Math.random() * 5,
          coreHeight: 1 + Math.random() * 3,
          style: ['monolith', 'stacked', 'tower', 'podium', 'cantilever', 'slab'][Math.floor(Math.random() * 6)] as any,
          rotationY: Math.floor(Math.random() * 4) * 90
        });
      }
    }

    return {
      buildings: newBuildings,
      selectedId: null
    };
  }),
  setLightIntensity: (intensity) => set({ lightIntensity: intensity })
}));
