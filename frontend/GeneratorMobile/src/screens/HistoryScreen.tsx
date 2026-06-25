/**
 * =====================================================
 * HISTORY SCREEN
 * =====================================================
 * ✔ Liste des memes créés (stockage AsyncStorage)
 * ✔ Suppression individuelle
 * ✔ Navigation vers MemePreview
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

type Meme = {
  id: number;
  title: string;
  imageUrl: string | null;
  audioDuration: number | null;
  createdAt: string;
};

const HistoryScreen = ({ navigation }: any) => {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  /**
   * 📦 Recharge à chaque fois qu'on entre sur cet écran
   */
  useFocusEffect(
    useCallback(() => {
      loadMemes();
    }, [])
  );

  const loadMemes = async () => {
    try {
      const data = await AsyncStorage.getItem('memes');
      setMemes(data ? JSON.parse(data) : []);
    } catch (error) {
      console.log('Load memes error:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMemes();
    setRefreshing(false);
  };

  /**
   * 🗑 Supprimer un meme de l'historique
   */
  const deleteMeme = (id: number) => {
    Alert.alert(
      'Supprimer',
      "Supprimer ce meme de l'historique ?",
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            const updated = memes.filter(m => m.id !== id);
            setMemes(updated);
            await AsyncStorage.setItem('memes', JSON.stringify(updated));
          },
        },
      ]
    );
  };

  /**
   * 🃏 Carte d'un meme
   */
  const renderItem = ({ item }: { item: Meme }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('MemePreview', {
        imageUrl: item.imageUrl,
        audioDuration: item.audioDuration,
        fromAudio: !item.imageUrl,
      })}
    >
      {/* THUMBNAIL */}
      {item.imageUrl ? (
        <Image
          source={{
            uri: item.imageUrl,
            headers: { 'ngrok-skip-browser-warning': 'true' },
          }}
          style={styles.thumbnail}
        />
      ) : (
        <View style={[styles.thumbnail, styles.audioThumb]}>
          <Text style={styles.audioIcon}>🎤</Text>
        </View>
      )}

      {/* INFO */}
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDate}>{item.createdAt}</Text>
        {item.audioDuration && (
          <Text style={styles.cardSub}>Durée : {item.audioDuration}s</Text>
        )}
      </View>

      {/* SUPPRIMER */}
      <TouchableOpacity onPress={() => deleteMeme(item.id)}>
        <Text style={styles.deleteBtn}>🗑</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      <Text style={styles.title}>📜 Historique</Text>

      {memes.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🎭</Text>
          <Text style={styles.emptyText}>Aucun meme créé pour l'instant</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.buttonText}>Créer mon premier meme</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={memes}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  audioThumb: {
    backgroundColor: '#e8f4fd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioIcon: {
    fontSize: 28,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  cardDate: {
    fontSize: 12,
    color: '#999',
  },
  cardSub: {
    fontSize: 12,
    color: '#666',
  },
  deleteBtn: {
    fontSize: 20,
    padding: 4,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 12,
    width: 250,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
