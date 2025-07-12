import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDYbK8RngSZIrDoEhRHNk4IUpKo5ed2zP8',
  authDomain: 'popeyevapestore.firebaseapp.com',
  projectId: 'popeyevapestore',
  storageBucket: 'popeyevapestore.appspot.com',
  messagingSenderId: '715048917564',
  appId: '1:715048917564:web:180efcfcdfa096b134c139',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth with persistence
const auth =
  getApps().length === 0
    ? initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      })
    : getAuth(app);

const firestore = getFirestore(app);

export { auth, firestore };

