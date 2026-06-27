/**
 * =====================================================
 * IMAGE UPLOAD SCREEN
 * =====================================================
 * ✔ Sélection image galerie Android
 * ✔ Upload backend
 * ✔ Groq LLaMA Vision analyse l'image → caption drôle
 * ✔ Navigation vers MemePreview avec caption
 * ✔ Zéro dépendance Gradle instable
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
  Platform,
  ScrollView,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { BACKEND_URL } from '../config';

const ImageUploadScreen = ({ navigation }: any) => {
  const [image, setImage] = useState<any>(null);
  const [uploadedFilename, setUploadedFilename] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingCaption, setLoadingCaption] = useState(false);

  /**
   * 📸 Choisir image depuis galerie
   */
  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });

    if (result.didCancel) return;

    const asset = result.assets?.[0];
    if (!asset?.uri) {
      Alert.alert('Erreur', 'Image invalide');
      return;
    }

    setImage(asset);
    setUploadedFilename(null);
    setUploadedUrl(null);
    setCaption('');
  };

  /**
   * 🚀 Upload image vers backend
   */
  const uploadImage = async () => {
    try {
      if (!image?.uri) {
        Alert.alert('Erreur', "Choisis une image d'abord");
        return;
      }

      setLoadingUpload(true);

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Erreur', 'Reconnecte-toi');
        return;
      }

      const formData = new FormData();
      formData.append('image', {
        uri: Platform.OS === 'android'
          ? image.uri
          : image.uri.replace('file://', ''),
        name: image.fileName || `photo_${Date.now()}.jpg`,
        type: image.type || 'image/jpeg',
      } as any);

      const response = await fetch(`${BACKEND_URL}/api/images/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadedFilename(data.filename);
        setUploadedUrl(data.url);
      } else {
        Alert.alert('Erreur upload', data.message || 'Erreur serveur');
      }
    } catch (error: any) {
      Alert.alert('Erreur réseau', error.message);
    } finally {
      setLoadingUpload(false);
    }
  };

  /**
   * 🤖 Groq Vision → analyse image → caption drôle
   */
  const generateCaption = async () => {
    Alert.alert('DEBUG', `filename = ${uploadedFilename}\nURL = ${BACKEND_URL}`);

    if (!uploadedFilename) {
      Alert.alert('Erreur', "Upload l'image d'abord");
      return;
    }

    try {
      setLoadingCaption(true);
      const token = await AsyncStorage.getItem('token');

      Alert.alert('DEBUG2', `token = ${token ? 'OK' : 'NULL'}`);

      if (!token) {
        Alert.alert('Erreur', 'Reconnecte-toi');
        return;
      }

      const response = await fetch(`${BACKEND_URL}/api/groq/caption-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ filename: uploadedFilename }),
      });

      const text = await response.text();
      Alert.alert('REPONSE', text);

    } catch (error: any) {
      Alert.alert('CATCH ERROR', error.message);
    } finally {
      setLoadingCaption(false);
    }
  };
    };
  /**
   * 🎭 Créer le meme final
   */
  const createMeme = () => {
    if (!uploadedUrl) {
      Alert.alert('Erreur', "Upload une image d'abord");
      return;
    }
    navigation.navigate('MemePreview', {
      imageUrl: uploadedUrl,
      caption: caption || null,
      fromAudio: false,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.title}>🖼 Meme Image</Text>
      <Text style={styles.subtitle}>
        Choisis une image → IA génère une caption drôle
      </Text>

      {/* PREVIEW IMAGE */}
      {image ? (
        <Image source={{ uri: image.uri }} style={styles.preview} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderIcon}>🖼</Text>
          <Text style={styles.placeholderText}>Aucune image choisie</Text>
        </View>
      )}

      {/* CAPTION GÉNÉRÉE */}
      {caption !== '' && (
        <View style={styles.captionBox}>
          <Text style={styles.captionLabel}>🤖 Caption IA :</Text>
          <Text style={styles.captionText}>"{caption}"</Text>
        </View>
      )}

      {/* ÉTAPE 1 — CHOISIR IMAGE */}
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>📷 1. Choisir une image</Text>
      </TouchableOpacity>

      {/* ÉTAPE 2 — UPLOAD */}
      {image && !uploadedFilename && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#28a745' }]}
          onPress={uploadImage}
          disabled={loadingUpload}
        >
          {loadingUpload
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.buttonText}>🚀 2. Uploader l'image</Text>
          }
        </TouchableOpacity>
      )}

      {/* STATUS UPLOAD */}
      {uploadedFilename && (
        <Text style={styles.uploadedText}>✅ Image uploadée</Text>
      )}

      {/* ÉTAPE 3 — ANALYSER AVEC IA */}
      {uploadedFilename && caption === '' && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#6f42c1' }]}
          onPress={generateCaption}
          disabled={loadingCaption}
        >
          {loadingCaption
            ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color="#fff" />
                <Text style={[styles.buttonText, { marginLeft: 10 }]}>
                  IA analyse...
                </Text>
              </View>
            )
            : <Text style={styles.buttonText}>🤖 3. Analyser avec IA</Text>
          }
        </TouchableOpacity>
      )}

      {/* ÉTAPE 4 — CRÉER MEME */}
      {uploadedUrl && caption !== '' && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#ff9800' }]}
          onPress={createMeme}
        >
          <Text style={styles.buttonText}>🎭 4. Créer le Meme</Text>
        </TouchableOpacity>
      )}

      {/* RECOMMENCER */}
      {image && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#6c757d' }]}
          onPress={() => {
            setImage(null);
            setUploadedFilename(null);
            setUploadedUrl(null);
            setCaption('');
          }}
        >
          <Text style={styles.buttonText}>🔄 Recommencer</Text>
        </TouchableOpacity>
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

export default ImageUploadScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 40,
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  preview: {
    width: 260,
    height: 260,
    borderRadius: 12,
    marginBottom: 16,
  },
  placeholder: {
    width: 260,
    height: 200,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  placeholderIcon: {
    fontSize: 50,
    marginBottom: 8,
  },
  placeholderText: {
    color: '#999',
    fontSize: 14,
  },
  uploadedText: {
    fontSize: 13,
    color: '#28a745',
    marginBottom: 12,
    fontWeight: '600',
  },
  captionBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: '100%',
    elevation: 2,
  },
  captionLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  captionText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#007AFF',
    fontWeight: '700',
    textAlign: 'center',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 15,
    fontWeight: '600',
  },
});
