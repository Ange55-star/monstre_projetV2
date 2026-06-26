/**
 * =====================================================
 * IMAGE UPLOAD SCREEN
 * =====================================================
 * ✔ Sélection image galerie Android
 * ✔ Upload backend via ngrok (stable)
 * ✔ Preview image locale + URL backend
 * ✔ Navigation vers MemePreview après upload
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
  const [loading, setLoading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  /**
   * 📸 Ouvrir galerie et choisir image
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

    // Reset ancien upload si on choisit une nouvelle image
    setImage(asset);
    setUploadedUrl(null);
  };

  /**
   * 🚀 Upload image vers backend Express (Multer + JWT)
   */
  const uploadImage = async () => {
    try {
      if (!image?.uri) {
        Alert.alert('Erreur', 'Aucune image sélectionnée');
        return;
      }

      setLoading(true);

      // Récupère le token JWT depuis AsyncStorage
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Alert.alert('Erreur', 'Token manquant, reconnecte-toi');
        return;
      }

      // Prépare le FormData (Android safe)
      const formData = new FormData();

      formData.append('image', {
        uri: Platform.OS === 'android'
          ? image.uri
          : image.uri.replace('file://', ''),
        name: image.fileName || `photo_${Date.now()}.jpg`,
        type: image.type || 'image/jpeg',
      } as any);

      console.log(
      'URL UPLOAD =',
      `${BACKEND_URL}/api/images/upload`
      );
      // Envoi vers backend
      const response = await fetch(`${BACKEND_URL}/api/images/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
          // ⚠️ NE PAS mettre Content-Type ici (FormData le gère seul)
        },
        body: formData,
      });

      const text = await response.text();
      console.log('UPLOAD RESPONSE:', text);

      const data = JSON.parse(text);

      if (response.ok) {
        setUploadedUrl(data.url);

        // Navigue vers MemePreview avec l'URL de l'image
        navigation.navigate('MemePreview', { imageUrl: data.url });
      } else {
        Alert.alert('Erreur', data.message || 'Upload échoué');
      }
    } catch (error: any) {
      console.log('UPLOAD ERROR:', error);
      Alert.alert('Erreur réseau', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.title}>🖼 Upload Image Meme</Text>

      {/* PREVIEW IMAGE LOCALE */}
      {image ? (
        <Image source={{ uri: image.uri }} style={styles.preview} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Aucune image choisie</Text>
        </View>
      )}

      {/* URL UPLOADÉE */}
      {uploadedUrl && (
        <Text style={styles.url} numberOfLines={2}>
          ✅ {uploadedUrl}
        </Text>
      )}

      {/* CHOISIR IMAGE */}
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>📷 Choisir une image</Text>
      </TouchableOpacity>

      {/* UPLOADER */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#28a745' }]}
        onPress={uploadImage}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.buttonText}>🚀 Uploader</Text>
        }
      </TouchableOpacity>

      {/* RETOUR */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#6c757d' }]}
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
    marginBottom: 20,
    marginTop: 40,
  },
  preview: {
    width: 250,
    height: 250,
    borderRadius: 12,
    marginBottom: 16,
  },
  placeholder: {
    width: 250,
    height: 250,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  placeholderText: {
    color: '#999',
  },
  url: {
    fontSize: 11,
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
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
