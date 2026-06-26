/**
 * AUTH CONTEXT - VERSION STABLE
 * Sans vérification expiration côté frontend
 * Le backend gère les tokens invalides
 */

import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: any) => {
  const [token, setTokenState] = useState<string | null>(null);

  // Charge le token au démarrage SANS vérifier l'expiration
  useEffect(() => {
    const loadToken = async () => {
      try {
        const stored = await AsyncStorage.getItem('token');
        setTokenState(stored);
      } catch (error) {
        setTokenState(null);
      }
    };
    loadToken();
  }, []);

  const setToken = async (newToken: string | null) => {
    try {
      if (newToken) {
        await AsyncStorage.setItem('token', newToken);
      } else {
        await AsyncStorage.removeItem('token');
      }
      setTokenState(newToken);
    } catch (error) {
      console.log('Set token error:', error);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setTokenState(null);
  };

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};