import React, {createContext, useContext, useEffect, useState} from 'react';
import {io, Socket} from 'socket.io-client';
import { BACKEND_URL } from '../global/config';

interface SocketContextProps {
  children: React.ReactNode;
}

interface DefaultEventsMap {
}

type SocketType = Socket<DefaultEventsMap, DefaultEventsMap>;

// const SocketContext = createContext<SocketType | null>(null);
const SocketContext = createContext<any>(null);


// export const useSocket = (): SocketType | null => useContext(SocketContext);
export const useSocket = (): any=> useContext(SocketContext);


export const SocketProvider: React.FC<SocketContextProps> = ({children}) => {
  // const [socket, setSocket] = useState<SocketType | null>(null);
  const [socket, setSocket] = useState<any>(null);

  //search job 2 times api called

  useEffect(() => {
    const newSocket = io(BACKEND_URL);

    newSocket.on('connect', () => {
      console.log('Connected to server');
    });
  
    newSocket.on('disconnect', (reason: string) => {
      console.log(`Disconnected from server due to: ${reason}`);
    });
  
    newSocket.on('error', (error: Error) => {
      console.log(`An error occurred: ${error.message}`);
    });
    setSocket(newSocket);

    // Return a cleanup function
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
