
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// Mock user for testing purposes when auth is disabled
const mockUser = {
  uid: 'test-user-123',
  email: 'tester@mannan.app',
  displayName: 'Test User',
  photoURL: 'https://picsum.photos/seed/test-user/40/40',
  // Add other User properties if your app needs them
} as User;


const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        // When testing without logins, if there's no real user, use the mock user.
        if (!user) {
          console.log("No real user found, using mock user for testing.");
          setUser(mockUser);
        } else {
          setUser(user);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // If firebase is not configured, use the mock user.
       console.log("Firebase not configured, using mock user for testing.");
      setUser(mockUser);
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
