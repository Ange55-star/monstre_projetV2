import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { AuthContext } from '../context/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import AudioRecordingScreen from '../screens/AudioRecordingScreen';
import ImageUploadScreen from '../screens/ImageUploadScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HistoryScreen from '../screens/HistoryScreen';
import MemePreviewScreen from '../screens/MemePreviewScreen';
import GeminiMemeScreen from '../screens/GeminiMemeScreen';
const Stack = createStackNavigator();

export const AppNavigator = () => {
  const { token } = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      {token == null ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AudioRecord" component={AudioRecordingScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="History" component={HistoryScreen} />
          <Stack.Screen name="ImageUpload" component={ImageUploadScreen} />
          <Stack.Screen name="MemePreview" component={MemePreviewScreen} />
          <Stack.Screen name="GeminiMeme" component={GeminiMemeScreen} />
        </>
      )}

    </Stack.Navigator>
  );
};