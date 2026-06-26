/**
 * =====================================================
 * REGISTER SCREEN
 * =====================================================
 * ✔ Inscription utilisateur
 * ✔ URL ngrok stable
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { BACKEND_URL } from '../config';

const RegisterScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * 📝 Inscription utilisateur
   */
  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert('Erreur', 'Remplis tous les champs');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Succès ✅', 'Compte créé ! Connecte-toi.');
        navigation.navigate('Login');
      } else {
        Alert.alert('Erreur', data.error || data.message || "Erreur inscription");
      }
    } catch (error: any) {
      Alert.alert('Erreur réseau', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>🎭 Meme Generator</Text>
      <Text style={styles.subtitle}>Créer un compte</Text>

      {/* USERNAME */}
      <TextInput
        placeholder="Nom d'utilisateur"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />

      {/* EMAIL */}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {/* MOT DE PASSE */}
      <TextInput
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {/* BOUTON */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.buttonText}>S'inscrire</Text>
        }
      </TouchableOpacity>

      {/* LIEN LOGIN */}
      <TouchableOpacity
        style={{ marginTop: 20 }}
        onPress={() => navigation.reset('Login')}
      >
        <Text style={styles.link}>Déjà un compte ? Se connecter</Text>
      </TouchableOpacity>

    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
    fontSize: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    color: '#007AFF',
    textAlign: 'center',
    fontSize: 15,
  },
});
