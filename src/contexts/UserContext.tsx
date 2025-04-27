/**
 * @file UserContext.tsx
 * @description This file contains the UserContext component, which is a context provider for the user.
 * @author Anil Bhandari
 */

import React, {createContext, useContext, useState, useEffect} from 'react';
import {getTokenKeyChain} from '../utils/asyncStorage';
import {UserContextType} from '../types/UserContextType';

export const UserContext = createContext<UserContextType>({
  currentUser: null,
  setCurrentUser: () => {},
});

export const UserProvider = ({children}: {children: React.ReactNode}) => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Retrieve the token from Keychain
        const token = await getTokenKeyChain();
        if (token) {
          setCurrentUser(token); // Set the token in the context state
        } else {
          setCurrentUser(null); // No token found
        }
      } catch (error) {
        console.error('Error fetching token from Keychain:', error);
        setCurrentUser(null); // Handle errors by setting the user to null
      }
    };

    fetchUser();
  }, []);

  const values = {
    currentUser,
    setCurrentUser,
  };

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};

export const useUserContext = () => useContext(UserContext);
