'use client';

import { createContext, ReactNode, useState } from 'react';
import { Username, UsernamesContextType } from '../types';


export const UsernamesContext = createContext<UsernamesContextType | undefined>(undefined);

export const UsernamesProvider = ({ children }: { children: ReactNode }) => {
  const [usernames, setUsernames] = useState<Username[]>([]);
  return (
    <UsernamesContext.Provider value={{ usernames, setUsernames }}>
      {children}
    </UsernamesContext.Provider>
  );
};
