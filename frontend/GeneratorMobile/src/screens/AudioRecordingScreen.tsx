/**
 * =====================================================
 * AUDIO RECORDING SCREEN - VERSION STABLE
 * =====================================================
 * ✔ Zéro dépendance native instable
 * ✔ Zéro NitroModules
 * ✔ Compatible React Native 0.86 + Gradle
 * ✔ Permission micro Android
 * ✔ Simulation enregistrement (stable pour soutenance)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  PermissionsAndroid,
  Platform,
  ScrollView,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL } from '../config';

const AudioRecordingScreen = ({ navigation }: any) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [duration, setDuration] = useState(0);
  const [timer, setTimer] = useState<any>(null);

  /**
   * 🎤 Demande permission microphone (Android)
   */
  const requestPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Permission Microphone',
          message: 'Cette app a besoin du micro pour enregistrer des memes audio',
          buttonPositive: 'Autoriser',
          buttonNegative: 'Refuser',
        }
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.log('Permission error:', err);
      return false;
    }
  };

  /**
   * 🟢 Démarrer enregistrement
   */
  const startRecording = async () => {
    const hasPermission = await requestPermission();

    if (!hasPermission) {
      Alert.alert('Permission refusée', 'Active le micro dans les paramètres');
      return;
    }

    // Démarre le timer d'affichage
    setDuration(0);
    setIsRecording(true);
    setAudioReady(false);

    const interval = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);

    setTimer(interval);
  };

  /**
   * 🔴 Arrêter enregistrement
   */
  const stopRecording = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }

    setIsRecording(false);
    setAudioReady(true);

    Alert.alert('✅ Enregistrement terminé', `Durée : ${duration}s`);
  };

  /**
   * 🔄 Réinitialiser
   */
  const resetRecording = () => {
    setIsRecording(false);
    setAudioReady(false);
    setDuration(0);
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  };

  /**
   * 🎭 Générer meme depuis audio (simulation)
   * 👉 Sera connecté à Gemini IA plus tard
   */
  const generateMeme = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Alert.alert('Erreur', 'Reconnecte-toi');
        return;
      }

      // Navigation vers MemePreview (simulation sans vrai fichier audio)
      navigation.navigate('MemePreview', {
        imageUrl: null,
        audioDuration: duration,
        fromAudio: true,
      });

    } catch (error: any) {
      Alert.alert('Erreur', error.message);
    }
  };

  /**
   * Formatage du temps mm:ss
   */
  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.title}>🎤 Meme Audio</Text>
      <Text style={styles.subtitle}>Enregistre ta voix pour créer un meme</Text>

      {/* TIMER */}
      <View style={styles.timerBox}>
        <Text style={[styles.timer, isRecording && styles.timerActive]}>
          {formatTime(duration)}
        </Text>
        <Text style={styles.timerLabel}>
          {isRecording ? '🔴 Enregistrement...' : audioReady ? '✅ Prêt' : '⏸ En attente'}
        </Text>
      </View>

      {/* BOUTON START / STOP */}
      {!audioReady && (
        <TouchableOpacity
          style={[
            styles.recordButton,
            { backgroundColor: isRecording ? '#dc3545' : '#28a745' },
          ]}
          onPress={isRecording ? stopRecording : startRecording}
        >
          <Text style={styles.recordButtonText}>
            {isRecording ? '⏹ Stop' : '🎤 Démarrer'}
          </Text>
        </TouchableOpacity>
      )}

      {/* BOUTONS APRÈS ENREGISTREMENT */}
      {audioReady && (
        <>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#007AFF' }]}
            onPress={generateMeme}
          >
            <Text style={styles.buttonText}>🎭 Générer le Meme</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#6c757d' }]}
            onPress={resetRecording}
          >
            <Text style={styles.buttonText}>🔄 Recommencer</Text>
          </TouchableOpacity>
        </>
      )}

      {/* RETOUR */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#aaa' }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>← Retour</Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

export default AudioRecordingScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  timerBox: {
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
  timerActive: {
    color: '#dc3545',
  },
  timerLabel: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  recordButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  recordButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    padding: 15,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
