/**
 * @file UseLocationStore.ts
 * @description Zustand store for managing location state.
 * @author Anil Bhandari
 */

import { create } from 'zustand';
import { LocationState } from '../types/interfaces/ILocationState';


const initialLocationState: LocationState = {
  latitude: 0,
  longitude: 0,
};

/**
 * @description Zustand store for managing location state.
 * @property {LocationState} location - The current location state.
 * @property {Function} setLocation - Function to update the location state.
 * @returns {LocationState} - The location state and the function to update it.
 */
const useLocationStore = create((set) => ({
  location: initialLocationState,

  setLocation: (latitude: number, longitude: number) =>
    set((state: any) => ({
      location: { latitude, longitude },
    })),
}));

export default useLocationStore;
