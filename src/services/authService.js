import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../config/firebase';

// Traduce los códigos de error de Firebase a mensajes que un usuario
// entienda, en vez de mostrar algo como "auth/wrong-password" en pantalla.
const AUTH_ERROR_MESSAGES = {
  'auth/invalid-email': 'El email no es válido.',
  'auth/user-not-found': 'No existe una cuenta con ese email.',
  'auth/wrong-password': 'La contraseña es incorrecta.',
  'auth/invalid-credential': 'Email o contraseña incorrectos.',
  'auth/email-already-in-use': 'Ya existe una cuenta con ese email.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/network-request-failed': 'Sin conexión. Revisá tu internet e intentá de nuevo.',
};

const getFriendlyMessage = (error) =>
  AUTH_ERROR_MESSAGES[error.code] || 'Ocurrió un error. Probá de nuevo.';

export const registerWithEmail = async (email, password) => {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    return credential.user;
  } catch (error) {
    throw new Error(getFriendlyMessage(error));
  }
};

export const loginWithEmail = async (email, password) => {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  } catch (error) {
    throw new Error(getFriendlyMessage(error));
  }
};

export const logout = () => signOut(auth);
