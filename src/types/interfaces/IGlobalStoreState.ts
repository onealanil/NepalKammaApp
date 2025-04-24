export interface GlobalStoreState {
  user: any;
  checkAuth: () => Promise<boolean>;
  setUser: (user: any) => void;
}