import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL } from '../config';

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
});

api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers['ngrok-skip-browser-warning'] = 'true';

    return config;
  },
  error => Promise.reject(error)
);

export default api;