import React, { ReactNode } from 'react';
import { SocketProvider } from './SocketContext';
import { UserProvider } from './UserContext';


interface AppProviderProps {
  children: ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <SocketProvider>
      <UserProvider>
        {children}
      </UserProvider>
    </SocketProvider>
  );
};

export default AppProvider;
