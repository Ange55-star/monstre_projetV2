/**
 * =====================================================
 * MEME PREVIEW SCREEN
 * =====================================================
 * ✔ Affiche résultat image uploadée
 * ✔ Compatible audio + image
 * ✔ Sauvegarde dans historique (AsyncStorage)
 * ✔ Navigation retour Home
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const MemePreviewScreen = ({ route, navigation }: any) => {
  // Données reçues depuis ImageUpload ou AudioRecord
  const { imageUrl, audioDuration, fromAudio, caption } = route.params || {};

  /**
   * 💾 Sauvegarde automatique dans l'historique
   */
  useEffect(() => {
    saveMemeToHistory();
  }, []);

  const saveMemeToHistory = async () => {
    try {
      const existing = await AsyncStorage.getItem('memes');
      const memes = existing ? JSON.parse(existing) : [];

      const newMeme = {
        id: Date.now(),
        title: fromAudio ? '🎤 Meme Audio' : '🖼 Meme Image',
        imageUrl: imageUrl || null,
        audioDuration: audioDuration || null,
        caption: caption || null,
        createdAt: new Date().toLocaleDateString('fr-FR'),
      };

      const updated = [newMeme, ...memes];
      await AsyncStorage.setItem('memes', JSON.stringify(updated));
    } catch (error) {
      console.log('Save history error:', error);
    }
  };

  const handleShare = () => {
    Alert.alert('Partager', 'Fonctionnalité bientôt disponible 🚀');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* TITRE */}
      <Text style={styles.title}>🎭 Ton Meme</Text>

      {/* IMAGE */}
      {imageUrl ? (
        <Image
          source={{
            uri: imageUrl,
            headers: { 'ngrok-skip-browser-warning': 'true' },
          }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.audioCard}>
          <Text style={styles.audioIcon}>🎤</Text>
          <Text style={styles.audioText}>Meme Audio</Text>
          {audioDuration && (
            <Text style={styles.audioDuration}>
              Durée : {audioDuration}s
            </Text>
          )}
        </View>
      )}

      {/* CAPTION GEMINI */}
      {caption && (
        <View style={styles.captionBox}>
          <Text style={styles.captionText}>"{caption}"</Text>
        </View>
      )}

      {/* INFO */}
      <Text style={styles.info}>✅ Sauvegardé dans l'historique</Text>

      {/* PARTAGER */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#ff9800' }]}
        onPress={handleShare}
      >
        <Text style={styles.buttonText}>📤 Partager</Text>
      </TouchableOpacity>

      {/* NOUVEAU MEME */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#28a745' }]}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>🎭 Nouveau Meme</Text>
      </TouchableOpacity>

      {/* HISTORIQUE */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#6c757d' }]}
        onPress={() => navigation.navigate('History')}
      >
        <Text style={styles.buttonText}>📜 Voir l'historique</Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

export default MemePreviewScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 16,
    marginBottom: 20,
  },
  audioCard: {
    width: 300,
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
  },
  audioIcon: {
    fontSize: 60,
    marginBottom: 10,
  },
  audioText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  audioDuration: {
    fontSize: 14,
    color: '#666',
    marginTop: 6,
  },
  captionBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: '100%',
    elevation: 2,
  },
  captionText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#007AFF',
    textAlign: 'center',
    fontWeight: '600',
  },
  info: {
    fontSize: 13,
    color: '#28a745',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
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
