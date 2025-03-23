import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react';
import {getTokenKeyChain} from '../utils/asyncStorage';

type UserContextType = {
  currentUser: string | null;
  setCurrentUser: Dispatch<SetStateAction<string | null>>;
};

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
