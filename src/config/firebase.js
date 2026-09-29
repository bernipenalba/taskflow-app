import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Estos valores vienen de variables de entorno (.env), nunca escritos a mano
// acá — así este archivo se puede subir a GitHub sin exponer credenciales.
// Ver .env.example para la lista de variables que hacen falta.
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Patrón Singleton: evita que Fast Refresh vuelva a inicializar Firebase
// (rompería con "Firebase App already exists") cada vez que se guarda un archivo.
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Por defecto, el SDK Web de Firebase guarda la sesión solo en memoria en
// React Native (no existe window.localStorage): se pierde al cerrar la app.
// initializeAuth + getReactNativePersistence(AsyncStorage) le pide que la
// guarde en el almacenamiento del dispositivo, para que la sesión sobreviva
// a cerrar y reabrir TaskFlow. Igual que con initializeApp, initializeAuth
// solo puede llamarse UNA vez por app — el try/catch cubre los Fast Refresh
// (la segunda vez, tira "auth/already-initialized" y se recupera la
// instancia ya creada con getAuth).
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  auth = getAuth(app);
}

export { auth };
export const db = getFirestore(app);
export default app;
