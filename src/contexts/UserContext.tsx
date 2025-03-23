import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
      // const storedCurrentUser = await AsyncStorage.getItem('currentUser');
      //getting the token from the key chain
      getTokenKeyChain('currentUser').then(res => {
        setCurrentUser(res);
      });
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
