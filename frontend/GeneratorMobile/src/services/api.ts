import axios from 'axios';

// ⚠️ IMPORTANT
// Android réel = IP de ton PC
// Emulator = 10.0.2.2

const api = axios.create({
  baseURL: 'http://192.168.1.137:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;