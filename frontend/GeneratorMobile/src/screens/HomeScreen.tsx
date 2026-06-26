/**
 * =====================================================
 * HOME SCREEN - GÉNÉRATEUR DE MEMES
 * =====================================================
 * ✔ Navigation
 * ✔ Test JWT backend
 * ✔ Vérification token AsyncStorage
 * ✔ Logout
 * =====================================================
 */

import React, { useContext, useEffect } from 'react';
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
   * Vérifie le token au chargement
   */
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');

      console.log('====================');
      console.log('TOKEN STOCKE =');
      console.log(token);
      console.log('====================');
    };

    checkToken();
  }, []);

  /**
   * Test route protégée
   */
  const testProtectedRoute = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      console.log('TOKEN TEST =', token);

      if (!token) {
        Alert.alert(
          'Erreur',
          'Token introuvable dans AsyncStorage'
        );
        return;
      }

      const response = await fetch(
        `${BACKEND_URL}/api/test`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
        }
      );

      const text = await response.text();

      console.log('RESPONSE TEST =', text);

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        Alert.alert(
          'Erreur',
          'Réponse backend invalide'
        );
        return;
      }

      if (response.ok) {
        Alert.alert(
          'Backend OK ✅',
          JSON.stringify(data, null, 2)
        );
      } else {
        Alert.alert(
          'Erreur JWT',
          data.message || 'Erreur inconnue'
        );
      }
    } catch (error: any) {
      console.log(error);

      Alert.alert(
        'Erreur réseau',
        error.message
      );
    }
  };

  /**
   * Logout
   */
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setToken(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.title}>
        🎭 Générateur de Memes
      </Text>

      <Text style={styles.subtitle}>
        Audio + Image + Gemini
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate('AudioRecord')
        }
      >
        <Text style={styles.buttonText}>
          🎤 Meme Audio
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: '#ff9800' },
        ]}
        onPress={() =>
          navigation.navigate('ImageUpload')
        }
      >
        <Text style={styles.buttonText}>
          🖼 Meme Image
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: '#6f42c1' },
        ]}
        onPress={() =>
          navigation.navigate('Profile')
        }
      >
        <Text style={styles.buttonText}>
          👤 Mon Profil
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: '#6c757d' },
        ]}
        onPress={() =>
          navigation.navigate('History')
        }
      >
        <Text style={styles.buttonText}>
          📜 Historique
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: '#28a745' },
        ]}
        onPress={testProtectedRoute}
      >
        <Text style={styles.buttonText}>
          🔐 Tester Backend
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: '#6f42c1' },
        ]}
        onPress={() =>
          navigation.navigate('GeminiMeme')
        }
      >
        <Text style={styles.buttonText}>
          🤖 Gemini IA Meme
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: '#dc3545' },
        ]}
        onPress={logout}
      >
        <Text style={styles.buttonText}>
          🚪 Logout
        </Text>
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