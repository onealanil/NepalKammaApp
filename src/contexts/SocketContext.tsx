import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { BACKEND_URL } from '../global/config';
import { useUserContext } from './UserContext';

interface SocketContextProps {
  children: React.ReactNode;
}

const SocketContext = createContext<Socket | null>(null);

export const useSocket = (): Socket| null => useContext(SocketContext);

export const SocketProvider: React.FC<SocketContextProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { currentUser } = useUserContext();

  useEffect(() => {
    if (!currentUser) return;

    const socketOptions = {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      autoConnect: true,
      transports: ['websocket'],
      auth: {
        token: currentUser, // This is crucial
      },
      extraHeaders: {
        // For development only - remove in production
        'Access-Control-Allow-Origin': '*', 
      },
    };

    const newSocket = io(BACKEND_URL, socketOptions);

    // Enhanced logging for debugging
    const onConnect = () => {
      console.log('Socket connected with ID:', newSocket.id);
    };

    const onDisconnect = (reason: string) => {
      console.log(`Disconnected: ${reason}`);
      if (reason === 'io server disconnect') {
        setTimeout(() => newSocket.connect(), 5000);
      }
    };

    const onConnectError = (error: Error) => {
      console.error('Connection error:', error);
    };

    newSocket.on('connect', onConnect);
    newSocket.on('disconnect', onDisconnect);
    newSocket.on('connect_error', onConnectError);

    // Add ping/pong handlers
    newSocket.on('ping', () => {
      newSocket.emit('pong');
    });

    setSocket(newSocket);

    return () => {
      newSocket.off('connect', onConnect);
      newSocket.off('disconnect', onDisconnect);
      newSocket.off('connect_error', onConnectError);
      newSocket.disconnect();
    };
  }, [currentUser]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};