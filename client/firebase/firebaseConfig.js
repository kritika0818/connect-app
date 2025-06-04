// firebase/firebaseConfig.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from 'firebase/auth/react-native'; // ✅ Required for React Native
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCJmEs6Ju6-rZyX1OcUN7khTVBdIVHDSfk',
  authDomain: 'pcon-c636f.firebaseapp.com',
  projectId: 'pcon-c636f',
  storageBucket: 'pcon-c636f.appspot.com',
  messagingSenderId: '789947554837',
  appId: '1:789947554837:web:f8eae82ee023cb09ad021c',
  measurementId: 'G-6NN0DSH4YS',
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Use only one auth instance with persistence
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  // Fallback in case auth is already initialized (hot reload/dev env)
  auth = getAuth(app);
}

// Export initialized services
export { auth };
export const db = getFirestore(app);
