import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const configString = import.meta.env.VITE_FIREBASE_CONFIG;

if (!configString) {
  console.warn('Firebase configuration is missing. Check your VITE_FIREBASE_CONFIG environment variable.');
}

const firebaseConfig = configString ? JSON.parse(configString) : {
  apiKey: "placeholder",
  authDomain: "placeholder.firebaseapp.com",
  projectId: "placeholder",
  storageBucket: "placeholder.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcde"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// Note: We are explicitly NOT initializing Firebase Auth here as per requirements.
// We will use Supabase Auth and map the Supabase User ID to Firebase records.
