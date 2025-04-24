/**
 * @file AppProvider.tsx
 * @description This file contains the AppProvider component, which is a context provider for the application.
 * @author Anil Bhandari
 */

import React from 'react';
import {SocketProvider} from './SocketContext';
import {UserProvider} from './UserContext';
import {AppProviderProps} from '../types/interfaces/IAppProviderProps';

const AppProvider: React.FC<AppProviderProps> = ({children}) => {
  return (
    <UserProvider>
      <SocketProvider>{children}</SocketProvider>
    </UserProvider>
  );
};

export default AppProvider;
