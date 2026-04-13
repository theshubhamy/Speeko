import { getApps, initializeApp } from 'firebase/app';
import { initializeAuth, inMemoryPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// ─── Firebase Config ──────────────────────────────────────────────────────────
// Fill in values from Firebase Console → Project Settings → Your apps (Web)
// then restart Metro so Expo picks up the new env vars.

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,

};

// ─── Init (guard against hot-reload re-initialization) ────────────────────────

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// ─── Auth ─────────────────────────────────────────────────────────────────────
// inMemoryPersistence: session lasts while the app is open.
// NOTE: Firebase v12 JS SDK removed getReactNativePersistence from firebase/auth.
// For cross-restart persistence, switch to @react-native-firebase in a dev build.

export const auth = initializeAuth(app, {
  persistence: inMemoryPersistence,
});

// ─── Firestore ────────────────────────────────────────────────────────────────

export const db = getFirestore(app);

// ─── Storage ──────────────────────────────────────────────────────────────────

export const storage = getStorage(app);

export default app;
