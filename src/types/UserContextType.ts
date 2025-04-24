import {
    Dispatch,
    SetStateAction,
} from 'react';

export type UserContextType = {
    currentUser: string | null;
    setCurrentUser: Dispatch<SetStateAction<string | null>>;
};