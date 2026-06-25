/**
 * =====================================================
 * GEMINI MEME SCREEN - FRONTEND
 * =====================================================
 * ✔ Saisie texte → génération caption IA
 * ✔ Upload image → analyse Gemini Vision
 * ✔ Choix parmi 3 captions
 * ✔ Zéro dépendance Gradle instable
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image,
  Platform,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { BACKEND_URL } from '../config';

const GeminiMemeScreen = ({ navigation }: any) => {
  // États texte
  const [text, setText] = useState('');
  const [caption, setCaption] = useState('');
  const [captions, setCaptions] = useState<string[]>([]);
  const [selectedCaption, setSelectedCaption] = useState('');

  // États image
  const [image, setImage] = useState<any>(null);
  const [uploadedFilename, setUploadedFilename] = useState<string | null>(null);

  // États chargement
  const [loadingCaption, setLoadingCaption] = useState(false);
  const [loadingMultiple, setLoadingMultiple] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingImageCaption, setLoadingImageCaption] = useState(false);

  // Mode actif : 'text' ou 'image'
  const [mode, setMode] = useState<'text' | 'image'>('text');

  /**
   * 🔑 Récupère le token JWT
   */
  const getToken = async (): Promise<string | null> => {
    return await AsyncStorage.getItem('token');
  };

  /**
   * =====================================================
   * 1. GÉNÉRER CAPTION DEPUIS TEXTE
   * =====================================================
   */
  const generateCaptionFromText = async () => {
    if (!text.trim()) {
      Alert.alert('Erreur', 'Saisis un texte d\'abord');
      return;
    }

    try {
      setLoadingCaption(true);
      setCaption('');

      const token = await getToken();
      if (!token) {
        Alert.alert('Erreur', 'Reconnecte-toi');
        return;
      }

      const response = await fetch(`${BACKEND_URL}/api/gemini/caption-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (response.ok) {
        setCaption(data.caption);
        setSelectedCaption(data.caption);
      } else {
        Alert.alert('Erreur', data.message || 'Erreur Gemini');
      }
    } catch (error: any) {
      Alert.alert('Erreur réseau', error.message);
    } finally {
      setLoadingCaption(false);
    }
  };

  /**
   * =====================================================
   * 2. GÉNÉRER 3 CAPTIONS (CHOIX)
   * =====================================================
   */
  const generateMultipleCaptions = async () => {
    if (!text.trim()) {
      Alert.alert('Erreur', 'Saisis un texte d\'abord');
      return;
    }

    try {
      setLoadingMultiple(true);
      setCaptions([]);

      const token = await getToken();
      if (!token) return;

      const response = await fetch(`${BACKEND_URL}/api/gemini/captions-multiple`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (response.ok) {
        setCaptions(data.captions);
      } else {
        Alert.alert('Erreur', data.message);
      }
    } catch (error: any) {
      Alert.alert('Erreur réseau', error.message);
    } finally {
      setLoadingMultiple(false);
    }
  };

  /**
   * =====================================================
   * 3. PICK IMAGE + UPLOAD
   * =====================================================
   */
  const pickAndUploadImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });

    if (result.didCancel) return;

    const asset = result.assets?.[0];
    if (!asset?.uri) return;

    setImage(asset);
    setUploadedFilename(null);
    setCaption('');

    // Upload automatique après sélection
    try {
      setLoadingImage(true);

      const token = await getToken();
      if (!token) return;

      const formData = new FormData();
      formData.append('image', {
        uri: Platform.OS === 'android'
          ? asset.uri
          : asset.uri.replace('file://', ''),
        name: asset.fileName || `photo_${Date.now()}.jpg`,
        type: asset.type || 'image/jpeg',
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
        Alert.alert('✅ Image uploadée', 'Génère maintenant la caption !');
      } else {
        Alert.alert('Erreur upload', data.message);
      }
    } catch (error: any) {
      Alert.alert('Erreur réseau', error.message);
    } finally {
      setLoadingImage(false);
    }
  };

  /**
   * =====================================================
   * 4. GÉNÉRER CAPTION DEPUIS IMAGE (GEMINI VISION)
   * =====================================================
   */
  const generateCaptionFromImage = async () => {
    if (!uploadedFilename) {
      Alert.alert('Erreur', 'Upload une image d\'abord');
      return;
    }

    try {
      setLoadingImageCaption(true);
      setCaption('');

      const token = await getToken();
      if (!token) return;

      const response = await fetch(`${BACKEND_URL}/api/gemini/caption-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ filename: uploadedFilename }),
      });

      const data = await response.json();

      if (response.ok) {
        setCaption(data.caption);
        setSelectedCaption(data.caption);
      } else {
        Alert.alert('Erreur', data.message);
      }
    } catch (error: any) {
      Alert.alert('Erreur réseau', error.message);
    } finally {
      setLoadingImageCaption(false);
    }
  };

  /**
   * =====================================================
   * 5. UTILISER LA CAPTION SÉLECTIONNÉE
   * =====================================================
   */
  const useCaption = () => {
    if (!selectedCaption) {
      Alert.alert('Erreur', 'Sélectionne une caption d\'abord');
      return;
    }

    // Navigation vers MemePreview avec caption + image
    navigation.navigate('MemePreview', {
      imageUrl: uploadedFilename
        ? `${BACKEND_URL}/uploads/images/${uploadedFilename}`
        : null,
      caption: selectedCaption,
      fromGemini: true,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.title}>🤖 Gemini IA Meme</Text>
      <Text style={styles.subtitle}>Génère une caption IA pour ton meme</Text>

      {/* SÉLECTEUR MODE */}
      <View style={styles.modeSelector}>
        <TouchableOpacity
          style={[styles.modeBtn, mode === 'text' && styles.modeBtnActive]}
          onPress={() => setMode('text')}
        >
          <Text style={[styles.modeBtnText, mode === 'text' && styles.modeBtnTextActive]}>
            📝 Texte
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeBtn, mode === 'image' && styles.modeBtnActive]}
          onPress={() => setMode('image')}
        >
          <Text style={[styles.modeBtnText, mode === 'image' && styles.modeBtnTextActive]}>
            🖼 Image
          </Text>
        </TouchableOpacity>
      </View>

      {/* ==================== MODE TEXTE ==================== */}
      {mode === 'text' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Décris le contexte de ton meme</Text>

          <TextInput
            style={styles.input}
            placeholder="Ex: Quand le prof dit 'c'est facile' mais personne comprend..."
            value={text}
            onChangeText={setText}
            multiline
            numberOfLines={4}
            maxLength={500}
          />

          <Text style={styles.charCount}>{text.length}/500</Text>

          {/* BOUTON 1 CAPTION */}
          <TouchableOpacity
            style={styles.button}
            onPress={generateCaptionFromText}
            disabled={loadingCaption}
          >
            {loadingCaption
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.buttonText}>✨ Générer 1 caption</Text>
            }
          </TouchableOpacity>

          {/* BOUTON 3 CAPTIONS */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#6f42c1' }]}
            onPress={generateMultipleCaptions}
            disabled={loadingMultiple}
          >
            {loadingMultiple
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.buttonText}>🎲 Générer 3 captions</Text>
            }
          </TouchableOpacity>
        </View>
      )}

      {/* ==================== MODE IMAGE ==================== */}
      {mode === 'image' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upload une image → Gemini l'analyse</Text>

          {/* PREVIEW IMAGE */}
          {image && (
            <Image source={{ uri: image.uri }} style={styles.preview} />
          )}

          {/* BOUTON PICK IMAGE */}
          <TouchableOpacity
            style={styles.button}
            onPress={pickAndUploadImage}
            disabled={loadingImage}
          >
            {loadingImage
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.buttonText}>📷 Choisir image</Text>
            }
          </TouchableOpacity>

          {/* STATUS UPLOAD */}
          {uploadedFilename && (
            <Text style={styles.uploadedText}>
              ✅ Image prête : {uploadedFilename}
            </Text>
          )}

          {/* BOUTON ANALYSER */}
          {uploadedFilename && (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#ff9800' }]}
              onPress={generateCaptionFromImage}
              disabled={loadingImageCaption}
            >
              {loadingImageCaption
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.buttonText}>🔍 Analyser avec Gemini</Text>
              }
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* ==================== RÉSULTATS ==================== */}

      {/* 1 CAPTION */}
      {caption !== '' && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>🎭 Caption générée :</Text>
          <Text style={styles.captionText}>{caption}</Text>
        </View>
      )}

      {/* 3 CAPTIONS */}
      {captions.length > 0 && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>🎲 Choisis une caption :</Text>
          {captions.map((c, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.captionOption,
                selectedCaption === c && styles.captionOptionSelected,
              ]}
              onPress={() => setSelectedCaption(c)}
            >
              <Text style={[
                styles.captionOptionText,
                selectedCaption === c && styles.captionOptionTextSelected,
              ]}>
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* BOUTON UTILISER */}
      {(caption || selectedCaption) && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#28a745' }]}
          onPress={useCaption}
        >
          <Text style={styles.buttonText}>🎭 Créer le Meme</Text>
        </TouchableOpacity>
      )}

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

export default GeminiMemeScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  modeSelector: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    padding: 4,
  },
  modeBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  modeBtnActive: {
    backgroundColor: '#fff',
    elevation: 2,
  },
  modeBtnText: {
    color: '#999',
    fontWeight: '600',
  },
  modeBtnTextActive: {
    color: '#007AFF',
  },
  section: {
    width: '100%',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    fontSize: 14,
    textAlignVertical: 'top',
    minHeight: 100,
    marginBottom: 4,
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  uploadedText: {
    fontSize: 12,
    color: '#28a745',
    marginBottom: 10,
    textAlign: 'center',
  },
  resultBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    width: '100%',
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
    color: '#333',
  },
  captionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  captionOption: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8,
  },
  captionOptionSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#e8f4fd',
  },
  captionOptionText: {
    fontSize: 14,
    color: '#333',
  },
  captionOptionTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
