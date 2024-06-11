import {create} from 'zustand';

export interface LocationState {
  latitude: number;
  longitude: number;
}

const initialLocationState: LocationState = {
  latitude: 0,
  longitude: 0,
};

const useLocationStore = create((set) => ({
  location: initialLocationState,

  setLocation: (latitude: number, longitude: number) =>
    set((state:any) => ({
      location: { latitude, longitude },
    })),
}));

export default useLocationStore;
