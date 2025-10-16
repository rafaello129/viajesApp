import { create } from 'zustand'


export interface DummyState {
    bears: number
}

export const useDummyStore = create<DummyState>(( set ) => ({
  bears: 10,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}))
