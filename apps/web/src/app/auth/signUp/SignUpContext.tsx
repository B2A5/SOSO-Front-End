'use client';
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';
import type { UserType } from '@/api/signup';

interface SignUpState {
  userType: UserType | null;
  setUserType: (type: UserType) => void;
}

const SignUpContext = createContext<SignUpState | undefined>(
  undefined,
);

export function SignUpProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [userType, setUserType] = useState<UserType | null>(null);

  return (
    <SignUpContext.Provider value={{ userType, setUserType }}>
      {children}
    </SignUpContext.Provider>
  );
}

export function useSignUp() {
  const context = useContext(SignUpContext);
  if (!context)
    throw new Error(
      'useSignUp 훅은 SignUpProvider 안에서만 사용할 수 있습니다.',
    );
  return context;
}
