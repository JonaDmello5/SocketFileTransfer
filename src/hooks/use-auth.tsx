'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

type User = {
  email: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for a logged-in user in localStorage
    const storedUser = localStorage.getItem('user-email');
    if (storedUser) {
      setUser({ email: storedUser });
    }
    setLoading(false);
  }, []);

  const signIn = (email: string) => {
    localStorage.setItem('user-email', email);
    setUser({ email });
  };

  const signOut = () => {
    localStorage.removeItem('user-email');
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // This is a dummy implementation, so we'll provide a fallback.
    // In a real app, this would throw an error.
    const [user, setUser] = useState<User | null>(null);
    const signIn = (email: string) => setUser({ email });
    const signOut = () => setUser(null);
    return { user, loading: false, signIn, signOut };
  }
  return context;
};
