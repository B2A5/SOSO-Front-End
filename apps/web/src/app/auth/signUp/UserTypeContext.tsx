'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';
import type { UserType } from '@/api/signup';

interface UserTypeState {
  userType: UserType | null;
  setUserType: (type: UserType) => void;
}

const UserTypeContext = createContext<UserTypeState | undefined>(
  undefined,
);

export function UserTypeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [userType, setUserType] = useState<UserType | null>(null);

  return (
    <UserTypeContext.Provider value={{ userType, setUserType }}>
      {children}
    </UserTypeContext.Provider>
  );
}

export function useUserType() {
  const context = useContext(UserTypeContext);
  if (!context)
    throw new Error(
      'useUserType 훅은 UserTypeProvider 안에서만 사용할 수 있습니다.',
    );
  return context;
}
