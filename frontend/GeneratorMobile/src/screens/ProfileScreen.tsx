import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';

const ProfileScreen = () => {
  const { setToken } = useContext(AuthContext);

  const [token, setLocalToken] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const t = await AsyncStorage.getItem('token');
      setLocalToken(t);
    };
    load();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setToken(null);
  };

  const showToken = () => {
    Alert.alert(
      'Token (debug)',
      token ? token.substring(0, 30) + '...' : 'Aucun token'
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Profil</Text>

      <Text style={styles.text}>
        Statut : {token ? 'Connecté ✅' : 'Déconnecté ❌'}
      </Text>

      <TouchableOpacity style={styles.button} onPress={showToken}>
        <Text style={styles.buttonText}>Voir token</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#dc3545' }]}
        onPress={logout}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});