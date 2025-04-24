export interface MessageStoreState {
  messageCount: number;
  setMessageCount: (count: number) => void;
}