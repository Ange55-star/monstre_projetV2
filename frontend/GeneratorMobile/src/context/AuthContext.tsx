/**
 * =====================================================
 * AUTH CONTEXT - FRONTEND
 * =====================================================
 * ✔ Stockage token JWT
 * ✔ Chargement automatique au démarrage
 * ✔ Compatible React Native (sans atob)
 * ✔ Token 30 jours → moins de déconnexions
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

  /**
   * =====================================================
   * Vérifie si le token est expiré
   * ✔ Sans atob (incompatible React Native)
   * ✔ Utilise Buffer (disponible dans RN)
   * =====================================================
   */
  const isTokenExpired = (tkn: string): boolean => {
    try {
      const parts = tkn.split('.');
      if (parts.length !== 3) return true;

      // Décode le payload base64
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const decoded = JSON.parse(
        Buffer.from(base64, 'base64').toString('utf8')
      );

      if (!decoded.exp) return false;

      const now = Math.floor(Date.now() / 1000);
      return decoded.exp < now;
    } catch {
      // Si décodage impossible → garde le token
      // Le backend vérifiera sa validité
      return false;
    }
  };

  /**
   * =====================================================
   * Charge le token au démarrage de l'app
   * =====================================================
   */
  useEffect(() => {
    const loadToken = async () => {
      try {
        const stored = await AsyncStorage.getItem('token');

        if (!stored) {
          setTokenState(null);
          return;
        }

        // Token expiré → déconnexion automatique
        if (isTokenExpired(stored)) {
          await AsyncStorage.removeItem('token');
          setTokenState(null);
          return;
        }

        // Token valide → utilisateur connecté
        setTokenState(stored);

      } catch (error) {
        console.log('Load token error:', error);
        setTokenState(null);
      }
    };

    loadToken();
  }, []);

  /**
   * =====================================================
   * Met à jour le token (après login)
   * =====================================================
   */
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

  /**
   * =====================================================
   * Déconnexion propre
   * =====================================================
   */
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
