/**
 * =====================================================
 * HOME SCREEN - GÉNÉRATEUR DE MEMES
 * =====================================================
 * ✔ Navigation vers tous les modules
 * ✔ Test JWT backend
 * ✔ Logout propre
 */

import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';
import { BACKEND_URL } from '../config';

const HomeScreen = ({ navigation }: any) => {
  const { setToken } = useContext(AuthContext);

  /**
   * 🧪 Test route protégée backend
   */
  const testProtectedRoute = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Alert.alert('Erreur', 'Token introuvable');
        return;
      }

      const response = await fetch(`${BACKEND_URL}/api/test`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token.trim()}`,
          'ngrok-skip-browser-warning': 'true',
        },
      });

      const text = await response.text();
      const data = JSON.parse(text);

      Alert.alert('Backend OK ✅', JSON.stringify(data, null, 2));
    } catch (error: any) {
      Alert.alert('Erreur réseau', error.message);
    }
  };

  /**
   * 🚪 Logout propre
   */
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setToken(null);
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* TITRE */}
      <Text style={styles.title}>🎭 Générateur de Memes</Text>
      <Text style={styles.subtitle}>Audio + Image + IA Gemini</Text>

      {/* 🎤 AUDIO */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AudioRecord')}
      >
        <Text style={styles.buttonText}>🎤 Meme Audio</Text>
      </TouchableOpacity>

      {/* 🖼 IMAGE */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#ff9800' }]}
        onPress={() => navigation.navigate('ImageUpload')}
      >
        <Text style={styles.buttonText}>🖼 Meme Image</Text>
      </TouchableOpacity>

      {/* 👤 PROFIL */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#6f42c1' }]}
        onPress={() => navigation.navigate('Profile')}
      >
        <Text style={styles.buttonText}>👤 Mon Profil</Text>
      </TouchableOpacity>

      {/* 📜 HISTORIQUE */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#6c757d' }]}
        onPress={() => navigation.navigate('History')}
      >
        <Text style={styles.buttonText}>📜 Historique</Text>
      </TouchableOpacity>

      {/* 🔐 TEST JWT */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#28a745' }]}
        onPress={testProtectedRoute}
      >
        <Text style={styles.buttonText}>🔐 Tester Backend</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#6f42c1' }]}
        onPress={() => navigation.navigate('GeminiMeme')}
      >
        <Text style={styles.buttonText}>🤖 Gemini IA Meme</Text>
      </TouchableOpacity>

      {/* 🚪 LOGOUT */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#dc3545' }]}
        onPress={logout}
      >
        <Text style={styles.buttonText}>🚪 Logout</Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 12,
    width: '100%',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});
